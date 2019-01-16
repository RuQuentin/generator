'use strict'

function runner(iter) {
  function isPromise(value) {
    return value instanceof Promise;
  }

  function isFunction(value) {
    return typeof value === 'function';
  }

  return new Promise (resolve => {
    const outputArr = [];
    let realValue = null;
    let result = iter.next();

    function iterate(result) {
      const { value } = result;

      if (value === undefined) {
        resolve(outputArr)
        
      } else if (!isPromise(value) && !isFunction(value)) {
        realValue = value;
      } else if (isPromise(value)) {
        value
          .then(data => {
            result['value'] = data;
            return result;
        })
          .then(result => iterate(result))

      } else if (isFunction(value)) {
        realValue = value();
      }

      if (realValue !== null) {
        outputArr.push(realValue);
        result = iter.next(realValue);
        realValue = null;
  
        iterate(result);
      } 
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