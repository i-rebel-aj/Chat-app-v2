const express=require("express");
const router=express.Router();
const {User}=require("../models/User");
const {Chat}=require("../models/Chat");
const { isLoggedIn } = require("../middleware/auth");
router.get("/",[isLoggedIn], (req,res)=>{
    res.render("messenger/rules");
});
router.get("/:id",[isLoggedIn],async (req,res)=>{
    try{
        const receiver=await User.findById(req.params.id)
        const allUsers=await User.find({instituteID: receiver.instituteID})
        const allChatMessages=await Chat.find({$or:[{authorID: req.session.user._id, receiverID: receiver._id}, {authorID: receiver._id, receiverID: req.session.user._id}]}).sort({createdAt: 1})
        //console.log(allChatMessages)
        res.render('messenger/personalchat',{Users: allUsers, chattingTo:receiver, history: allChatMessages})
    }catch(err){
        console.log(err)
        res.send(`Something Went Wrong ${err.message}`)
    }
});
module.exports=router;