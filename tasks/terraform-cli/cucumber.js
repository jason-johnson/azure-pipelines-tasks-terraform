let common = [
    'src/tests/features/**/*.feature', // Specify our feature files
    '--require-module ts-node/register', // Load TypeScript module
    '--require src/tests/steps/**/*.ts', // Load step definitions
    '--format progress-bar', // Load custom formatter
    '--format node_modules/cucumber-pretty' // Load custom formatter
].join(' ');

let report = [
    'src/tests/features/**/*.feature', // Specify our feature files
    '--require-module ts-node/register', // Load TypeScript module
    '--require src/tests/steps/**/*.ts', // Load step definitions
    '--format=json'
].join(' ');
    
module.exports = {
    default: common,
    report: report
};