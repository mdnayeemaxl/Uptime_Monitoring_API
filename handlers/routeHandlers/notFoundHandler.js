const handler = {};
handler.notFoundHandler = (requestProperties, callback) => {
    callback(400, {
        message: 'Your requested URL was not Found',
    });
    console.log('Not Found');
};
module.exports = handler;
