 let Promise = require('./Promise')
let p = new Promise(function(resolve,reject){
    resolve(new Promise(function(resolve,reject){
        console.log(2)
        resolve(1000)
    }))
});
console.log(1)
p.then(function(data){
   console.log(data);
},function(err){
    console.log(err,err)
})

p.then(null,function(err){
    console.log(err,err)
}).then(function)

