const mongoose=require("mongoose");
const chatSchema = new mongoose.Schema({
    message:{
        type: String,
        required: true
    } ,
    //Each Message has an author
    authorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    //Each Message has an receiver
    receiverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
},{timestamps: true});
const Chat=mongoose.model("Chat", chatSchema ) 
module.exports={Chat}