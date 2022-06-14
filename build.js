const { tasks, log, debug } = require('./src/buildtool');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let sass = require('sass');

tasks
({
    // TypeScript
    'src/*.ts': [ 'dist/paged.js', async (src, dest) =>
    {
        log('tsc', dest);

        execSync(__dirname + '/node_modules/.bin/spack');
    }],

    // SCSS
    'src/(**).scss': [ 'dist/$1.css', async (src, dest) =>
    {
        log('scss', dest);

        fs.writeFileSync(dest,
            sass.renderSync(
            {
                file: src,
                outFile: dest,
                sourceMap: debug,
                sourceMapEmbed: true
            }).css);
    }],
});
