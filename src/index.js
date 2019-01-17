'use strict'

function isPromise(value) {
  return value instanceof Promise;
}

function isFunction(value) {
  return typeof value === 'function';
}

function runner(iter) {
  return new Promise (resolve => {
    const outputArr = [];
    let result = iter.next();

    function iterate(result) {
      const { value } = result;

      if (value === undefined) {
        return resolve(outputArr)
      }
      
      if (!isPromise(value) && !isFunction(value)) {
        outputArr.push(value);
      }
      
      if (isPromise(value)) {
        value
          .then(realValue => {
            outputArr.push(realValue);
            result = iter.next(realValue);
            iterate(result);
        })
      }
      
      if (isFunction(value)) {
        outputArr.push(value());
      }

      result = iter.next(outputArr[outputArr.length - 1]);
      return iterate(result);
    };

    iterate(result);
  })
}

// ===================================

function sum() {
  console.log(1);
  return [].reduce.call(arguments, (acc, el) => acc+=el);
}

const prom = x => new Promise(res => {
  console.log(2);
  setTimeout(res,2000,x);
})

function pow() {
  console.log(3);
  return [].reduce.call(arguments, (acc, el) => acc*=el);
}

const arr = [1,2,3,4]

function *gen() {
  const a = yield sum.bind(null, ...arr);
  const b = yield prom(a);
  const c = yield pow.bind(null, ...arr);
  const d = yield arr;
  yield a + b + c + d;
}

runner(gen()).then(data => console.log(data.pop() === '441,2,3,4' ? "Good Job" : "You are fail this task"))