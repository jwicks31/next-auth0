require('dotenv').config();
const path = require('path');
const glob = require('glob');
const Dotenv = require('dotenv-webpack')

if (process.env.NODE_ENV !== 'production') {
  require('now-env')
}


module.exports = {
  // useFileSystemPublicRoutes: false,
  webpack: (config, {
    dev
  }) => {
    config.plugins = config.plugins || []

    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true
      })
    ]

    config.module.rules.push({
      test: /\.(css|scss)/,
      loader: 'emit-file-loader',
      options: {
        name: 'dist/[path][name].[ext]'
      }
    }, {
      test: /\.css$/,
      use: ['babel-loader', 'raw-loader', 'postcss-loader']
    }, {
      test: /\.s(a|c)ss$/,
      use: ['babel-loader', 'raw-loader', 'postcss-loader',
        {
          loader: 'sass-loader',
          options: {
            // includePaths: ['styles', 'node_modules']
            includePaths: ['styles', 'node_modules', 'node_modules/@material/*']
              .map((d) => path.join(__dirname, d))
              .map((g) => glob.sync(g))
              .reduce((a, c) => a.concat(c), [])
          }
        }
      ]
    })
    return config;
  }
}