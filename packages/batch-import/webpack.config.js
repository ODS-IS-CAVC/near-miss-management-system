// eslint-disable-next-line @typescript-eslint/no-var-requires
const Dotenv = require("dotenv-webpack");

const lazyImports = ["@nestjs/microservices/microservices-module", "@nestjs/websockets/socket-module", "class-transformer/storage"];

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: ["./src/main.ts"],
    externals: [],
    output: {
      ...options.output,
      libraryTarget: "commonjs2",
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          return lazyImports.includes(resource);
        },
      }),
      new Dotenv({
        path: ".env",
      }),
    ],
  };
};
