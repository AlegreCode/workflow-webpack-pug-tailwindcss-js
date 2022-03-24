const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function generateHtmlPlugins (templateDir) {
  // Read files in template directory
  const templateFiles = fs.readdirSync(templateDir, { withFileTypes: true })
  const filesNames = templateFiles.filter(item => item.isFile()).map(item => item.name)
  return filesNames.map(item => {
    // Split names and extension
    const parts = item.split('.')
    const name = parts[0]
    const extension = parts[1]      
    // Create new HTMLWebpackPlugin with options
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(`${templateDir}/${name}.${extension}`),
      chunks: [`${name}`],//load chuck limited
      minify: {
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        collapseWhitespace: true,
        useShortDoctype: true,
        removeComments: true,
        removeRedundantAttributes: true
      }
    })
  })
}

// const htmlPlugins = generateHtmlPlugins(path.join('src', 'views'));
const htmlPlugins = generateHtmlPlugins(path.join('src', 'views'));

module.exports = {
  mode: 'development',
  // entry: path.resolve(__dirname, 'src', 'js'),
  entry: {
    // multiples entries
    index: path.join(__dirname, 'src', 'js', 'app.js'),
    login: path.join(__dirname, 'src', 'js', 'login.js'),
    register: path.join(__dirname, 'src', 'js', 'register.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: path.join('js', '[name].js'), // multiples outputs
  },
  module: {
    rules: [
      {
      test: /.jsx?$/,
      include: [
        path.resolve(__dirname, 'src')
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules')
      ],
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env'
          ]
        }
      }
    },
    {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        },
        'postcss-loader'
      ]
    },
    {
      test: /\.pug/,
      loader: 'pug-loader'
    }
  ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: path.join('css', 'app.css')
    })
  ].concat(htmlPlugins),
  resolve: {
    extensions: ['.json', '.js', '.jsx']
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  }
};