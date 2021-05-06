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

function randomNumber (min, max) {
  if (max === undefined) return randomNumber(0, min);
  return Math.floor((max - min + 1) * Math.random()) + min;
}

module.exports = {
    deeplyCopy,
    randomNumber
}