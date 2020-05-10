const fs = require('fs');

module.exports = {
  createLitlJson,
  readLitlJson,
  validateLitlJson,
};

function createLitlJson(json) {
  try {
    fs.writeFileSync('litl.json', json.toString());
  } catch (error) {}
}

function readLitlJson() {
  try {
    const jsonString = fs.readFileSync('litl.json');
    return validateLitlJson(JSON.parse(jsonString));
  } catch (error) {
    return null;
  }
}

function validateLitlJson(json) {
  return json;
}
