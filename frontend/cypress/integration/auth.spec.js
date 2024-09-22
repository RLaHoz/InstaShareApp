describe('Auth Integration Tests', () => {
  beforeEach(() => {
    cy.intercept('POST', `${Cypress.env('apiUrl')}/auth/login`, {
      statusCode: 200,
      body: { token: 'fake-jwt-token' }
    }).as('loginRequest');

    cy.intercept('POST', `${Cypress.env('apiUrl')}/auth/register`, {
      statusCode: 201,
      body: { message: 'User registered successfully' }
    }).as('registerRequest');

    cy.visit('/auth/login');
  });

  it('should display login page and successfully log in', () => {
    cy.get('input[formControlName="email"]').type('testuser@example.com');
    cy.get('input[formControlName="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');

    cy.window().its('localStorage').invoke('getItem', 'auth_token').should('equal', 'fake-jwt-token');

    cy.url().should('include', '/dashboard');
  });

  it('should display register page and successfully register', () => {
    cy.visit('/auth/register');

    cy.get('input[formControlName="email"]').type('newuser@example.com');
    cy.get('input[formControlName="password"]').type('NewPassword123');
    cy.get('input[formControlName="confirmPassword"]').type('NewPassword123');
    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest');

    cy.contains('User registered successfully. Please now login').should('be.visible');
    cy.url().should('include', '/auth/login');
  });
});
