const rewireAliases = require('react-app-rewire-aliases');
const { paths } = require('react-app-rewired');
const path = require('path');

/* config-overrides.js */
module.exports = function override(config, env) {
  config = rewireAliases.aliasesOptions({
    '@apis': path.resolve(__dirname, `${paths.appSrc}/apis/`),
    '@assets': path.resolve(__dirname, `${paths.appSrc}/assets/`),
    '@img': path.resolve(__dirname, `${paths.appSrc}/img/`),
    '@constant': path.resolve(__dirname, `${paths.appSrc}/constant.js`),
    '@components': path.resolve(__dirname, `${paths.appSrc}/components/`),
    '@containers': path.resolve(__dirname, `${paths.appSrc}/containers/`),
    '@stories': path.resolve(__dirname, `${paths.appSrc}/stories/`),
  })(config, env);
  return config;
};
