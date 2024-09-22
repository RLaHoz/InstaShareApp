describe('Authentication E2E Tests', () => {
  const apiUrl = Cypress.env('apiUrl');
  const email = 'usere2e@example.com';
  const password = 'password123';

  beforeEach(() => {
    cy.clearDatabase();
  });

  it('Should register a new user', () => {
    cy.visit('/auth/register');
    cy.get('input[formControlName="email"]').type(email);
    cy.get('input[formControlName="password"]').type(password);
    cy.get('input[formControlName="confirmPassword"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.intercept('POST', `${apiUrl}/auth/register`).as('registerUser');
    cy.wait('@registerUser').its('response.statusCode').should('eq', 201);
    cy.get('button').should('contain.text', 'Login');
  });

  it('Should login the registered user', () => {
    cy.registerNewUser(email, password);

    cy.visit('/auth/login');
    cy.get('input[formControlName="email"]').type(email);
    cy.get('input[formControlName="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.intercept('POST', `${apiUrl}/auth/login`).as('loginUser');
    cy.wait('@loginUser').its('response.statusCode').should('eq', 200);

    cy.window().its('localStorage').invoke('getItem', 'auth_token').should('exist');
    cy.url().should('include', '/dashboard');
  });

  it('Should logout the user', () => {
    cy.login(email, password);

    cy.visit('/dashboard');
    cy.get('app-navbar').within(() => {
      cy.get('li').contains('Logout').click();
    });

    cy.window().its('localStorage').invoke('getItem', 'auth_token').should('not.exist');
    cy.url().should('include', '/auth/login');
  });
});
