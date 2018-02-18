function Promise(executor) {
    let self = this;
    self.status = "pending";
    self.value = undefined;
    self.onResolvedCallbacks = [];
    self.onRejectedCallbacks = [];
    function resolve(value) {

        if (value instanceof Promise) {
            return value.then(resolve, reject)
        }
        if (self.status == 'pending') {
            self.value = value;
            self.status = 'resolved';
            self.onResolvedCallbacks.forEach(item => item(self.value));
        }
    }
    function reject(reason) {
        if (self.status == 'pending') {
            self.value = reason;
            self.status = 'rejected';
            self.onRejectedCallbacks.forEach(function (item) {
                item(self.value);
            })
        }
    }
    try {
        executor(resolve, reject)
    } catch (e) {
        reject(e);
    }
}
function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('循环引用'));
    }
    let then, called;

    if (x != null && ((typeof x == 'object' || typeof x == 'function'))) {
        try {
            then = x.then;
            if (typeof then == 'function') {
                then.call(x, function (y) {
                    if (called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, function (r) {
                    if (called) return;
                    called = true;
                    reject(r);
                });
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}
Promise.prototype.then = function (onFulfilled, onRejected) {
    let self = this;
    onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : function (value) {
        return value
    };
    onRejected = typeof onRejected == 'function' ? onRejected : function (value) {
        throw value
    };
    let promise2;
    if (self.status == 'resolved') {
        promise2 = new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    let x = onFulfilled(self.value);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });

        });
    }
    if (self.status == 'rejected') {
        promise2 = new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    let x = onRejected(self.value);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
    if (self.status == 'pending') {
        promise2 = new Promise(function (resolve, reject) {
            self.onResolvedCallbacks.push(function (value) {
                setTimeout(function () {
                    try {
                        let x = onFulfilled(value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                })
            });
            self.onRejectedCallbacks.push(function (value) {
                setTimeout(function () {
                    try {
                        let x = onRejected(value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                })
            });
        });
    }
    return promise2;
}
Promise.deferred = Promise.defer = function () {
    let dfd = {};
    dfd.promise = new Promise(function (resolve, reject) {
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd
}
Promise.prototype.catch = function (func) {
    return this.then(null, func)
}
module.exports = Promise



function $set(obj, fn) {
    let p = new Proxy(obj, {
        set(target, property, value, r) {
            if (obj[value] !== value) {
                console.log('数据变化');
                return Reflect.set(target, property, value, r)
            }
            return true
        }
    })
    fn(p);
}

let obj = { name: 'zfpx', age: 9, arr: [1, 2, 3] };
$set(obj.arr, function (o) {
    o.push('hello')
    console.log(o);
});

let promise = new Promise(() => {
    console.log('hello');
}); 
console.log('world')