const { tasks, log, debug } = require('buildtool.js');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let sass = require('sass');

tasks
({
    // TypeScript
    'src/**.ts': [ 'dist/paged.js', async (src, dest) =>
    {
        log('tsc', dest);

        execSync(__dirname + '/node_modules/.bin/spack');

        // Patch footnote mapping
        let patch = 'area = node.closest(".pagedjs_page_content");'
        fs.writeFileSync(dest,
            fs.readFileSync(dest).toString()
            .replace(patch, patch+'\n' + ' '
            .repeat(16) + 'if (!area) return;'));
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
