// Environment
// Handle environment related thing

const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'mdnayeem',
};

environments.production = {
    port: 5000,
    envName: 'Production',
    secretKey: 'mdnayeem',
};
// determine which environment is passed
const currentEnvironment =    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corrosponding envieonment object

const environmentToExport =    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

module.exports = environmentToExport;
