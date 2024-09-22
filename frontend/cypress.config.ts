import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: ["cypress/e2e/**/*.cy.{js,ts}", "cypress/integration/**/*.spec.{js,ts}"],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:4200',
    env: {
      apiUrl: 'http://localhost:3500/api',
    },
  },
  // integration: {
  //   specPattern: "cypress/integration/**/*.spec.{js,ts}", // Integration test pattern
  //   setupNodeEvents(on, config) {
  //     // Node event listeners for integration tests
  //   },
  //   baseUrl: 'http://localhost:4200',
  // },
});
