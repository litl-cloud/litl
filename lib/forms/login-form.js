const { promptEmail, promptPassword } = require('./prompts');

module.exports = {
  loginForm,
};

async function loginForm(email) {
  if (email) {
    return new Promise(resolve => {
      promptPassword(password => {
        resolve({ email, password });
      });
    });
  }

  return new Promise(resolve => {
    promptEmail('', email => {
      promptPassword(password => {
        resolve({ email, password });
      });
    });
  });
}
