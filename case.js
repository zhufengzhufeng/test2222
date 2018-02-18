let Promise = require('./3.async');
let promise = new Promise(function(resolve,reject){
    setTimeout(function(){
        resolve('ok');
    },1000)
});
promise.then(function(data){
    console.log(data);
},function(err){
    console.log(err);
});
promise.then(function(data){
    console.log(data);
},function(err){
    console.log(err);
});