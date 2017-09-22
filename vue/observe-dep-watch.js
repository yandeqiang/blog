// 转为访问器属性
function defineReactive (obj, key, val, shallow) {
  let dep = new Dep();
  let childOb = !shallow && observe(val)

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      if(Dep.target) {
        // 收集依赖
        dep.depend();
      }
      return val;
      // ...
    },
    set: function reactiveSetter (newVal) {
      if(newVal === val) return;
      // 继续递归遍历
      observe(newVal);
      // 触发依赖
      dep.notify();
      // ...
    }
  })
}

class Observer{
  constructor(data) {
    this.walk(data);
  }

  walk(data) {
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(data, keys[i], data[keys[i]])
    }
  }
}

// 递归，将 data 对象所有属性转化为访问器属性
function observe (data) {
  if(Object.prototype.toString.call(data) !== '[object Object]') return;
  new Observer(data);
}

class Dep{
  constructor() {
    this._subs = [];
  }
  depend () {
    this._subs.push(Dep.target)
  }
  notify() {
    this._subs.forEach(item => {
      item.fn();
    })
  }
}

Dep.target = null;

function pushTarget(watch) {
  Dep.target = watch;
}

function popTarget() {
  Dep.target = null;
}

class Watcher{
  constructor(exp, fn) {
    this.exp = exp;
    this.fn = fn;
    pushTarget(this);
    this.exp();
    popTarget();
  }
}

const data = {
  a: 1,
  b: 2
}

observe(data);

new Watcher(() => {
  return data.a + data.b;
}, () => {
  console.log('change')
})

new Watcher(() => {
  var sum = data.a + data.b;
  console.log('sum:' + sum);
  return sum;
}, () => {
  console.log('a+b')
})

setTimeout(() => {
  data.a = 3;
}, 1000)