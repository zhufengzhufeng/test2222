let Promise = require('./3.async');
let promise = new Promise(function (resolve, reject) {
    setTimeout(function(){
        resolve('ok');
    },1000)
});
var p2 = promise.then(function (data) {
    return new Promise(function(resolve,reject){
        resolve('zfpx')
    })
}, function (err) {
    console.log(err);
}).then(function(data){
    console.log(data);
},function(err){
    console.log(err)
})