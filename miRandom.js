exports.random = function getRandomInt(min, max) {
//Will return a number inside the given range, inclusive of both minimum and maximum
//i.e. if min=0, max=20, returns a number from 0-20
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
