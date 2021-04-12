const express=require("express");
const router=express.Router();
const {User}=require("../models/User");
router.get("/", (req,res)=>{
    res.render('./landing')
});
router.get("/signup", function(req,res){
    res.render("signup");
});
router.get("/login", function(req,res){
    res.render("login");
});
/*====================================
    Method to Handle Logout
======================================*/
router.get('/chatlogin-test', async (req, res)=>{
    //Fix Security, (CSRF Fatal)
    try{
        const userId=req.query.userId
        console.log(req.query.userId)
        const foundUser=await User.findById(userId)
        if(!foundUser){
            throw new Error('User not found')
        }
        req.session.isLoggedIn = true;
        req.session.user=foundUser;
        res.redirect('/chat')
        //res.send('User Logged in')
    }catch(err){
        req.session.isLoggedIn = false;
        res.send(`User not logged in ${err.message}`)
    }
})
/*====================================
    Method to Handle Logout
======================================*/
router.get("/logout", function(req,res){
    if (req.session) {
        req.session.destroy(function(err) {
          if(err) {
            return next(err);
          } else {
            return res.redirect('/');
          }
        });
    }   
});

module.exports=router;