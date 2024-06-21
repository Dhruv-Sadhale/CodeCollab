const Dotenv = require('dotenv-webpack');

module.exports = {
  plugins: [
    new Dotenv({
      path: './.env', // Path to .env file (this is the default)
      safe: true // Load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
    })
  ]
};
