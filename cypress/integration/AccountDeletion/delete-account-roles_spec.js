import loginData from '../../fixtures/admin-credentials';

const credentials = {
  ...loginData[0]
};

const password = 'password';

describe('Delete account by different roles', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.location('pathname').should('eq', '/login');
  });

  it('deletes account as regular user', () => {
    const generatedEmail = `test+${Math.floor(Math.random()*100000000)}@cypress.com`;

    cy.get('a').click();
    cy.location('pathname').should('eq', '/register');

    cy.get('#email').type(generatedEmail);
    cy.get('#password').type(password);
    cy.get('#passwordConfirm').type(password);

    cy.get('#create-account-btn').click();
    cy.location('pathname').should('eq', '/');

    cy.get('[data-cy=dropdown-user-btn]').click();
    cy.get('[data-cy=settings-btn] > .dropdown-item').click();

    cy.location('pathname').should('eq', '/settings');

    cy.get('.btn-danger').click();
    cy.get('.modal-dialog').should('exist').then(() => {
      cy.get('.modal-title').should('have.text', 'Confirm your current password');
      cy.get('#currentPassword').type(password);
      cy.get('#confirm-password-btn').click().then(() => {
        cy.get('h5.modal-title').should('have.text', 'Are you sure?');
        cy.get('#delete-account-btn').click();

        cy.location('pathname').should('eq', '/login');

        cy.get('.notification-content').should('exist');
      });
    });
  });

  it('deletes account as admin user', () => {
    cy.get('#username-login').type(credentials.email);
    cy.get('#password-login').type(credentials.password);

    cy.get('#sign-in-btn').click();

    cy.location('pathname').should('eq', '/');

    cy.get('[data-cy=dropdown-user-btn]').click();
    cy.get('[data-cy=settings-btn] > .dropdown-item').click();

    cy.location('pathname').should('eq', '/settings');

    cy.get('.btn-danger').should('not.exist');

    cy.get('[data-cy=dropdown-user-btn]').click();
    cy.get('[data-cy=sign-out-btn]').click();

    cy.location('pathname').should('eq', '/login');
  });
});



