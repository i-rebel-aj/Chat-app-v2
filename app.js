const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require('http').createServer(app);
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const io = require('socket.io')(http);
const {Chat}=require("./models/Chat");
const {User}=require("./models/User");
const Users=User
const Message=Chat
require('dotenv').config();

//Connection To DB
mongoose.connect(process.env.DB_Production, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(()=>{
    console.log("Connected to mongoDB")
})
.catch(err=>{console.log(err)})

//Calling Middlewares
//app.use(morgan('dev'));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use('/public', express.static('public'));

app.use(session({
   resave: false, // don't save session if unmodified
   saveUninitialized: false, // don't create session until something stored
   secret: process.env.SessionSecret
 }));
//To have a global variable across
app.use(function(req,res,next){
   if(req.session.isLoggedIn){
      res.locals.currentUser=req.session.user;   
   }else{
      res.locals.currentUser=null;
   }
   next();
});



//Requiring Routes
const indexRoutes = require("./routes/index");
const chatRoutes=require("./routes/chat");
app.use("/", indexRoutes);
app.use("/chat", chatRoutes);

/*================================================
   Handling Socket (i.e the Chatting facility)
==================================================*/

var sockets={};
function getChatSocket(socket){
   return sockets["chat-user-"+socket];
}
function setChatSocket(socket, data){
   sockets["chat-user-"+socket] = data;
}
function deleteChatSocket(socket){
   delete sockets["chat-user-"+socket];
}
//On a Client Connection
io.on('connection', (socket) => {
   console.log('a user connected');
   socket.on('come_online', function (userId) {
      socket.soketid = userId;
      setChatSocket(socket.soketid, socket);
   });
   socket.on('disconnect', () => {
      console.log('user disconnected');
      var userId = socket.soketid;
      deleteChatSocket(socket.soketid);
   });
//    socket.on('create', function(room) {
//     socket.join(room);
//   });
   socket.on('chat_message', (message, to, from)=>{
         if(getChatSocket(to)){
            console.log("User is online and session has been established");
            getChatSocket(to).emit('chat_message',message, from);
         }else{
            console.log("user is not online");
         }
      socket.emit('chat_message',message,from);
      //Saving the message in database
      try{
         const sentMessage={
            message: message,
            authorID: from,
            receiverID: to
         }
         console.log(`Sent message is ${sentMessage}`)
         console.log(sentMessage)
         // const newMessage= new Message(sentMessage)
         // await newMessage.save()
         Message.create(sentMessage, (err, doc)=>{
            if(err){
               console.log(err)
            }
         })
      }catch(err){
         console.log(err)
      }
  });
});
/*=====================================
      Starting The Server
=======================================*/
http.listen(process.env.PORT||3000, process.env.IP, function () {
   console.log(`The Server Has started at port ${process.env.PORT||3000}`);
   //console.log(PORT);
});