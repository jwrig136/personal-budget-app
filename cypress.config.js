/*
const { defineConfig } = require("cypress");
const eyesPlugin = require('@applitools/eyes-cypress')

module.exports = eyesPlugin(defineConfig({
  
  // the e2e or component configuration
  e2e: {
    //baseUrl: 'https://personabudgetapp.onrender.com',
    setupNodeEvents(on, config) {
    },
  },
    
}))
*/

const {defineConfig} = require("cypress");

const eyesPlugin = require('@applitools/eyes-cypress')

module.exports = eyesPlugin(defineConfig({
  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },

 e2e: {

testIsolation: false,

setupNodeEvents(on, config) {

// implement node event listeners here

},

},

}));