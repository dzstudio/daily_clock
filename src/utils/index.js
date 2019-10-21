import {Dimensions, PixelRatio, AsyncStorage} from 'react-native';

const deviceWidth = Dimensions.get('window').width; //设备的宽度
const deviceHeight = Dimensions.get('window').height;
let fontScale = PixelRatio.getFontScale(); //返回字体大小缩放比例
let pixelRatio = PixelRatio.get(); //当前设备的像素密度
const scale = deviceWidth / 375; //获取缩放比例

let timer;

const strToDate = str => {
  if (typeof str !== 'string') {
    return null;
  }
  let dateTmp = str.replace(/-/g, '/');
  let timestamp = Date.parse(dateTmp);

  return new Date(timestamp);
};

const getZoomValue = value => {
  return Math.ceil(value * scale);
};

const checkType = (target, type = 'object') => {
  return (
    Object.prototype.toString.call(target) ===
    `[object ${type.replace(/( |^)[a-z]/g, L => L.toUpperCase())}]`
  );
};

const isString = str =>
  Object.prototype.toString.call(str) === '[object String]';

const obj2param = obj => {
  let str = '';
  // eslint-disable-next-line no-unused-vars
  for (let key in obj) {
    str += `&${key}=${encodeURIComponent(obj[key])}`;
  }

  return str ? str.slice(1) : str;
};

const storageGet = key => {
  return AsyncStorage.getItem(key);
};

const storageSet = (key, value) => {
  return AsyncStorage.setItem(key, value);
};

const storageRemove = key => {
  return AsyncStorage.removeItem(key);
};

const debounce = (fn, delay = 3e2) => {
  return (...arg) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn && fn(...arg);
    }, delay);
  };
};

const cloneDeep = target => {
  if (checkType(target) || checkType(target, 'array')) {
    let result = checkType(target) ? {} : [];
    // eslint-disable-next-line no-unused-vars
    for (let key in target) {
      let value = target[key];
      if (checkType(value) || checkType(value, 'array')) {
        result[key] = cloneDeep(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  } else {
    return target;
  }
};

const getArrayStorage = async key => {
  let list = await storageGet(key);
  list = JSON.parse(list);
  list = list === null ? [] : list;
  return list;
};

const setArrayStorage = async (key, targetKey, target) => {
  let list = await getArrayStorage(key);
  let index = list.findIndex(item => item[targetKey] === target[targetKey]);
  if (index === -1) {
    list.push(target);
  } else {
    list.splice(index, 1, target);
  }
  await storageSet(key, JSON.stringify(list));
};

const getTargetStorage = async (key, targetKey, targetValue) => {
  let list = await getArrayStorage(key);
  let index = list.findIndex(item => item[targetKey] === targetValue);
  if (index !== -1) {
    return list[index];
  }
  return {};
};

const removeTargetStorage = async (key, targetKey, targetValue) => {
  let list = await getArrayStorage(key);
  let index = list.findIndex(item => item[targetKey] === targetValue);
  if (index !== -1) {
    list.splice(index, 1);
  }
  await storageSet(key, JSON.stringify(list));
};

export default {
  strToDate,
  deviceWidth,
  deviceHeight,
  fontScale,
  pixelRatio,
  getZoomValue,
  obj2param,
  isString,
  storageGet,
  storageSet,
  storageRemove,
  debounce,
  checkType,
  cloneDeep,
  getArrayStorage,
  setArrayStorage,
  removeTargetStorage,
  getTargetStorage,
};
