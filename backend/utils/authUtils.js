const CryptoJS = require('crypto-js');

function decryptPassword(encryptedPassword) {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, process.env.ENCRYPTED_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = {
  decryptPassword
};
