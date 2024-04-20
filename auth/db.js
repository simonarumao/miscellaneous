const mongoose = require('mongoose')

module.exports = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/auth',{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>
{
    console.log(" mongo connection open");
})
.catch(err=>{
    console.log("oh no error mongo connection error");
    console.log(err);
})
}