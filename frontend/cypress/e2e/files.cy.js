describe('File Management E2E Test', () => {
  beforeEach(() => {
    cy.clearDatabase();
    cy.registerNewUser();
    cy.login();
    cy.visit('/dashboard');
  });

  it('should display "No files uploaded" when there are no files', () => {
    cy.intercept('GET', '**/files/user-files').as('getUserFiles');
    cy.wait('@getUserFiles').its('response.statusCode').should('eq', 200);

    cy.get('.no-files-message').should('be.visible');
  });

  it('should upload a file and display it', () => {
    cy.intercept('GET', '**/files/user-files').as('getUserFiles');
    cy.wait('@getUserFiles').its('response.statusCode').should('eq', 200);

    cy.get('[data-cy=btn-browse]').click();
    cy.get('input[type=file]').attachFile('testFile.txt');

    cy.intercept('POST', '**/files/upload').as('uploadFile');
    cy.wait('@uploadFile').its('response.statusCode').should('eq', 200);

    cy.get('.file-list-items').should('contain', 'testFile.txt');
  });

  it('should download an uploaded file', () => {
    cy.get('[data-cy=btn-browse]').click();
    cy.get('input[type=file]').attachFile('testFile.txt');

    cy.intercept('POST', '**/files/upload').as('uploadFile');
    cy.wait('@uploadFile').its('response.statusCode').should('eq', 200);

    cy.intercept('GET', '**/files/download/*').as('downloadFile');
    cy.get('.btn-download').click();
    cy.wait('@downloadFile').its('response.statusCode').should('eq', 200);
  });

  it('should delete an uploaded file', () => {
    cy.get('[data-cy=btn-browse]').click();
    cy.get('input[type=file]').attachFile('testFile.txt');

    cy.intercept('POST', '**/files/upload').as('uploadFile');
    cy.wait('@uploadFile').its('response.statusCode').should('eq', 200);

    cy.intercept('DELETE', '**/files/delete/*').as('deleteFile');
    cy.get('.btn-delete').click();
    cy.wait('@deleteFile').its('response.statusCode').should('eq', 200);

    cy.get('.file-list-items').should('not.contain', 'testFile.txt');
  });
});
