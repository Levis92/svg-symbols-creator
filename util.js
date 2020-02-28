exports.getStyledTime = function() {
  function twoDigits(number) {
    return number < 10 ? "0" + number : number;
  }
  const date = new Date();
  const hours = twoDigits(date.getHours());
  const minutes = twoDigits(date.getMinutes());
  const seconds = twoDigits(date.getSeconds());
  return `\x1b[37m[${hours}:${minutes}:${seconds}]`;
};
