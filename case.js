let Promise = require('./3.async');
let promise = new Promise(function(resolve,reject){
    setTimeout(function(){
        resolve('ok');
    },1000)
});
promise.then(function(data){
    return data+',no problem'
},function(err){
    console.log(err);
}).then(function(data){
    console.log(data);
},function(err){
    console.log(err);
});
