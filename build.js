const { tasks, log, debug } = require('./src/buildtool');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

tasks
({
    // TypeScript
    'src/*.ts': [ 'dist/paged.js', async (src, dest) =>
    {
        log('tsc', dest);

        execSync(__dirname + '/node_modules/.bin/spack');
    }]
});
