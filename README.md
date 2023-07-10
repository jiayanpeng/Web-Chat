# Web Chat

## About 

Instant messaging application developed based on React + Socket.io + Ant Design.

This is not the final version of it, I will still optimize and update it in the future.

After logging in, users will enter a public chat room for realtime chat.

Provide two users for simulation, xiaoming and xiaoli.\
xiaoming: { username : xiaoming, password : 123456 }\
xiaoli: { username : xiaoli, password : 251691 }

## Start

When you receive the project, it does not include dependencies.

You need to open the terminal in the root directory and execute `npm install` or `yarn add` to install all dependencies.


After installing all dependencies, Next, enter `npm start` to Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

Now it still cannot run, you need to take out the webchatServer folder in the project separately, It is a server. 

Then open the terminal in the webchatServer folder. Enter `npm install` or `yarn add` to install the server's dependencies.

After installing all dependencies, Next, Enter `node '\server.js` Start Server

At this point, returning to [http://localhost:3000](http://localhost:3000) will enable normal operation

## License

MIT



