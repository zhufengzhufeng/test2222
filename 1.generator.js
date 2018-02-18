let fs = require('fs');
function promisify(fn) {
    return function (...args) {
        return new Promise(function (resolve, reject) {
            fn.call(null, ...args, function (err, data) {
                if (err) return reject(err);
                resolve(data);
            })
        })
    }
}
function promisifyAll(obj){
    Object.keys(obj).forEach(item=>{
        if(typeof obj[item] === 'function'){
            obj[item+'Async'] = promisify(obj[item])
        }
    });
}
promisifyAll(fs);
fs.readFileAsync('./1.txt', 'utf8').then(function (data) {
    console.log(data)
}, function (err) {
    console.log(err)
});