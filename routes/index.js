var express=require('express')
var router=express.Router();

router.get('/review',ensureAuth,function(req,res){
    res.render('review.ejs');
})

router.get('/viewprofile',ensureAuth,function(req,res){

res.render('dashboard.ejs');

})


function ensureAuth(req,res,next){
if(req.isAuthenticated()){
    return next();
}
else{
    res.redirect('/users/login');
}


}


module.exports = router;