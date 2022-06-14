const { config } = require('@swc/core/spack');

module.exports = config({
    entry: {
      paged: __dirname + "/src/index.ts",
    },
    output: {
      path: __dirname + "/dist",
    },
});
