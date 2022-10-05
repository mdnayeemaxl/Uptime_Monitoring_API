// Token related handler
// Handler to handle token related routes
const data = require('../../lib/data');
const { parseJSON } = require('../../helpers/utilities');

// const { parseJSON } = require('../../helpers/utilities');
const { hash } = require('../../helpers/utilities');
const { createRandomString } = require('../../helpers/utilities');

const handler = {};
handler._token = {};
handler.tokenHandler = (requestProperties, callback) => {
    const acceptendMethods = ['get', 'post', 'put', 'delete'];
    if (acceptendMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._token.post = (requestProperties, callback) => {
    const phone =        requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password =        requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    if (phone && password) {
        data.read('users', phone, (err1, userData) => {
            const hashpassword = hash(password);

            if (hashpassword === parseJSON(userData).password) {
                const tokenId = createRandomString(20);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    phone,
                    id: tokenId,
                    expires,
                };
                // store token
                data.create('tokens', tokenId, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, tokenObject);
                    } else {
                        callback(500, {
                            error: 'There was a problem in the server',
                        });
                    }
                });
            } else {
                callback(400, { err: 'Passworf is not valid' });
            }
        });
    } else {
        callback(400, {
            error: 'You may have problem in request',
        });
    }
};
handler._token.get = (requestProperties, callback) => {
    const id =        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;
    if (id) {
        // look up the token
        data.read('tokens', id, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) };
            if (!err && token) {
                callback(200, token);
            } else {
                callback(404, { error: 'requested token was not found' });
            }
        });
    } else {
        callback(404, { error: 'requested users was not found' });
    }
};

handler._token.put = (requestProperties, callback) => {};
handler._token.delete = (requestProperties, callback) => {};

module.exports = handler;
