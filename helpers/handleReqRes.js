/*
 * Title: Handle Request Response
 * Description: Handle Resquest and response
 */
// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
const { parseJSON } = require('./utilities');

// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
    const parseUrl = url.parse(req.url, true); // true is used to condiser query string. for example
    // hellow.com/home?a=5&b=6. Here a=6 is query string.
    const path = parseUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, ''); // romove first / and last / from url to get path only. Exmpl: himan.com/student/id/. The path will be student/id only
    const method = req.method.toLowerCase(); // To see the request method type(post, get)
    const queryStringObject = parseUrl.query; // this object contain query variabls tada
    const headersObject = req.headers; // contains headers meta datas
    const decoder = new StringDecoder('utf-8');
    let realData = '';

    const requestProperties = {
        parseUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    };

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    req.on('data', (buffer) => {
        realData += decoder.write(buffer); // Jokhon post method e data ashbe req object er
        // upor data event fire kore buffer er modhe ashte thaka data gulo ke reade kore decode
        // kore realData te rakhbo
    });

    req.on('end', () => {
        realData += decoder.end(); // jokhon data buffer asha sesh hoe jabe tokhon
        // decoder ta off kore dite hobe.
        // response handle
        requestProperties.body = parseJSON(realData);

        chosenHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            // return the final response
            res.writeHead(statusCode);
            res.end(payloadString);
        });

        // res.end('Hellow world');
    });
};
// console.log(handler);
module.exports = handler;
