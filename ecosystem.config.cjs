module.exports = {
  apps: [{
    name: 'meercat',
    script: 'npx',
    interpreter: 'none',
    args: 'serve build -s -p 8084',
    env_production: {
      NODE_ENV: 'production'
    }
  }, {
    name: 'static-files-meercat',
    script: 'npx',
    args: 'serve extra -p 8085',
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
