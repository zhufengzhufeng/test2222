function Promise(executor) {
    // Promise中需要接收一个执行函数
    let self = this;
    self.status = 'pending'; //默认是pending状态
    self.value = undefined; // 成功的原因
    self.reason = undefined; // 失败的原因
    function resolve(value) { // 调用resolve 会传入为什么成功
        if(self.status === 'pending'){ // 只有再pending才能转换成功态
            self.value = value; // 将成功的原因保存下来
            self.status = 'resolved'; // 状态改成成功态 
        }
    }
    function reject(reason) { // 调用reject会传入为什么失败
        if(self.status === 'pending'){
            self.reason = reason;
            self.status = 'rejected';
        }
    }
    try {
        executor(resolve, reject);// executor中需要传入resolve和reject
    } catch (e) {
        // 如果executor执行发生异常，表示当前的promise是失败态
        reject(e);
    }
}
// then中要传入成功的回调和失败的回调
Promise.prototype.then = function(onFufilled,onRejected){
    let self = this;
    // 如果要是成功就调用成功的回调,并将成功的值传入
    if(self.status === 'resolved'){
        onFufilled(self.value);
    }
    if(self.status === 'rejected'){
        onRejected(self.reason);
    }
}
module.exports = Promise