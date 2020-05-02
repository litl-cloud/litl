const fs = require('fs');

module.exports = {
  createLiteJson,
  readLiteJson,
  validateLiteJson,
};

function createLiteJson(json) {
  try {
    fs.writeFileSync('lite.json', json.toString());
  } catch (error) {}
}

function readLiteJson() {
  try {
    const jsonString = fs.readFileSync('lite.json');
    return validateLiteJson(JSON.parse(jsonString));
  } catch (error) {
    return null;
  }
}

function validateLiteJson(json) {
  return json;
}
