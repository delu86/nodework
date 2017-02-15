const crypto = require('crypto'),
      algorithm = 'aes-256-ctr',
      password = 'd6F3Efeq'

function _encrypt(text){
  const cipher = crypto.createCipher(algorithm , password);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

module.exports=
{
    encrypt: _encrypt
}
