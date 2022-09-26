// before run set value NODE_ENV=staging;

// dependencies
const http = require('http');

const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environment');
const data = require('./lib/data');

const app = {};

// configuration
app.config = {
    port: 3000,
};

data.update('test', 'newFile', { Name: 'Englend', Language: 'English' }, (err) => {
    console.log('error is', err);
});
// create server

app.createServer = () => {
    const server = http.createServer(app.handleReqRes); // confusion**************************
    /*
In this line a server object has been created and when a request has
arise, that objet handle that request using app.handleReqRes function.
 */

    server.listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`);
    });
};
// handle Request Response
app.handleReqRes = handleReqRes;
// start server
app.createServer();
