/// <reference types="cypress" />
import 'cypress-file-upload';


Cypress.Commands.add('clearDatabase', () => {
  cy.request('POST', `${Cypress.env('apiUrl')}/test/reset`).then((response) => {
    expect(response.status).to.eq(204);
  });
});

Cypress.Commands.add('registerNewUser', (email = 'testuser@example.com', password = 'password123') => {
  cy.request('POST', `${Cypress.env('apiUrl')}/auth/register`, { email, password }).then((response) => {
    expect(response.status).to.eq(201);
  });
});

Cypress.Commands.add('login', (email = 'testuser@example.com', password = 'password123') => {
  cy.request('POST', `${Cypress.env('apiUrl')}/auth/login`, { email, password }).then((response) => {
    localStorage.setItem('auth_token', response.body.token);
    expect(response.status).to.eq(200);
  });
});

Cypress.Commands.add('getAuthToken', () => {
  const token = window.localStorage.getItem('auth_token');
  return cy.wrap(token);
});

// Cypress.Commands.add('clearDBRegisterLogin', (email = 'user@example.com', password = 'password123') => {
//   cy.request('POST', `${Cypress.env('apiUrl')}/test/reset`)
//     .then(() => {
//       return cy.request('POST', `${Cypress.env('apiUrl')}/auth/register`, { email, password });
//     })
//     .then(() => {
//       return cy.request('POST', `${Cypress.env('apiUrl')}/auth/login`, { email, password });
//     })
//     .then((response) => {
//       const token = response.body.token;
//       window.localStorage.setItem('auth_token', token);
//       cy.visit('/dashboard');
//     });
// });


declare global {
  namespace Cypress {
    interface Chainable {
      clearDatabase(): Chainable<void>;
      registerNewUser(email?: string, password?: string): Chainable<void>;
      login(email?: string, password?: string): Chainable<void>;
      getAuthToken(): Chainable<string | null>;
      clearDBRegisterLogin(email?: string, password?: string): Chainable<void>;
    }
  }
}

export {};
