const fs = require('fs');
const path = require('path');

const lib = {};

// create path base directory of the data folder

lib.basedir = path.join(__dirname, '/../.data/');

// write data to file
// dir holo base path er kon directory te file open korbo
// file refer the file name
// data refer content that i want to write
// kaj complete haoer por call bake dibe
lib.create = (dir, file, data, callback) => {
    // open file foe writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);
            // write data to file then close it
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false);
                            // as tthere is no error thats why we make false error callback function
                        } else {
                            callback('Err closing the new file');
                        }
                    });
                } else {
                    callback('Error writing new file');
                }
            });
        } else {
            callback('Could Now create new file it may already esist');
        }
    });
};

// read Data
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data);
    });
};

lib.update = (dir, file, data, callback) => {
    // file open for updating
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert the data to string
            const stringData = JSON.stringify(data);

            // truncate the file content pr clear the file

            fs.ftruncate(fileDescriptor, (err3) => {
                if (!err3) {
                    fs.writeFile(fileDescriptor, stringData, (err1) => {
                        if (!err1) {
                            fs.close(fileDescriptor, (err2) => {
                                if (!err2) {
                                    callback(false);
                                } else {
                                    callback('Error closing file');
                                }
                            });
                        } else {
                            callback('Error writing to file');
                        }
                    });
                } else {
                    console.log('Error truncating file');
                }
            });
        } else {
            console.log('Error updating file');
        }
    });
};

lib.delete = (dir, file, callback) => {
    // unlink file
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false);
        } else {
            callback('Error deleting file');
        }
    });
};

module.exports = lib;
