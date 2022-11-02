const glob = require('glob')
const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const getEntries = () => {
    const resultBuildFiles = {}
    glob
        .sync(path.resolve(__dirname, 'src/*.{js,css}'))
        .forEach((filePath) => {
            const filename = path.parse(filePath).name;
            const extension = path.extname(filePath).replace('.', '');
            resultBuildFiles[`${extension}/${filename}`] = [filePath];
        });

    return resultBuildFiles;
}

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'

  return {
    entry: getEntries(),
    output: {
      path: path.resolve(__dirname, './dist'),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/i,
          exclude: /(node_modules)/,
          use: {
              loader: MiniCssExtractPlugin.loader,
          },
        },
        {
          test: /\.css$/i,
          exclude: /src/,
          use: ['style-loader' ],
        },
        {
          test: /\.css$/i,
          use: [ 'css-loader' ],
        },
        {
          test: /\.css$/i,
          exclude: /(node_modules)/,
          use: ['postcss-loader'],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new RemoveEmptyScriptsPlugin(),
      new CleanWebpackPlugin({
          dry: false,
          cleanOnceBeforeBuildPatterns: [
              path.join(process.cwd(), 'dist/**/*'),
              '!src/**',
          ],
      }),
      new CopyPlugin({
        patterns: [
          { 
              from: 'public', 
              to: ''
          },
        ],
      })
    ],
    mode: argv.mode,
    devtool: 'source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 9000,
    },
    optimization: {
    ... isProduction ? {
          nodeEnv: 'production',
          chunkIds: 'deterministic',
          moduleIds: 'deterministic',
          minimize: true,
          removeAvailableModules: true,
          removeEmptyChunks: true,
          mergeDuplicateChunks: true,
          minimizer: [new TerserPlugin({
              extractComments: false, 
              parallel: true, 
              terserOptions: {
                  sourceMap: true,
                  compress: {
                      drop_console: false
                  },
                  format: {
                      comments: false
                  },
              },
          })],
      } : {}
    }
  }
}