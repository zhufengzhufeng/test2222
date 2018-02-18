 let Promise = require('./Promises.js');
let promise = new Promise(function(resolve,reject){
       resolve(new Promise(function(resolve,reject){
           setTimeout(function(){
                resolve('test')
           },1000)
       }))
});

promise.then(function(data){
    console.log(data);
    return data;
})