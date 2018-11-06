var mongoose=require ('mongoose')
var discussionSchema=new mongoose.Schema({
    
    username:String,
    email:String,
  title:String,
  description:String,
 
    comment:[{type:String}]
    })
    module.exports=mongoose.model('Discussions',discussionSchema);