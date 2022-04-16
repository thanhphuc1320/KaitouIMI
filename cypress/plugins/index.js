/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

//*********************
// Open test camera for Windows 
//*********************

// module.exports = (on, config) => {
//   on('before:browser:launch', (browser = {}, launchOptions) => {
//     if (browser.name !== 'electron') {
//       launchOptions.args = launchOptions.args.filter((arg) => {
//         return arg !== "--use-fake-ui-for-media-stream" && arg !== "--use-fake-device-for-media-stream"
//       })
//       launchOptions.args.push('--allow-file-access-from-files')
//     }
//     return launchOptions
//   })
//   return Object.assign({}, config, {
//     integrationFolder: 'cypress/specs'
//   })
// }

//*********************
// Open test camera for Mac/Linux 
//*********************

module.exports = (on, config) => {
  on("before:browser:launch", (browser = {}, launchOptions) => {
    if (browser.family === 'chromium' && browser.name !== 'electron') {
      //*********************
      // Mac/Linux
      //*********************

      launchOptions.args.push(
        '--use-file-for-fake-video-capture=cypress/fixtures/akiyo_cif.y4m'
      )
    }

    return launchOptions
  });
  return Object.assign({}, config, {
    integrationFolder: "cypress/specs",
  });
};
