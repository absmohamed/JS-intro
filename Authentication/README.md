# Authentication
We learned about authentication with Rails, where we used a gem called Devise. In Rails, we could have implemented our own authentication framework, but it makes sense to use one that has been provided by someone else in most cases.

## References
- [Passport](http://www.passportjs.org/)

## Passport
With the MERN stack, we will use a third party Express-based middleware called [Passport](http://www.passportjs.org/). Like we've already seen with Node and Express, we will have to do more configuration, even when we use a module like Passport, to set up our application authentication, but it does provide some useful functionality while still allowing the flexibility we need to create authentication for any particular application. 


## Authentication Methods
There are many different kinds of authentication methods being used.

* Local or Basic Authentication - username & password
* Tokens (for example, JSON Web Tokens or JWT) - unique token string sent in the header
* OAuth (Open Authorization) - Think login via Facebook or Google

## Passport & Strategies

Passport provides support for many authentication methods through modules called [strategies](http://www.passportjs.org/packages/). Strategies are simply different types of authentication methods. When we use Passport, we will specify which authentication strategies we want to use.

## Adding authentication to our blog application
In this lesson, we'll add authentication to our blog application using Passport. The code from previous lessons is in the **code** directory.

## Installing Passport
To use Passport we first need to install it. From the app project directory, install Passport and add it as a dependency.

```
npm i passport
```

**Local Strategy**

At the time of this writing Passport has 502 different strategies. The one we will need to use to replace our custom authentication mechanism is passport-local. Passport-local uses a username and password for authentication, which is perfect for us. Lets install it.

```
npm install passport-local --save
```

Now that we have the local strategy downloaded lets set it up. According to the passport documentation we need to define some methods on the passport object. The problem is where to place these methods. Lets create a new directory called config where we will have a passport.js file to hold all this configuration.

directory

```
app.js
index.js
├── config
    └── passport
```

Ok lets setup passport.

passport.js

```javascript
const passport = require("passport");
const LocalStrategy = require("passport-local");
const UserModel = require("./../database/models/user_model");

passport.use(new LocalStrategy({
        usernameField: "email"
    },
    async (email, password, done) => {
        const user = await UserModel.findOne({ email })
            .catch(done);

        if (!user || !user.verifyPasswordSync(password)) {
            return done(null, false);
        }

        return done(null, user);
    }
));
```

Here we are setting up the local strategy and passing it into passport. The default fields passport-local looks for when logging in a user is username and password but in our example we have email and password so we need to tell passport-local to look for this field instead. Next we have a callback function which verifies the users login credentials. Just like **next()** in our middleware passport uses done() to move on.

Next we need to actually connect passport to our application.

app.js

```javascript
const express = require("express");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const expressSession = require("express-session");
const MongoStore = require('connect-mongo')(expressSession);
const mongoose = require('mongoose');
const passport = require("passport");
const app = express();

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan("combined"));

app.use(require("./routes"));

app.use(express.static("public"));

app.use(require("./middleware/error_handler_middleware"));

module.exports = app;
```

Ok so in this file we are requiring our passport setup from the config/passport.js file then passing passport to our application as a middleware with **passport.initialize()**. We use passport.session() when we want passport to keep track of our logged in user 

So we have passport configured and bound to our application. Now lets actually use it within the login route.

index.js

```javascript
router.post("/login", celebrate({
    body: {
        email: Joi.string().required(),
        password: Joi.string().required()
    }
}), 
passport.authenticate('local', {
        successRedirect: "/dashboard",
        failureRedirect: "/login"
}));
```

Now when we fail to login (like if we use the wrong credentials) then passport will automatically redirect back to /login and if we are successful it will redirect us to /dashboard. Lets give it a try. Uh oh, looks like we got an error. We missed an important part of the passport setup. Because we are using sessions passport wants to know what we want to store in our session if the user is validated and how to use that information to retrieve our user from the database. Lets finish the setup.

passport.js

```javascript
const passport = require("passport");
const LocalStrategy = require("passport-local");
const UserModel = require("./../database/models/user_model");

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

passport.use(new LocalStrategy({
        usernameField: "email"
    },
    async (email, password, done) => {
        const user = await UserModel.findOne({ email })
            .catch(done);
        if (!user || !user.verifyPasswordSync(password)) {
            return done(null, false);
        }
        return done(null, user);
    }
));
```

The **serializeUser()** method stores information inside of our session relating to the passport user. We can see this if we go to the mongo shell.

```
mongo
use session-auth
db.sessions.find();
```

We see a new property in our document name passport and within that we have the user id of the logged in user. The deserializeUser() method gives us access to the information stored within the passport.user property of our session and allows us to return back data (in this case the user from the database) that will be appended to **req.user.**

Lets make sure this is working by sending back the value of req.user inside of our index method.

controllers/page_controller.js

```javascript
function index(req, res) {
    res.json(req.user);
    // req.session.views = req.session.views ? req.session.views + 1 : 1;
    // res.json(req.session.views);
}
```

And its working! So the only reason we are unable to go to /dashboard at the moment is because we need to change our validation middleware. Lets update it to no longer looks for req.session.user but instead just make sure we have req.user.

authorisation_middleware.js

```javascript
function authRedirect(req, res, next) {
    if (req.user) {
        return res.redirect("/dashboard");
    }

    return next();
}

function authorise(req, res, next) {
    if (req.user) {
        return next();
    }

    return res.redirect("/");
}

module.exports = {
    authRedirect,
    authorise
}
```

Ok so now we can get to /dashboard but we need to update our logic to look for the email on req.user and not req.session.user again.

page_controller.js

```javascript
function dashboard(req, res) {
    const email = req.user.email;
    console.log("yes");
    res.render("pages/dashboard", { email });
}
```

Awesome! Now its all working. Lets add in the logout functionality. Now currently our logout() function is still working however we are losing the views information because we are destroying the entire session. Instead of destroying the whole session lets use a method that passport gives us that only destroys its part of the session.

authentication_controller.js

```javascript
function logout(req, res) {
    req.logout();
    res.redirect("/");
}
```

Now when we logout we are not destroying the whole session. We can see this working if we turn our index() function back to displaying our page views.

page_controller.js

```javascript
function index(req, res) {
    req.session.views = req.session.views ? req.session.views + 1 : 1;
    res.json(req.session.views);
}
```

And yes its working. Last but not least we need to modify our code so that when a new user registers we create the user and then log them in.

authentication_controller.js

```javascript
async function registerCreate(req, res, next) {
    const { email, password } = req.body;
    const user = await UserModel.create({ email, password });
    
    req.login(user, (err) => {
        if (err) {
            return next(err);
        }

        res.redirect("/dashboard");
    });
}
```

**JWT Strategy**

Ok now that we have finished up using passport for our local strategy lets implement another authentication method name JWT (JSON Web Tokens).  JSON web tokens is an authentication standard that works by assigning and passing around an encrypted token in requests that helps to identify the logged in user, instead of storing the user in a session on the server and creating a cookie.

Lets modify our application to use JSON web tokens instead of relying on the user_id stored within the session. First thing that we need to do is install the passport-jwt strategy. 

```
npm install passport-jwt --save
```

Now lets setup the strategy.

passport.js

```javascript
const passport = require("passport");
const LocalStrategy = require("passport-local");
const UserModel = require("./../database/models/user_model");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

passport.use(new LocalStrategy({
        usernameField: "email",
        session: false
    },
    async (email, password, done) => {
        const user = await UserModel.findOne({ email })
            .catch(done);

        if (!user || !user.verifyPasswordSync(password)) {
            return done(null, false);
        }

        return done(null, user);
    }
));

passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    },
    async (jwt_payload, done) => {
        const user = await UserModel.findById(jwt_payload.sub)
            .catch(done);

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    }
));
```

Awesome now that the strategy is setup all we need to do is send the user this token when they login so they can use it to authenticate themselves elsewhere in the application. Lets do that now.

routes/index.js

```javascript
router.post("/login", celebrate({
    body: {
        email: Joi.string().required(),
        password: Joi.string().required()
    }
    }), passport.authenticate('local', {
        failureRedirect: '/login',
    session: false
}), AuthenticationController.loginCreate);
```

We have modified our login route so that when a user successfully is validated using the local strategy it no longer stores that user within the session. Instead it call the AuthenticationController.loginCreate() method where we are going to generate a JSON web token and send it back to the user. Now I don’t know about you but I have no idea how to create a JWT on my own so lets install another library that can generate our JWT’s for us.

```
npm install jsonwebtoken --save
```

Now on our authentication controller lets create the loginCreate() method to generate a JWT and send that back to the user.

authentication_controller.js

```javascript
const UserModel = require("./../database/models/user_model");
const jwt = require("jsonwebtoken");

function registerNew(req, res) {
    res.render("authentication/register");
}

async function registerCreate(req, res, next) {
    const { email, password } = req.body;
    const user = await UserModel.create({ email, password });
    req.login(user, (err) => {
        if (err) {
            return next(err);
        }

        res.redirect("/dashboard");
    });
}

function logout(req, res) {
    req.logout();
    res.redirect("/");
}

function loginNew(req, res) {
    res.render("authentication/login");
}

function loginCreate(req, res) {
    const token = jwt.sign({ sub: req.user._id }, process.env.JWT_SECRET);
    res.json(token);
}

module.exports = {
    registerNew,
    registerCreate,
    logout,
    loginNew,
    loginCreate
}
```

Awesome now when we login we get back a valid JSON web token. Lets use this JSON web token to access /dashboard. All we need to do is change the routes authorisation middleware from authorise to

```javascript
router.get("/dashboard", passport.authenticate('jwt', {session: false}), PageController.dashboard);
```

Now passport is going to use its JWT strategy to authorise our user. However we are not able to just go to /dashboard now. Instead we see a 401 unauthorised message. That is because of this line in our jwt strategy.

```javascript
jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
```

This is telling our strategy to look in our headers for one name authorization that has a value of Bearer {token}. We can see this if we go to Postman.

*Do this same request in your Postman. Just replace the string after Bearer (eg: eyjhbGc….) with your JSON web token*

![Screenshot of Postman request](./images/day75-postman.png) 

Now this is completely fine and standard bevaviour if we were using our Express server as an API only but we can’t set custom headers for GET requests in the browser (We can only do this by using http request libraries).

*What data does get sent along to our server as a header every single request?*

A cookie! So in this scenario if we wanted to continue using JWT we could set the token as a cookie. Lets first make sure we are setting the jwt token as a cookie when we login.

authentication_controller.js

```javascript
function loginCreate(req, res) {
    const token = jwt.sign({ sub: req.user._id }, process.env.JWT_SECRET);
    res.cookie("jwt", token);
    res.redirect("/dashboard");
}
```

Here we are setting our JWT token as a cookie name JWT. Now the only thing left to do is update our extractor function to look for a cookie named jwt. To make this even easier first lets install the cookie parser middleware.

```
npm install cookie-parser --save
```

And then add it as app level middleware

app.js

```javascript
const cookieParser = require("cookie-parser");
app.use(cookieParser());
```

Now that we can easily parse cookies lets update our jwt extractor function.

passport.js

```javascript
passport.use(new JwtStrategy(
    {
        jwtFromRequest: (req) => {
            let token = null;
            
            if (req && req.cookies) {
                token = req.cookies['jwt'];
            }

            return token;
        },
        secretOrKey: process.env.JWT_SECRET
    },
    async (jwt_payload, done) => {
        const user = await UserModel.findById(jwt_payload.sub)
            .catch(done);

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
     }
));
```

Awesome now we can view “/dashboard”. The last thing is when we logout the cookie is not being removed. Lets fix that now.

authentication_controller.js

```javascript
function logout(req, res) {
    req.logout();
    res.cookie("jwt", null, { maxAge: -1 });
    res.redirect("/");
}
```

Now we can actually logout! Remember we can remove cookies from our browser by setting it expiration date to sometime in the past.

**OAuth Strategy**

Now that we are masters of the local strategy and using JSON web tokens lets talk about one other authentication method that is very popular. That is OAuth (Open Authorisation). OAuth allows us to authorise our users by using a trusted 3rd party source. You may have seen things on the web like signing with Google or Facebook. These are examples of OAuth.

Now before we can actually setup OAuth in our application we must first create a new application on the OAuth provider itself. We have to do this so that the OAuth provider knows what kind of information the user is allowing us from their service. It will also generate an API key and secret we will need to pass to the OAuth provider to verify our application as well.

For this lesson we will setup OAuth using Google but it is a very similar process for any other provider as well. So as mentioned above the first thing we will need to do is create a new Google application we can do this from their developers console.

https://console.developers.google.com

```
//Need to put video or article in here for setting up Google Application for OAuth
//Create new project
//Enable Google+ API
//Create Credentials
//Download Credentials
```

Now that we have our client id and secret place those within your .env file. After that we can move on to setting up OAuth strategy but before we can do that we must download the strategy.

```
npm install passport-google-oauth20 --save
```

Now to do the strategy.

passport.js

```javascript
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/oauth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        if (profile.emails && profile.emails.length > 0) {
            const user = await UserModel.findOne({ email: profile.emails[0].value })
                .catch(done);

            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        }

        return done(null, false);
    }
));
```

The Google OAuth strategy needs the client id and the client secret to verify your application. Then within the callback function we get access to the accessToken and refreshToken which we don’t really care about in our scenario. The thing we care about is the profile and the email address contained within it. We use this email to search our own database and auto login the user since Google has already verified them.

Next we need to setup our routes. We need one route to direct us to Google OAuth for us to login and then we need another route that Google will call once the user has been verified (this is referred to as a redirect or callback route). Lets set those up.

routes/index.js

```javascript
router.get('/oauth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/oauth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        session: false
    }),
    AuthenticationController.loginCreate
);
```

The first route is what we will use to connect with Google. The scope option is what Google will ask the user if it wants to give use permission to those things. The second route is the callback route Google will use once a user is verified to pass data back into our application. Let improve our user experience so that a user only needs to click a button to login via google.

login.handlebars

```javascript
<div>
    <a href="/oauth/google">
        <button>Login via Google</button>
    </a>
</div>
```

Awesome! Now we have OAuth setup within our application!

**Security Improvements**

So you thought we were done huh. Almost but not quite. Lets think about what we have done. We are creating a JSON web token that never expires, storing it within a cookie and then using that token to verify our user.

*In this process what could we do to improve the security of our application?*

* Expire JWT
* Do not store JWT in a cookie

So the two things we could improve upon in our application is expiring the JWT. Our JWT is basically a very strong password and if someone where to get ahold of that token then they could authorise themselves as us and thats not a good thing. Which brings me to the second security improvement is storing that JWT within a cookie. Cookies are not a secure place to store any information! Now the web has gotten a lot better about securing our cookies but still they should not be trusted. 

*So if we want to expire our token and not store it within the cookie itself what could we do?*

How about we use the session! Lets modify our code to store our JWT within the session instead of directly in the cookie.

*See if the class can modify the code to use the session instead of the cookie.*

passport.js

```javascript
passport.use(new JwtStrategy(
    {
        jwtFromRequest: (req) => {
            if (req.session && req.session.jwt) {
                return req.session.jwt;
            }
            return null;
        },
        secretOrKey: process.env.JWT_SECRET
    },
    async (jwt_payload, done) => {
        const user = await UserModel.findById(jwt_payload.sub)
            .catch(done);

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    }
));
```

authentication_controller.js

```javascript
function loginCreate(req, res) {
    const token = jwt.sign({ sub: req.user._id }, process.env.JWT_SECRET);
    req.session.jwt = token;
    res.redirect("/dashboard");
}
```

There we go. Now we are using the session to store the token instead of the cookie. Which is way more secure and the session has an expiration which also takes care of expiring our token.
