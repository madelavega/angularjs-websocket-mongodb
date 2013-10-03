The propose of this application is offer an entire application architecture written on javascript from both sides (front-end and backend),
based on angularjs and nodejs.

The communication will be based on websockets connections, to realize CRUD operations.

The database in this application is a MongoDB hosted in www.mongolab.com

Tested in Google Chrome 27, Firefox 21 and Safari 6

##Build client side

The client side need to be combined/offuscated using Grunt. First at all, you need install locally grunt dependencies with the following command:

    cd client
    npm install -d

It will find the dependencies to build the application.

Next, you need install the grunt client too as globally

    npm install -g grunt-client
    
Now, you could build the application. Simply run this command:

    grunt ---force