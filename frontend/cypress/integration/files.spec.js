

describe('Files Integration Test', () => {
  beforeEach(() => {

    cy.intercept('POST', `${Cypress.env('apiUrl')}/auth/login`, {
      statusCode: 200,
      body: { token: 'fake-jwt-token' }
    }).as('loginRequest');

    cy.intercept('POST', `${Cypress.env('apiUrl')}/auth/register`, {
      statusCode: 201,
      body: { message: 'User registered successfully' }
    }).as('registerRequest');

    cy.intercept('DELETE', `${Cypress.env('apiUrl')}/files/delete/file1`, {
      statusCode: 200,
      body: { message: 'File deleted successfully' }
    }).as('deleteFile');

    cy.visit('/auth/login');
    cy.get('input[formControlName="email"]').type('testuser@example.com');
    cy.get('input[formControlName="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');

    cy.window().its('localStorage').invoke('getItem', 'auth_token').should('equal', 'fake-jwt-token');

    cy.url().should('include', '/dashboard');

  });

  it('Should display no files uploaded initially', () => {
    cy.get('.no-files-message').should('exist').and('contain.text', 'No files uploaded');
  });

  it('Should upload a file successfully', () => {
    cy.intercept('POST', `${Cypress.env('apiUrl')}/files/upload`, {
      statusCode: 200,
      body: { status: 'completed', compressedName: 'downloadFile.zip', fileId: '12345', allowDownloads: true }
    }).as('fileUpload');

    cy.get('#btn-browse').click();
    cy.get('input[type="file"]').attachFile('downloadFile.zip');
    cy.get('.file-list').should('contain.text', 'downloadFile.zip');
  });

  it('Should delete a file successfully', () => {
    // Interceptar la carga del archivo
    cy.intercept('POST', `${Cypress.env('apiUrl')}/files/upload`, {
      statusCode: 200,
      body: { status: 'completed', compressedName: 'downloadFile.zip', fileId: '12345', id: '12345', allowDownloads: true }
    }).as('fileUpload');

    cy.intercept('GET', `${Cypress.env('apiUrl')}/files/download/12345`, {
      statusCode: 200,
      body: new Blob(['file content'], { type: 'application/zip' })
    }).as('downloadFile');

    cy.intercept('DELETE', `${Cypress.env('apiUrl')}/files/delete/12345`, {
      statusCode: 200
    }).as('deleteFile');

    cy.get('#btn-browse').click();
    cy.get('input[type="file"]').attachFile('downloadFile.zip');

    cy.get('.file-list-items').should('contain.text', 'downloadFile.zip');

    cy.get('app-file-item').within(() => {
      cy.get('.btn-delete').invoke('attr', 'data-file-id').then((fileId) => {
        cy.intercept('DELETE', `${Cypress.env('apiUrl')}/files/delete/${fileId}`, {
          statusCode: 200,
        }).as('deleteFile');
        cy.get('.btn-delete').click();
        cy.wait('@deleteFile').its('response.statusCode').should('eq', 200);
        cy.get('.file-list-items').should('not.exist');
      });
    });
  });
});
