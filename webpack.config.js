const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const HTML_DIRECTORY = 'templates';
const STYLES_DIRECTORY = 'styles';
const LOGIC_DIRECTORY = 'BL';

module.exports = {
    entry: {
        'src/BL/background': `./src/${LOGIC_DIRECTORY}/background.js`,
        'src/BL/contentScript': `./src/${LOGIC_DIRECTORY}/contentScript.js`,
        'src/BL/options': `./src/${LOGIC_DIRECTORY}/options.js`,
        'src/BL/popup': `./src/${LOGIC_DIRECTORY}/popup.js`,
        'src/templates/options': `./src/${HTML_DIRECTORY}/options.html`,
        'src/templates/popup': `./src/${HTML_DIRECTORY}/popup.html`,
        'src/assets/styles/style': `./src/assets/${STYLES_DIRECTORY}/style.css`,
    },
    output: {
      path: `${__dirname}/dist`,
      filename: (obj) => {
          const chunk = obj.chunk;
          const name = chunk.name;
          const hash = chunk.hash;

          let ext = hash;
          if (name.includes(HTML_DIRECTORY)) { ext = 'html' }
          if (name.includes(STYLES_DIRECTORY)) { ext = 'css' }
          if (name.includes(LOGIC_DIRECTORY)) { ext = 'js' }

          return `${name}.${ext}`
        }
    },
    module: {
        rules: [
            { 
                test: /\.html$/, 
                use: 'html-loader' ,
                include: [path.resolve(__dirname, './src')],
                exclude: '/node_modules/'
            },
            { 
                test: /\.js$/, 
                use: 'babel-loader' ,
                include: [path.resolve(__dirname, './src')],
                exclude: '/node_modules/'
            },
            { 
                test: /\.ts$/, 
                use: 'ts-loader' ,
                include: [path.resolve(__dirname, './src')],
                exclude: '/node_modules/'
            },
            { 
                test: /\.css$/, 
                include: [path.resolve(__dirname, './src')],
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                            sourceMap: true,
                        }
                    }   
                ],
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.css', '.html' ]
    },
    plugins: [
        new CleanWebpackPlugin('./dist'),
        new CopyWebpackPlugin([
            { from:'./src/manifest.json', to:'./' },
            { from:'./src/assets/images', to:'./src/assets/images' },
        ]), 
    ]
  };