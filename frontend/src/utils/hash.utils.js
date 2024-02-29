const crypto = require('crypto');
const SALT = '$ome$alt';

const generateHash = (text) => {
  return crypto.createHmac('sha256', SALT)
  .update(text)
  .digest('hex');
}

export { generateHash };