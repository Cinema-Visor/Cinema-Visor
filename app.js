 var Request = require("request");
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/Visor", { useNewUrlParser: true });


var routes=require('./routes/index');
var users=require('./routes/users')
var Discussion=require('./models/discussion')


var app=express();
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(__dirname+"/public"));
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));
  app.use(flash());
  app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
  });
  app.use('/',routes);
app.use('/users',users);

app.post('/discoversearch',function(req,res){

    var type=req.body.selval;
 
    var query=req.body.name;
  

  
   
var genre=req.body.genre;


var pref=req.body.secpref;
var arrayofgenre= [ {
      id: 28,
      name: "Action"
    },
    {
      id: 12,
      name: "Adventure"
    },
    {
      id: 16,
      name: "Animation"
    },
    {
      id: 35,
      name: "Comedy"
    },

    {
      id: 18,
      name: "Drama"
    },
    {
      id: 10751,
      name: "Family"
    },
    {
      id: 14,
      name: "Fantasy"
    },
  
    {
      id: 27,
      name: "Horror"
    },
    
  
    {
      id: 10749,
      name: "Romance"
    },
    {
      id: 878,
      name: "Sci-Fi"
    },

  ]
  var myid;
arrayofgenre.forEach(function(cg){

if(cg.name==genre)
{
    myid=cg.id;
}


})









    if(type=="Movies")
    {
        Request.get("https://api.themoviedb.org/3/discover/movie?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&language=en-US&sort_by="+pref+"&include_adult=false&include_video=false&page=1&with_genres="+myid, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
      var found=JSON.parse(body);
     //  console.log(tvshows.results[0].title);
     var myhead="Results"
       res.render('index.ejs',{movies:found,myhead:myhead})
    })
    }
    else{
        var x=false;
var availarr=['popularity.desc','popularity.asc','vote_averge.desc','vote_averge.asc'];
availarr.forEach(function(gen){
if(pref==gen)
{x=true;

}


})
if(x==false){

    pref='popularity.desc';
}










  
      
        Request.get("https://api.themoviedb.org/3/discover/tv?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&language=en-US&sort_by="+pref+"&page=1&timezone=America%2FNew_York&with_genres="+myid+"&include_null_first_air_dates=false", (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
          var found=JSON.parse(body);
         //  console.log(tvshows.results[0].title);
         var myhead="Results";
           res.render('indextv.ejs',{shows:found,myhead:myhead})
        })
    
    
    }








    
})
app.post('/get',function(req,res){

var type=req.body.selval;

var query=req.body.name;

 var arr=query.split(" ");
var result="";
for(var i=0;i<arr.length;i++)
{
if(i<arr.length-1)
{
    result+=arr[i]+"+"
}
else{

    result+=arr[i];
}
}

if(type=="Movies")
{
    Request.get("https://api.themoviedb.org/3/search/movie?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&query="+result, (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
  var found=JSON.parse(body);
 //  console.log(tvshows.results[0].title);
 var myhead="Results"
   res.render('index.ejs',{movies:found,myhead:myhead})
})
}
else{
  
    Request.get("https://api.themoviedb.org/3/search/tv?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&query="+result, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
      var found=JSON.parse(body);
     //  console.log(tvshows.results[0].title);
     var myhead="Results";
       res.render('indextv.ejs',{shows:found,myhead:myhead})
    })


}

 })


/*
    app.post('/getmov',function(req,res){
var e=req.body.movnm;
Request.get("https://api.themoviedb.org/3/movie/"+e+"?api_key=2b6f6b0f9f52bbfa3376c020de4832e3", (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
        var selected=JSON.parse(body);
   //console.dir(body);
   Request.get("https://api.themoviedb.org/3/movie/"+e+"?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&append_to_response=videos", (error, response, body) => {
    if(error) {
        return console.dir(error);
    }

    var trailer=JSON.parse(body);
   //console.dir(body);
res.render('show.ejs',{item:selected,trailer:trailer})

})
})
}) */



app.post('/discussionbytitle',function(req,res){

var title=req.body.name;

Discussion.find({title:title},function(err,found){

 res.render('discussion.ejs',{all:found})


})




})



////////////////////////////////
app.get('/discuss',function(req,res){
    Discussion.find({},function(err,all){
        if(err){
            console.log(err)
        }
      
      // console.log(all);

      res.render('discussion.ejs',{all:all});
    
    
    })

})



app.get('/newdiscussion',function(req,res){

if(req.user==undefined)
{
    return res.render('login.ejs');
}
res.render('newdiscussion.ejs');
})

app.post('/add-discussion',function(req,res){
var title=req.body.topic;
var description=req.body.desc;
var username=req.user.username;
var email=req.user.email;
var obj={username,email,title,description};
Discussion.create(obj,function(err,dis){

    if(err){console.log(err)}
    else{

        Discussion.find({},function(err,all){


            res.render('discussion.ejs',{all:all});
        })
        
    }
})
})


app.get('/discover-movies',function(req,res){
    var myhead="Popular Movies"
    Request.get("https://api.themoviedb.org/3/movie/popular?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&language=en-US"+"&page="+req.params.id, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
    
        var popmov=JSON.parse(body);
      // console.log(tvshows.results[0].title);
       res.render('discover.ejs',{movies:popmov,myhead:myhead})


})


})



app.get('/discover-tvshows',function(req,res){

    var myhead="Popular Tv Shows"
    Request.get("https://api.themoviedb.org/3/tv/popular?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&language=en-US"+"&page="+req.params.id, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
    
        var populartvshows=JSON.parse(body);
      // console.log(tvshows.results[0].title);
       res.render('discovertv.ejs',{shows:populartvshows,myhead:myhead})


})


    
    })

app.post('/getmov', function (req, res) {
    var e = req.body.movnm;
    Request.get("https://api.themoviedb.org/3/movie/" + e + "?api_key=2b6f6b0f9f52bbfa3376c020de4832e3", (error, response, body) => {
        if (error) {
            return console.dir(error);
        }
        var selected = JSON.parse(body);

        Request.get("https://api.themoviedb.org/3/movie/" + e + "?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&append_to_response=videos", (error, response, body) => {
            if (error) {
                return console.dir(error);
            }

            var trailer = JSON.parse(body);
            var itsId = selected.id;
            Request.get("https://api.themoviedb.org/3/movie/" + itsId + "/reviews?api_key=2b6f6b0f9f52bbfa3376c020de4832e3", (error, response, body) => {
                if (error) {
                    return console.dir(error);
                }
                reviews = JSON.parse(body);

                Request.get("https://api.themoviedb.org/3/movie/" + itsId + "/casts?api_key=2b6f6b0f9f52bbfa3376c020de4832e3", (error, response, body) => {
                    if (error) {
                        return console.dir(error);
                    }
                    casts = JSON.parse(body);
                    res.render('show.ejs', { item: selected, trailer: trailer, reviews: reviews, casts: casts })
                })
            })
        })
    })
})



app.post('/get-tv', function (req, res) {
    
    var e = req.body.showname;
    //console.log(e);
    
    Request.get("https://api.themoviedb.org/3/tv/" + e + "?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&language=en-US", (error, response, body) => {
        if (error) {
            return console.dir(error);
        }
        var selected = JSON.parse(body);
       
        Request.get("https://api.themoviedb.org/3/tv/" + e + "/videos?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&language=en-US", (error, response, body) => {
            if (error) {
                return console.dir(error);
            }

            var trailer = JSON.parse(body);
            var itsId = selected.id;
            

            Request.get("https://api.themoviedb.org/3/tv/" + e + "/reviews?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&language=en-US&page=1", (error, response, body) => {
                if (error) {
                    return console.dir(error);
                }
                reviews = JSON.parse(body);
                https://api.themoviedb.org/3/tv/1399?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&append_to_response=credits
                Request.get("https://api.themoviedb.org/3/tv/"+e+"?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&append_to_response=credits", (error, response, body) => {
                    if (error) {
                        return console.dir(error);
                    }
                   
                    casts = JSON.parse(body);
                  
                    res.render('showtv.ejs', { item: selected, trailer: trailer, reviews: reviews, casts: casts })
                })
            })
        })
    })
})










app.get('/trending-all/:id',function(req,res){
   
    Request.get("https://api.themoviedb.org/3/trending/movie/day?api_key=2b6f6b0f9f52bbfa3376c020de4832e3"+"&page="+req.params.id, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        var tremov=JSON.parse(body);
        var type='movie';
        res.render('trending.ejs',{movies:tremov, type:type})
    })
});


app.post('/getpeople', function (req, res) {
    var e = req.body.personName;
        Request.get("https://api.themoviedb.org/3/person/" + e + "?api_key=2b6f6b0f9f52bbfa3376c020de4832e3", (error, response, body) => {
        if (error) {
            return console.dir(error);
        }
        var selected = JSON.parse(body);
        
        Request.get("https://api.themoviedb.org/3/person/" + e + "/movie_credits?api_key=2b6f6b0f9f52bbfa3376c020de4832e3", (error, response, body) => {
                if (error) {
                    return console.dir(error);
                }
                credits = JSON.parse(body);
                
                res.render('showPeople.ejs', { item: selected, credits:credits })
            })
    })
})











app.get('/tvshows/:id',function(req,res){
var myhead="Popular TV Shows"
    Request.get("https://api.themoviedb.org/3/tv/popular?api_key=2b6f6b0f9f52bbfa3376c020de4832e3"+"&page="+req.params.id, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
    
        var tvshows=JSON.parse(body);
      // console.log(tvshows.results[0].title);
       res.render('indextv.ejs',{shows:tvshows,myhead:myhead})


})




});

app.get('/tvshows/toprated/:id',function(req,res){
 var myhead="Top Rated TV Shows";
    Request.get("https://api.themoviedb.org/3/tv/top_rated?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&language=en-US"+"&page="+req.params.id, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
    
        var topratedtvshows=JSON.parse(body);
      // console.log(tvshows.results[0].title);
       res.render('indextv.ejs',{shows:topratedtvshows,myhead:myhead})
      // console.log(fullUrl(req));      


})




});

app.get('/tvshows/popular/:id',function(req,res){
    var myhead="Popular TV Shows";
    Request.get("https://api.themoviedb.org/3/tv/popular?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&language=en-US"+"&page="+req.params.id, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
    
        var populartvshows=JSON.parse(body);
      // console.log(tvshows.results[0].title);
       res.render('indextv.ejs',{shows:populartvshows,myhead:myhead})


})




});


app.get('/tvshows/airing-now/:id',function(req,res){
    var myhead="Airing-Today TV Shows";
    Request.get("https://api.themoviedb.org/3/tv/on_the_air?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&language=en-US"+"&page="+req.params.id, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
    
        var airingtvshows=JSON.parse(body);
      // console.log(tvshows.results[0].title);
       res.render('indextv.ejs',{shows:airingtvshows,myhead:myhead})


})




});

app.get('/popular-people/:id',function(req,res){
    
    Request.get("https://api.themoviedb.org/3/person/popular?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&language=en-US"+"&page="+req.params.id, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
    
        var people=JSON.parse(body);
      // console.log(tvshows.results[0].title);
       res.render('famous.ejs',{people:people})


})


})

app.get('/tvshows/airing-today/:id',function(req,res){
    var myhead="Airing-Now TV Shows";
    Request.get("https://api.themoviedb.org/3/tv/airing_today?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&language=en-US"+"&page="+req.params.id, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
    
        var airingtvshows=JSON.parse(body);
      // console.log(tvshows.results[0].title);
       res.render('indextv.ejs',{shows:airingtvshows,myhead:myhead})


})




});
app.get('/movies/popular/:id',function(req,res){
    var myhead="Popular Movies"
    Request.get("https://api.themoviedb.org/3/movie/popular?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&language=en-US"+"&page="+req.params.id, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
    
        var popmov=JSON.parse(body);
      // console.log(tvshows.results[0].title);
       res.render('index.ejs',{movies:popmov,myhead:myhead})


})




});
app.get('/movies/top-rated/:id',function(req,res){
var myhead="Top-Rated Movies"
    Request.get("https://api.themoviedb.org/3/movie/top_rated?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&language=en-US"+"&page="+req.params.id, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
    
        var popmov=JSON.parse(body);
      // console.log(tvshows.results[0].title);
       res.render('index.ejs',{movies:popmov,myhead:myhead})


})




});








app.get('/trending-movies/:id',function(req,res){
   
    Request.get("https://api.themoviedb.org/3/trending/movie/day?api_key=2b6f6b0f9f52bbfa3376c020de4832e3"+"&page="+req.params.id, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
       
        var tremov=JSON.parse(body);
        var type='movie';
        res.render('trending.ejs',{movies:tremov, type:type})
    })
});

app.get('/trending-tvshows/:id',function(req,res){
   
    Request.get("https://api.themoviedb.org/3/trending/tv/day?api_key=2b6f6b0f9f52bbfa3376c020de4832e3"+"&page="+req.params.id, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
    
        var tremov=JSON.parse(body);
        var type='tv';
        res.render('trendingtv.ejs',{shows:tremov, type:type})
    })
});

app.get('/trending-people/:id',function(req,res){

    Request.get("https://api.themoviedb.org/3/trending/person/day?api_key=2b6f6b0f9f52bbfa3376c020de4832e3", (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        
        var tremov=JSON.parse(body);
        var type='people';
        res.render('trendingpeople.ejs',{people:tremov, type:type})
    })
});

app.get('/movies/upcoming/:id',function(req,res){
   var myhead="Upcoming Movies";
    Request.get(" https://api.themoviedb.org/3/movie/upcoming?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&language=en-US"+"&page="+req.params.id, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
    
        var popmov=JSON.parse(body);
      // console.log(tvshows.results[0].title);
       res.render('index.ejs',{movies:popmov,myhead:myhead})


})




});
app.get('/movies/now-playing/:id',function(req,res){
   var myhead="Now-Playing Movies"
    Request.get(" https://api.themoviedb.org/3/movie/now_playing?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&language=en-US&page=1"+"&page="+req.params.id, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
    
        var popmov=JSON.parse(body);
      // console.log(tvshows.results[0].title);
       res.render('index.ejs',{movies:popmov,myhead:myhead})


})




});

app.get('/',function(req,res){

res.send('index.html');

})


 

app.get('/dashboard',function(req,res){



    var user=req.user;
 if(user===undefined)
    {
return res.render('login.ejs');
    }
else{ 
  
    var arrmov=[];
    var arrtv=[];
    user.watchlistmovie.forEach(function(watch){
     Request.get("https://api.themoviedb.org/3/movie/"+watch+"?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&language=en-US", (error, response, body) => {
         if(error) {
             return console.dir(error);
         }
     
         var mov=JSON.parse(body);
       
         arrmov.push(mov);
         
    
    })
    })
   
    user.watchlisttv.forEach(function(watch){
        Request.get("https://api.themoviedb.org/3/tv/"+watch+"?api_key=2b6f6b0f9f52bbfa3376c020de4832e3&language=en-US", (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
        
            var mov=JSON.parse(body);
          
            arrtv.push(mov);
            
       
       })
       })









setTimeout(function(){
    
res.render('dashboard.ejs',{email:user.email,Username:user.username,watchlist:arrmov,shows:arrtv,name:user.name})
},2000);


}
})




app.post('/addmovietolist',function(req,res){

var t=req.body.movie;
 var user=req.user;
 if(user===undefined){
     return res.render('login.ejs');
 }
 
user.watchlistmovie.push(t);
user.save();

res.redirect('/dashboard');

})

app.post('/addtvtolist',function(req,res){

    var t=req.body.tv;
  
     var user=req.user;
     if(user===undefined){
         return res.render('login.ejs');
     }
     
    user.watchlisttv.push(t);
    user.save();
res.redirect('/dashboard');
    
    })
    
    
    
  
    
    
    
   
   

/*
app.get('/:id',function(req,res){
    Request.get("https://api.themoviedb.org/4/list/1?api_key=2b6f6b0f9f52bbfa3376c020de4832e3"+"&page="+req.params.id, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
    
        var e=JSON.parse(body);
       // console.log(e.results[0].title);
       res.render('index.ejs',{movies:e})
    
    });
}
)*/

///auth now on

app.listen(2020);