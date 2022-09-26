// this file contains applications routes
// dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler'); 

const routes = {
    sample: sampleHandler,
    user: userHandler,
}; // this object hold all routes. For exmple if we request for
// www.go.com/sample then sampleHandler function will inscharged.
module.exports = routes;
