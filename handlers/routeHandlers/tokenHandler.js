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

handler._token.put = (requestProperties, callback) => {
    const id = requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;

    const extend = requestProperties.body.extend === true;
    if (id && extend) {
        data.read('tokens', id, (err1, tokenData) => {
            const tokenObject = parseJSON(tokenData);
            if (tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                // store the update token
                data.update('tokens', id, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200);
                    } else {
                        callback(500, { error: 'Token already expired' });
                    }
                });
            } else {
                callback(400, { error: 'Token Already Expire' });
            }
        });
    } else {
        callback(400, { error: 'Requested token was not Found' });
    }
};

handler._token.delete = (requestProperties, callback) => {
    // delete token means user logout
    const id =        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;
    if (id) {
        data.read('tokens', id, (err1, tokendata) => {
            if (!err1 && tokendata) {
                data.delete('tokens', id, (err2) => {
                    if (!err2) {
                        callback(200, { message: 'Token successfully deleted' });
                    }
                });
            } else {
                callback(400, { error: 'There is a problem in your request' });
            }
        });
    } else {
        callback(400, { error: 'There is a problem in your request' });
    }
};

handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            if (parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

module.exports = handler;
