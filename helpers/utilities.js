const utilities = {};
const crypto = require('crypto');
const environments = require('./environment');

utilities.parseJSON = (jsonString) => {
    let output;

    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};

utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
        return hash;
    }
    return false;
};

// create rndom string
utilities.createRandomString = (strlength) => {
    const length = typeof strlength === 'number' && strlength > 0 ? strlength : false;
    if (length) {
        const pcharacter = 'abcdefghjklmnopqrstuvwxyz1234567890';
        let output = '';
        for (let i = 0; i < length; i++) {
            const randomCharacter = pcharacter.charAt(
                Math.floor(Math.random() * pcharacter.length)
            );
            output += randomCharacter;
        }
        return output;
    }
    return false;
};

module.exports = utilities;
