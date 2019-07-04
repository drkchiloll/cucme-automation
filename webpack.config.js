process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const path = require('path'),
  // fs = require('fs'),
  webpack = require('webpack'),
  merge = require('webpack-merge');
  // UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env, options) => {
  let dev = {
    entry: {
      main: path.join(__dirname, 'src/electron-main/main.ts'),
      app: path.join(__dirname, 'src/app/main.tsx')
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].bundle.js'
    },
    target: 'electron-main',
    node: {
      __dirname: false,
      console: true,
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [{
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }, {
        test: /.woff$|.woff2$|.ttf$|.eot$|.svx` x g$/,
        loader: 'url-loader'
      }, {
        test: /\.node$/,
        use: 'node-loader'
      }]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development')
        }
      }),
    ]
  };

  let prod = {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        compress: {
          warnings: false,
          drop_console: false
        }
      })
    ]
  };
  if (options.mode === 'production') {
    delete dev['plugins'];
    return merge(dev, prod);
  }
  else return dev;
};
