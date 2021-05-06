const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const deeplyCopy = (s) => {
  let o = Object.prototype.toString.call(s) === '[object Array]' ? [] : Object.create(null);
  for (let prop of Object.keys(s)) {
    if (typeof s[prop] === 'object' && s[prop] !== null) {
      o[prop] = deeplyCopy(s[prop]);
    } else {
      o[prop] = s[prop];
    }
  }
  return o;
}

const formatPrecision = (number, precision = 2) => Math.round(number * 10 ** precision) / 10 ** precision;


module.exports = {
  formatTime,
  deeplyCopy,
  formatPrecision
}
