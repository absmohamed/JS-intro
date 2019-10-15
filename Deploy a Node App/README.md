# Deploy a Node app

Our blog server is ready (or almost) ready to go! So, instead of keeping it locally we can deploy it and access it from everywhere. 
First of all we will deploy our Mongo DB on Atlas (MLab was the first idea, the reason of this decission will be explained in the lesson). We'll check if our express server (still local) can access to the remote DB and after that we will deploy it on Heroku.
Make sure that your app is a git repo because we'll need that.


- [Deploy a Node app](#deploy-a-node-app)
  - [References](#references)
  - [Deploy the database](#deploy-the-database)
  - [Environment variables in Node](#environment-variables-in-node)
  - [Deploy the server to Heroku](#deploy-the-server-to-heroku)
  - [Challenge](#challenge)

## References

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Environment variables in node](https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html)
- [Deploying Node.js Apps on Heroku](https://devcenter.heroku.com/articles/deploying-nodejs)
- [The Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

## Deploy the database

MLab was the first option to deploy the MongoDB but if we go to [mlab.com/login](https://www.mlab.com/login/) we can see a message telling us that it doesn't accept new users since February 2019. Heroku provides mlab users if we use its add-on but we need to include billing information in that process (it doesn't matter if we use the free option). That's we decided to teach this lesson with MongoDB Atlas. Anyway, the add-on option is available, it's secure and fast if you decide to use it in your future projects.

MongoDB Atlas is known as a DAAS (Database as a service) for mongo databases. We will use Atlas to setup a database that we will be able to reach once we push our application up to our remote servers. Lets get started. First we will need to signup for Atlas.

https://www.mongodb.com/cloud/atlas

After signing up we can follow the first steps and create a new cluster. When creating a cluster select AWS as the provider and a free provider region, then select create cluster. Atlas will take some minutes to spin up the cluster. Once the cluster has been created click the security tab. Under users click add new user and create a new user (remember to keep ahold of the username and password you use).
Once we have done that click on IP Whitelist. For this example we will use the option to allow access from anywhere but in the future we would want to limit this to certain IPs (our server's IP and out DB administrator's IP, for example).

To test our connection click connect -> connect your application  -> Connection string only. This string is useful to paste it as a reference for our server, so change the name of test to the name of our DB.

We can try to change the path of our database and run the server. We should get access to our new remote database!

```javaScript
//const dbConn = 'mongodb://localhost/blog_app'
const dbConn = 'mongodb+srv://username:password@clusterName.mongodb.net/dbName?retryWrites=true&w=majority'

```
(Obviously, we need new users and posts...)

![New user in Atlas](img/newUser.png)

![New post in Atlas](img/newPost.png)

Actually, is not a good practice to deploy a DB to production with data from the development environment. 

Once we have tried this we should go back the local db path.

## Environment variables in node

Working with environment variables is a great way to configure different aspects of your Node.js application. Many cloud hosts (Heroku, Azure, AWS, now.sh, etc.) and Node.js modules use environment variables. Hosts, for example, will set a PORT variable that specifies on which port the server should listen to properly work. Modules might have different behaviors (like logging) depending on the value of NODE_ENV variable.

Accessing environment variables in Node.js is supported right out of the box. When your Node.js process boots up it will automatically provide access to all existing environment variables by creating an env object as property of the process global object. If you want to take a peek at the object run the the Node.js REPL with node in your command-line and type:

```javaScript
console.log(process.env);
```

This code should output all environment variables that this Node.js process is aware of. To access one specific variable, access it like any property of an object:

```javaScript
console.log('The value of PORT is:', process.env.PORT);
```

You should see that the value of PORT is undefined on your computer. Cloud hosts like Heroku or Azure, however, use the PORT variable to tell you on which port your server should listen for the routing to work properly. Therefore, the next time you set up a web server, you should determine the `port` to listen on by checking PORT first and giving it a default value otherwise, and we can do the same with the `dbConn` variable

```javaScript
const port = process.env.PORT || 3000;

const dbConn = process.env.MONGODB_URI || 'mongodb://localhost/blog_app'
```

## Deploy the server to Heroku

The first thing we need to do is sign up in [Heroku](https://signup.heroku.com/login) if we haven't done it yet. 

The second step is to install the Heroku CLI: 

MacOS
```javaScript
brew tap heroku/brew && brew install heroku
```
Ubuntu
```javaScript
sudo snap install --classic heroku
```
or try other installation methods from the [official website](https://devcenter.heroku.com/articles/heroku-cli)

To verify your CLI installation, use this command:

```javaScript
heroku --version
```
After you install the CLI, run the `heroku login` command. You’ll be prompted to enter any key to go to your web browser to complete login. The CLI will then log you in automatically.

If you’d prefer to stay in the CLI to enter your credentials, you may run heroku this:

```javaScript
heroku login -i
```

Before going on with the heroku deployment we should ensure our project is ready to go. In package.json, check if all the dependencies we use are included in this file. Versions may be different, but not the modules.

```javaScript
"dependencies": {
    "body-parser": "^1.19.0",
    "connect-mongo": "^3.0.0",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "express-session": "^1.16.2",
    "mongoose": "^5.7.3",
    "passport": "^0.4.0",
    "passport-local": "^1.0.0",
    "passport-local-mongoose": "^5.0.1"
  }
```
If some of the dependencies aren't included use `npm install <pkg> --save`. This will install the package and also add it as a dependency in the `package.json file`. For example, to install express, you would type `npm install express --save`.

run `npm install` to make sure all dependencies are installed.

Development dependencies won't be included in the deployment, but we don't really need them in a production server. Moreover, we should change our start script from nodemon to node

The version of Node.js that will be used to run your application on Heroku, should also be defined in your `package.json` file. You should always specify a Node.js version that matches the runtime you’re developing and testing with. To find your version type 

```javaScript
node --version
```

Add to your package.json file this (including your current node version):

```javaScript
"engines": {
    "node": "10.x"
}
```

To determine how to start your app, Heroku first looks for a `Procfile`. If no `Procfile` exists for a Node.js app, it will attempt to start a default web process via the start script in your package.json.

If we don't create the `Procfile` our start script in `package.json` will work, but it’s considered a good practice to create the Procfile.

Use a Procfile, a text file in the root directory of your application, to explicitly declare what command should be executed to start your app.
The Procfile in the blog app you deployed looks like this:

```javaScript
web: node app.js
```
we should create/edit the .gitignore file, because there are some files and folders from the project we shouldn't include.

```javaScript
/node_modules
npm-debug.log
.DS_Store
/*.env
```

We can check that our server stills run locally, but through Heroku, so use this command and let's see what happens.

```javaScript
heroku local web
```
Running in a different port, right?

After you commit your changes to git, and adding a config variable for the database you can deploy your app to Heroku.

```javaScript
$ git add .
$ git commit -m "Added a Procfile."
$ heroku login
Enter your Heroku credentials.
...
$ heroku create

...

Git remote heroku added
//add the path of the Atlas DB 
heroku config:set MONGODB_URI=... 

$ git push heroku master

```
If we didn't have any error, we can go to Heroku in our browser, select our project and click open app. We should access to our server in a browser. After that, go to postman and check if everything is going OK.

## Challenge

PART 1
Create a client where you can do a request to your server with Fetch API that displays the posts. Add some HTML and CSS so the webpage looks like a blog.

PART 2
MongoDB Atlas and specially Heroku are very powerful cloud platforms. Do some research to discover different features, add-ons, etc. that may be helpful in your future projects. 

Deploy another express server on Heroku (repeating the full process will help you to fix the steps), create some config variables and then try the different options in the heroku browser.
