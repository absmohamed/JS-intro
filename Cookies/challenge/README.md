# The secret cookie challenge

For this challenge, run the server code in this directory:

1. Run `npm i` to install dependencies
2. Run `npm start` to start the server

Your challenge is to figure out what the server is doing to the cookie you send over with the key "secretKey". To figure it out, you'll have to use the Firefox browser console session to send a cookie from the client that has the key "secretKey", then examine the value that comes back from the server. You can express what the server is doing in a single word. Once you figure out what that word is, send it as the value in your cookie as the "secretKey" value.

The steps will be:
1. Open a Firefox session to `http://localhost:3000/`
2. Open the console (from inspect)
3. Add a cookie with the key "secretKey" (how do you do this? Look at the lesson to refresh your memory)
4. Refresh the page to send a GET request to the server
5. Look at the value for the cookie in the browser console (how do you do this? Look at the lesson to refresh your memory)
6. Change the value of the "secretKey" cookie - try to answer the riddle with a single word that describes what the server is doing to the cookie value, and provide that as the cookie value for "secretKey"

After 5 guesses, you'll be prompted to have a look at the code to solve it, but you can keep trying instead if you like! After every 5 guesses, the counter will be reset. The server logs the counter value if you want to see it.

You can clear the cookie if you like by going to /clearCookie?name=secretKey (but that won't reset the count).