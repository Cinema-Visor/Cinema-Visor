var express=require('express')
var router=express.Router();
var user=require('../models/user')
var passport=require('passport')
var LocalStrategy=require('passport-local').Strategy


router.get('/register',function(req,res){
    res.render('register.ejs');
})

router.get('/login',function(req,res){
    res.render('login.ejs');
})

router.post('/register',function(req,res){

    var name=req.body.name;
    var email=req.body.email;
    var username=req.body.username;
    var password=req.body.password;
    var cpassword=req.body.cpassword;
  
   // console.log(name+" "+email+" "+username+" "+password+" "+cpassword);
    //
req.checkBody('name','Name is required').notEmpty();
req.checkBody('email','Email is not valid').isEmail();
req.checkBody('username','Username is Required').notEmpty();
req.checkBody('password','password is Required').notEmpty();
req.checkBody('cpassword','Password do not match').equals(req.body.password);



var errors=req.validationErrors();
if(errors){

    res.render('register.ejs',{error:errors})

}
else{
   
var newUser=new user({
    name:name,
    username:username,
    password:password,
    email:email
})
console.log(newUser)

user.createUser(newUser,function(err,user){
if(err)throw err;
console.log(user);

req.flash('success_msg','You are registered and now can Log-In!')
    res.redirect('/users/login')

})
}

})



passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

  passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});



router.post('/login',passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

router.get('/logout',function(req,res){
    req.logout();
    req.flash('success_msg','You are Successfully logged out')
    res.redirect('/users/login')
})






module.exports = router;