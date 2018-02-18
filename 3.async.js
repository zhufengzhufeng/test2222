function Promise(executor) {
    // Promise中需要接收一个执行函数
    let self = this;
    self.status = 'pending'; //默认是pending状态
    self.value = undefined; // 成功的原因
    self.reason = undefined; // 失败的原因
    self.onResolvedCallbacks = []; // 成功回调存放的地方
    self.onRejectedCallbacks = [];
    function resolve(value) { // 调用resolve 会传入为什么成功
        if (self.status === 'pending') { // 只有再pending才能转换成功态
            self.value = value; // 将成功的原因保存下来
            self.status = 'resolved'; // 状态改成成功态 
            // 依次执行成功的回调
            self.onResolvedCallbacks.forEach(item => item());
        }
    }
    function reject(reason) { // 调用reject会传入为什么失败
        if (self.status === 'pending') {
            self.reason = reason;
            self.status = 'rejected';
            self.onRejectedCallbacks.forEach(item => item());
        }
    }
    try {
        executor(resolve, reject);// executor中需要传入resolve和reject
    } catch (e) {
        // 如果executor执行发生异常，表示当前的promise是失败态
        reject(e);
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    // 如果返回的promise和then中返回的promise是同一个promise,根据规范要报类型错误
    // 相当于自己等待自己完成这是不科学的
    if (promise2 === x) {
        return reject(new TypeError('循环引用'))
    }
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        // 如果是对象可能是一个thenable(带有then方法)对象
        let called; // 成功或者失败不能同时调用
        try { // 如果用defineProperty定义的then方法获取时可能会有异常
            let then = x.then;
            // 如果then是函数,说明是promise,我们要让promse执行
            if (typeof then === 'function') {
                then.call(x, function (y) {
                    if (called) return;
                    called = true;
                    // 如果resolve的结果依旧是promise那就继续解析
                    resolvePromise(promise2, y, resolve, reject);
                }, function (err) {
                    if (called) return;
                    called = true;
                    reject(err);
                })
            } else {
                // 不是函数,x就是一个普通的对象,直接成功即可
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }

    } else {
        // 是普通值直接调用成功
        resolve(x);
    }
}
// then中要传入成功的回调和失败的回调
Promise.prototype.then = function (onFufilled, onRejected) {
    let self = this;
    let promise2; // promise2为then调用后返回的新promise
    // 如果要是成功就调用成功的回调,并将成功的值传入
    if (self.status === 'resolved') {
        promise2 = new Promise(function (resolve, reject) {
            try {
                // 执行时有异常发生,需要将promise2的状态置为失败态
                let x = onFufilled(self.value);
                // x为返回的结果
                // resolvePromise是对当前返回值进行解析,通过解析让promise2的状态转化成成功态还是失败态
                resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
                reject(e);
            }
        })
    }
    if (self.status === 'rejected') {
        promise2 = new Promise(function (resolve, reject) {
            try {
                let x = onRejected(self.reason);
                resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
                reject(e)
            }
        })
    }
    if (self.status === 'pending') {
        // 如果是等待态,就将成功和失败的回调放到数组中
        promise2 = new Promise(function (resolve, reject) {
            self.onResolvedCallbacks.push(function () {
                try {
                    let x = onFufilled(self.value);
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e);
                }
            });
            self.onRejectedCallbacks.push(function () {
                try {
                    let x = onRejected(self.reason);
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e);
                }
            })
        });
    }
    return promise2
}

module.exports = Promise;

