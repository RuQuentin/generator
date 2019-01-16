// 'use strict'

function runner(iter) {
  function isPromise(value) {
    return value instanceof Promise;
  }

  function isFunction(value) {
    return typeof value === 'function';
  }

  let promiseChain = Promise.resolve();

  const outputArr = [];
  // let result = null;
  let realValue = null;
  // let done = false;

  function addThen(realValue) {
    promiseChain = new Promise( resolve => {
      // console.log(realValue)
      result = iter.next(realValue);
      const { value } = result;
      // const { done } = result;
            
      if (value === undefined) {
        // console.log('value = undefined')
      } else if (!isPromise(value) && !isFunction(value)) {
        // console.log('value')
        realValue = value;
      } else if (isPromise(value)) {
        // console.log('promise')

        resolve(value.then(realValue => {
          return {result, realValue};
        }
        ))

      } else if (isFunction(value)) {
        // console.log('function')
        realValue = value();
      }

      resolve({result, realValue});
    })

    .then( data => {
      outputArr.push(data['realValue']);

      if (data['result'].done) {
        return outputArr;
      }

      return data['realValue'];
    })

    .then ( data => {
      if (data === outputArr) {
        return data;
      }

      addThen(data)
    })
  };

  addThen(realValue);


  return promiseChain.then(data => data);
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
    console.log(a, b, c, d, e, f)
}

const iter = gen();

// console.log(iter.next());
// console.log(iter.next());
// console.log(iter.next());
// console.log(iter.next());

runner(gen()).then(console.log)