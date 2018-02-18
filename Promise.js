function Promise(executor) {
    let self = this;
    self.value = undefined;
    self.reason = undefined;
    self.onFulFilledCallbacks = [];
    self.onRejectedCallbacks = [];
    self.status = 'pending';
    function resolve(value) {
        // if (value instanceof Promise) {
        //     return value.then(resolve, reject)
        // }
        setTimeout(function () {
            if (self.status === 'pending') {
                self.value = value;
                self.status = 'resolved';
                self.onFulFilledCallbacks.forEach(function (item) {
                    item(self.value);
                })
            }
        })
    }
    function reject(reason) {
        setTimeout(function () {
            if (self.status === 'pending') {
                self.reason = reason;
                self.status = 'rejected';
                self.onRejectedCallbacks.forEach(function (item) {
                    item(self.reason);
                })
            }
        })
    }
    try {
        executor(resolve, reject);
    } catch (e) {
        reject(e);
    }
}
function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('循环引用'))
    }
    let called;
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then;
            if (typeof then === 'function') {// 如果x不是函数
                then.call(x, function (y) {
                    if (called) return;
                    called = true
                    resolvePromise(promise2, y, resolve, reject);
                }, function (err) {
                    if (called) return;
                    called = true
                    reject(err);
                });
            } else {
                if (called) return;
                called = true
                resolve(x)
            }
        }
        catch (e) {
            if (called) return;
            called = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}
Promise.prototype.then = function (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (value) {
        return value;
    }
    onRejected = typeof onRejected === 'function' ? onRejected : function (value) {
        throw value
    }
    let self = this;
    let promise2;
    if (self.status === 'resolved') {
        return promise2 = new Promise(function (resolve, reject) {
            //setTimeout(function(){
                try {
                    let x = onFulfilled(self.value);
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            //})
        })
    }
    if (self.status === 'rejected') {
        return promise2 = new Promise(function (resolve, reject) {
            //setTimeout(function(){
                try {
                    let x = onRejected(self.reason);
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            //})
        })
    }
    if (self.status === 'pending') {
        return promise2 = new Promise(function (resolve, reject) {
            self.onFulFilledCallbacks.push(function (value) {
                    try {
                        let x = onFulfilled(value);
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
            })
            self.onRejectedCallbacks.push(function (reason) {
                    try {
                        let x = onRejected(reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
            })
        })
    }
}
Promise.prototype.catch = function (fn) {
    return this.then(null, fn);
}
Promise.deferred = Promise.defer = function () {
    var defer = {};
    defer.promise = new Promise(function (resolve, reject) {
        defer.resolve = resolve;
        defer.reject = reject;
    })
    return defer
}
module.exports = Promise; 