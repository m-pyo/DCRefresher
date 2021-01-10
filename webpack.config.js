const path = require('path')
const fs = require('fs')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ZipWebpackPlugin = require('zip-webpack-plugin')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const pkg = JSON.parse(fs.readFileSync('./package.json'))

module.exports = (env, argv) => {
  let devMode = argv.mode === 'development'

  const options = {
    entry: {
      refresher: ['babel-polyfill', path.resolve('src', 'index.ts')]
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000
    },
    module: {
      rules: [
        {
          exclude: /(node_modules|_old_src|(sa|sc|c)ss|background)/,
          test: /\.js|\.ts$/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          exclude: /\.js|\.ts|\.woff2/,
          test: /\.(sa|sc|c)ss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        },
        {
          test: /\.(ico|png|jpg|jpeg)?$/,
          loader: 'file-loader',
          options: {
            name: '[hash].[ext]'
          }
        },
        {
          test: /\.json?$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        },
        {
          test: /\.pug$/,
          loader: 'pug-loader',
          options: {
            globals: {
              RefresherVersion: pkg.version || '1.0.0',
              RefresherDevMode: devMode
            }
          }
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'refresher.bundle.css'
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/manifest.json',
            transform: (content, _p) => {
              return Buffer.from(
                JSON.stringify({
                  description: pkg.description,
                  version: pkg.version,
                  ...JSON.parse(content.toString())
                })
              )
            }
          }
        ]
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/assets',
            to: 'assets/'
          }
        ]
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/root',
            to: './',
            filter: async path => {
              if (devMode) {
                return path.indexOf('/vue.min.js') === -1
              }

              return path.indexOf('/vue.js') === -1
            }
          }
        ]
      }),
      new HtmlWebpackPlugin({
        template: './src/views/index.pug',
        filename: 'views/index.html',
        inject: false,
        templateParameters: {
          RefresherVersion: pkg.version || '1.0.0',
          RefresherDevMode: devMode
        }
      }),
      // new BundleAnalyzerPlugin(),
      new ZipWebpackPlugin({
        filename: (pkg.version || 'DCRefresher') + '.zip'
      })
    ],
    resolve: {
      extensions: ['.js', '.ts', '.css'],
      modules: ['node_modules'],
      alias: {
        vue: 'vue/dist/vue.js'
      }
    }
  }

  options.mode = argv.mode

  if (devMode) {
    options.devtool = 'eval-source-map'
  } else {
    devMode = false
    options.resolve.alias['vue'] = 'vue/dist/vue.min.js'

    delete options.devServer
  }

  return options
}
