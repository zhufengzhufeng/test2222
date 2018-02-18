let isType = function (type, obj) {
    return Object.prototype.toString.call(obj) === `[object ${type}]`
}
console.log(isType('Object', {}));
console.log(isType('Object', {}));
console.log(isType('String', 'hello'));
console.log(isType('String', 'hello'));


let isType = function (type) {
    return function (obj) {
        return Object.prototype.toString.call(obj) === `[object ${type}]`
    }
}
let isObject = isType('Object');
console.log(isObject({}));
console.log(isObject({}));




function after(times, cb) {
    return function () {
        if (--times === 0) {
            cb();
        }
    }
}
let eat = after(3, function () { console.log('吃完了') });
eat();
eat();
eat();



const fs = require('fs');
let promise = new Promise((resolve, reject) => { });
promise.then(data => {
    console.log(data); //代表一个用于不会返回的值
});



let fs = require('fs');
function read(file){
   
}
fs.readFile('./1.txt','utf8',function(err){
    
})





let fs = require('fs');
function read(file){
    return new Promise(function(resolve,reject){
        fs.readFile(file,'utf8',function(err,data){
            if(err) return reject(err);
            resolve(data);
        })
    })
}
Promise.all([read('1.txt'),read('2.txt')]).then(([template,data])=>{
    console.log({template,data})
})