const nodeExternals = require("webpack-node-externals");
const { RunScriptWebpackPlugin } = require("run-script-webpack-plugin");

const lazyImports = ["@nestjs/microservices/microservices-module", "@nestjs/websockets/socket-module", "class-transformer/storage"];

const loadenv = require("node-env-file");

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: ["webpack/hot/poll?100", options.entry],
    externals: [
      nodeExternals({
        allowlist: ["webpack/hot/poll?100"],
      }),
    ],
    output: {
      ...options.output,
      libraryTarget: "commonjs2",
    },
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({ name: options.output.filename, autoRestart: false }),
      new webpack.IgnorePlugin({
        checkResource(resource) {
          return lazyImports.includes(resource);
        },
      }),
      new webpack.DefinePlugin({
        env: (function () {
          loadenv(".env");
          return JSON.stringify({
            NODE_ENV: process.env.NODE_ENV,
            DB_HOST: process.env.DB_HOST,
            DB_PORT: process.env.DB_PORT,
            DB_DATABASE: process.env.DB_DATABASE,
            DB_SCHEMA: process.env.DB_SCHEMA,
            DB_USERNAME: process.env.DB_USERNAME,
            DB_PASSWORD: process.env.DB_PASSWORD,
            FRONTEND_URL: process.env.FRONTEND_URL,
          });
        })(),
      }),
    ],
  };
};
