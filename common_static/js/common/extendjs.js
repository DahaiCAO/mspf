// ;var extend = (function() {
//     var isObjFunc = function(name) {
//         var toString = Object.prototype.toString
//         return function() {
//             return toString.call(arguments[0]) === '[object ' + name + ']'
//         } 
//     }
//     var isObject = isObjFunc('Object'),
//         isArray = isObjFunc('Array'),
//         isBoolean = isObjFunc('Boolean');
//     return function extend() {
//         var index = 0,isDeep = false,obj,copy,destination,source,i
//         if(isBoolean(arguments[0])) {
//             index = 1
//             isDeep = arguments[0]
//         }
//         for(i = arguments.length - 1;i>index;i--) {
//             destination = arguments[i - 1]
//             source = arguments[i]
//             if(isObject(source) || isArray(source)) {
//                 //console.log(source)
//                 for(var property in source) {
//                     obj = source[property]
//                     if(isDeep && ( isObject(obj) || isArray(obj) ) ) {
//                         copy = isObject(obj) ? {} : []
//                         var extended = extend(isDeep,copy,obj)
//                         destination[property] = extended 
//                     }else {
//                         destination[property] = source[property]
//                     }
//                 }
//             } else {
//                 destination = source
//             }
//         }
//         return destination
//     }
// })();

// 分析来源于：
// https://www.cnblogs.com/liuzhaoxu/p/8977748.html
// https://blog.csdn.net/Night_Emperor/article/details/77530302

;var extend = (function() {
  return function extend() {
// extend方法为jQuery对象和init对象的prototype扩展方法
// 同时具有独立的扩展普通对象的功能
// jQuery.extend = jQuery.fn.extend = function() {
    /*
  　　*target被扩展的对象
  　　*length参数的数量
  　　*deep是否深度操作
  　　*/
    var options,
      name,
      src,
      copy,
      copyIsArray,
      clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;
    // target为第一个参数，如果第一个参数是Boolean类型的值，则把target赋值给deep
    // deep表示是否进行深层面的复制，当为true时，进行深度复制，否则只进行第一层扩展
    // 然后把第二个参数赋值给target
    if (typeof target === 'boolean') {
      deep = target;
      target = arguments[1] || {};
      // 将i赋值为2，跳过前两个参数
      i = 2;
    }
    // target既不是对象也不是函数则把target设置为空对象。
    if (typeof target !== 'object' && !jQuery.isFunction(target)) {
      target = {};
    }
    // 如果只有一个参数，则把jQuery对象赋值给target，即扩展到jQuery对象上
    // extend(true, {});
    // extend(obj);
    if (length === i) {
      // this ==> jQuery/jQuery.fn
      target = this;
      // 如果i=2, --i是为了让循环从1开始，如果i=1, --i是为了让循环从0开始
      --i;
    }
    // 开始遍历需要被扩展到target上的参数
    for (; i < length; i++) {
      // 处理第i个被扩展的对象，即除去deep和target之外的对象
      if ((options = arguments[i]) != null) {
        // 遍历第i个对象的所有可遍历的属性
        for (name in options) {
          // 用src保存目标对象的属性
          src = target[name];
          // 用copy保存合并对象的属性
          copy = options[name];
          // 如果两个属性相等，就不用合并了
          if (target === copy) {
            continue;
          }
          // 当用户想要深度操作时，递归合并
          // copy是纯对象或者是数组
          if (
            deep &&
            copy &&
            (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))
          ) {
            // 如果是数组
            if (copyIsArray) {
              // 将copyIsArray重新设置为false，为下次遍历做准备。
              copyIsArray = false;
              // 判断被扩展的对象中src是不是数组
              clone = src && jQuery.isArray(src) ? src : [];
            } else {
              // 判断被扩展的对象中src是不是纯对象
              clone = src && jQuery.isPlainObject(src) ? src : {};
            }
            // 递归调用extend方法，继续进行深度遍历
            target[name] = jQuery.extend(deep, clone, copy);
          }
          // 如果不需要深度复制，则直接把copy（第i个被扩展对象中被遍历的那个键的值）
          else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    // 原对象被改变，因此如果不想改变原对象，target可传入{}
    return target;
  };
})();
