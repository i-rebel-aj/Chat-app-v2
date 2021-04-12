exports.isLoggedIn=(req,res,next)=>{
    console.log(req.session.isLoggedIn)
    if(req.session.isLoggedIn){
        next()
    }else{
        res.send('Not Logged in')
    }
}