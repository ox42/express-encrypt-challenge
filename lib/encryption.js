const crypto = require('crypto');
const IV_LENGTH = 16; // AES

function create256BitKey(password) {
    let hash = crypto.createHash('sha256').update(String(password));
    return Buffer.from(hash.digest('base64').substr(0, 32));
}

function encrypt(text, password) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let key = process.env.encryption_key_prefix + password;
    let cipher = crypto.createCipheriv('aes-256-cbc', create256BitKey(key), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text, password) {

    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');

    let key = process.env.encryption_key_prefix + password;
    let decipher = crypto.createDecipheriv('aes-256-cbc', create256BitKey(key), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = { encrypt, decrypt };
