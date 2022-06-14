const { readdirSync, statSync, mkdirSync, existsSync, unlinkSync, watch } = require("fs");
const { join, dirname, basename } = require("path");
const { stdout, argv, exit } = require("process");
const md5 = require('md5-file');

//

const debug = argv.indexOf('--release') < 0;
const wantWatch = argv.indexOf('-w') >= 0;

if (argv.indexOf('-h') >= 0
 || argv.indexOf('--help') >= 0)
{
    let prefix = 'Usage: ' + basename(argv[1]);

    console.log(prefix, '[-w] [-h|--help] [--release]\n');
    console.log(' '.repeat(prefix.length), ' -w        Watch files for changes after the first build.');
    console.log(' '.repeat(prefix.length), '--help     Print this help message.');
    console.log(' '.repeat(prefix.length), ' -h');
    console.log(' '.repeat(prefix.length), '--release  Build in release mode (default is debug).');
    console.log(' '.repeat(prefix.length), '           This will disable source maps and enable');
    console.log(' '.repeat(prefix.length), '           code minification.');

    exit();
}

//

function log(tag, ...args)
{
    let pad = '';
    for (let i = tag.length; i < 4; i++)
    { pad += ' '; }

    console.log('[\033[1;36m' + tag + '\033[0m]' + pad, ...args);
}

String.prototype.replaceAll = function(from, to) { return this.split(from).join(to); }

let process = async (tasks, ent) =>
{
    try {
        let st = statSync(ent);

        if (st.isDirectory())
        {
            // Descend into directory
            let contents = readdirSync(ent);
            for (let subEnt of contents)
            {
                await process(tasks, join(ent, subEnt));
            }

            if (wantWatch)
            {
                watch(ent).on('change', async (_, subEnt) =>
                {
                    let path = join(ent, subEnt);

                    if (path.startsWith('.git/')
                     || path.startsWith('dist/'))
                    { return; }

                    stdout.write('\r\033[K');
                    await process(tasks, path);

                    stdout.write('[Watching files]');
                });
            }

            return;
        }
        for (let task of Object.values(tasks))
        {
            let m = ent.match(task[0]);
            if (m)
            {
                let dest = task[1];
                let f = task[2];

                let allGroups = [];
                for (let g = 1; g < m.length; g++)
                {
                    dest = dest.replaceAll(`$${g}`, m[g]);
                    allGroups.push(m[g]);
                }
                dest = dest.replaceAll('$@', allGroups.join(' ').trim());

                if (task[3] == '!hash')
                {
                    let m = dest.match(/(.*)\.(.+)/);
                    dest = `${m[1]}.${md5.sync(ent)}.${m[2]}`;

                    if (existsSync(dirname(dest)) && !existsSync(dest))
                    {
                        // File changed. Delete previous version(s)
                        for (let ent of readdirSync(dirname(dest)))
                        {
                            if (ent.length == basename(dest).length
                            && ent.startsWith(basename(m[1]) + '.')
                            && ent.endsWith('.' + m[2]))
                            {
                                unlinkSync(join(dirname(dest), ent));
                            }
                        }
                    }
                }

                if (existsSync(dest))
                {
                    let destSt = statSync(dest);
                    if (destSt.mtime >= st.mtime) { continue; }
                }

                mkdirSync(dirname(dest), { recursive: true });
                await f(ent, dest);
            }
        }
    }
    catch (e)
    {
        console.log(e.message)
    }
}

//

module.exports =
{
    log: log,
    debug: debug,
    tasks: async (tasks) =>
    {
        // Compile source file patterns
        for (let pattern in tasks)
        {
            if (pattern.startsWith('hash:'))
            {
                pattern = pattern.substr(5);
                tasks[pattern] = tasks[`hash:${pattern}`];
                delete tasks[`hash:${pattern}`];

                tasks[pattern].push('!hash');
            }

            let r = new RegExp('^' + pattern.replaceAll('/', '\\/')
                                           .replaceAll('.', '\\.')
                                           .replaceAll('**', '.+')
                                           .replaceAll('*', '[^\/]+') + '$');
            tasks[pattern].unshift(r);
        }

        // Collect source root directories
        srcDirs = new Set();
        for (let pattern in tasks)
        {
            if (pattern.indexOf('/') < 0) { srcDirs.add('.'); continue; }
            srcDirs.add(pattern.substr(0, pattern.indexOf('/')));
        }

        // Process source files
        for (let dir of srcDirs)
        {
            await process(tasks, dir);
        }
        if (wantWatch)
        {
            stdout.write('[Watching files]');
        }
    }
}
