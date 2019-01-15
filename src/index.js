'use strict'

function runner(iter) {

  const outputArr = [];
  let result = null;

  function isPromise(value) {
    return value instanceof Promise;
  }

  function isFunction(value) {
    return typeof value === 'function';
  }

  let promiseChain = new Promise(resolve => resolve());


  do {
    result = iter.next();
    const { value } = result;
    let realValue = null;

    if (value === undefined) {
      break;
    }

    promiseChain = promiseChain.then(() => {
      if (!isPromise(value) && !isFunction(value)) {
          realValue = value;
          return realValue;
      }

      if (isPromise(value)) {
        return value.then(data => {
          realValue = data;
        });
      }

      if (isFunction(value)) {
        realValue = value();
        return realValue;
      }
    });

    promiseChain = promiseChain.then(() => {
      outputArr.push(realValue);
      return outputArr
    });

  } while (result.done === false)

  return promiseChain;
}


function sum(a, b) {
  return a + b;
}

const val = 20;


const prom = new Promise(res => {
  setTimeout(res, 1000, 10)
});


function *gen() {
    const a = yield () => sum(1, 2);
    const b = yield prom;
    const c = yield val;
    const d = yield prom;
    const e = yield val;
    const f = yield () => sum(2, 5);
}

// const iter = gen();

// console.log(iter.next());
// console.log(iter.next());
// console.log(iter.next());
// console.log(iter.next());

runner(gen()).then(console.log)

