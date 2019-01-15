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
    const value = result.value;
    let realValue = null;

    if (value === undefined) {
      break;
    }

    if (!isPromise(value) && !isFunction(value)) {
      promiseChain = promiseChain.then(() => {
        realValue = value;
      });
    }

    if (isPromise(value)) {
      promiseChain = promiseChain.then(() => {
        return value.then(data => {
        realValue = data;
        })
      });
    }

    if (isFunction(value)) {
      promiseChain = promiseChain.then(() => {
        realValue = value();
      });
    }

    promiseChain = promiseChain.then(() => outputArr.push(realValue));

  } while (result.done === false)

  return new Promise(resolve => resolve(outputArr))
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

