import * as Config from '../config';
import Utils from '../utils';
import moment from 'moment';

export const loadClocks = async () => {
  let clocks = await Utils.storageGet(Config.CLOCK_STORAGE);

  try {
    clocks = JSON.parse(clocks);
  } catch (error) {
    clocks = {};
  }

  if (!clocks || typeof clocks === 'string') {
    clocks = {};
  }

  return clocks;
};

export const setClock = async (dateTime, isOn = true) => {
  let isDate = dateTime instanceof Date;
  if (!isDate) {
    return false;
  }

  // 读取打卡数据
  let clocks = await loadClocks();

  // 读取时间键
  let year = dateTime.getFullYear();
  let month = dateTime.getMonth();
  let date = dateTime.getDate();

  // 读取已打卡时间信息并设置打卡时间
  let yearPart = clocks[year] ? clocks[year] : {};
  let monthPart = yearPart[month] ? yearPart[month] : {};
  let datePart = monthPart[date] ? monthPart[date] : {};
  if (isOn) {
    if (!datePart.onClock) {
      datePart.onClock = moment(dateTime).format('YYYY-MM-DD HH:mm:ss');
    }
  } else {
    datePart.offClock = moment(dateTime).format('YYYY-MM-DD HH:mm:ss');
  }

  // 存储打卡信息
  monthPart[date] = datePart;
  yearPart[month] = monthPart;
  clocks[year] = yearPart;
  await Utils.storageSet(Config.CLOCK_STORAGE, JSON.stringify(clocks));

  return true;
};

export const getTodayClock = async () => {
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();
  let date = today.getDate();

  let clocks = await loadClocks();
  let yearPart = clocks[year] ? clocks[year] : {};
  let monthPart = yearPart[month] ? yearPart[month] : {};
  let datePart = monthPart[date] ? monthPart[date] : {};

  return datePart;
};

export const setOnClock = async dateTime => {
  return await setClock(dateTime);
};

export const setOffClock = async dateTime => {
  return await setClock(dateTime, false);
};

export const updateSettings = async settings => {
  await Utils.storageSet(Config.SETTINGS_STORAGE, JSON.stringify(settings));
};

export const getSettings = async () => {
  let settings = await Utils.storageGet(Config.SETTINGS_STORAGE);
  settings = settings ? JSON.parse(settings) : {};

  return settings;
};
