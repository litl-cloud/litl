module.exports = {
  print,
};

function print(str, padding = true) {
  str = str || '';
  if (padding) {
    str = '   ' + str;
  }
  console.log(str);
}
