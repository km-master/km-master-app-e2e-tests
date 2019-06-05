import loginData from '../../fixtures/sign-in-data';

const credentials = {
  ...loginData[0]
};

describe('Delete account modal', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.location('pathname').should('eq', '/login');

    cy.get('#username-login').type(credentials.email);
    cy.get('#password-login').type(credentials.password);

    cy.get('#sign-in-btn').click();

    cy.location('pathname').should('eq', '/');

    cy.get('[data-cy=dropdown-user-btn]').click();
    cy.get('[data-cy=settings-btn] > .dropdown-item').click();

    cy.location('pathname').should('eq', '/settings');
  });

  afterEach(() => {
    cy.get('[data-cy=dropdown-user-btn]').click();
    cy.get('[data-cy=sign-out-btn]').click();

    cy.location('pathname').should('eq', '/login');
  })

  it('closes modal window by Close button', () => {
    cy.get('.btn-danger').click();
    cy.get('.modal-dialog').should('exist').then(() => {
      cy.get('.modal-title').should('have.text', 'Confirm your current password');
      cy.get('.close').click();
    });

    cy.get('.modal-dialog').should('not.exist');
  });

  it('closes modal window by clicking on the background', () => {
    cy.get('.btn-danger').click();
    cy.get('.modal-dialog').should('exist').then(() => {
      cy.get('.modal-title').should('have.text', 'Confirm your current password');
      cy.get('.modal').click();
    });

    cy.get('.modal-dialog').should('not.exist');
  });

  it('closes modal window by clicking on Cancel button', () => {
    cy.get('.btn-danger').click();
    cy.get('.modal-dialog').should('exist').then(() => {
      cy.get('.modal-title').should('have.text', 'Confirm your current password');
      cy.get('#cancel-btn').click();
    });

    cy.get('.modal-dialog').should('not.exist');
  });
});



