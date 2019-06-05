import adminData from '../../fixtures/admin-credentials';
import regularUserData from '../../fixtures/sign-in-data'

const data = {
  adminCredentials: {
    ...adminData[0]
  },
  regularUserData: {
    ...regularUserData[0]
  }
};

describe('Admin panel access', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.location('pathname').should('eq', '/login');
  });

  it('checks if admin has an access to admin panel', () => {
    const { adminCredentials } = data;

    cy.get('#username-login').type(adminCredentials.email);
    cy.get('#password-login').type(adminCredentials.password);

    cy.get('#sign-in-btn').click();

    cy.location('pathname').should('eq', '/');

    cy.get('[data-cy=dropdown-user-btn]').click();
    cy.get('[data-cy=admin-panel-btn] > .dropdown-item').click();

    cy.location('pathname').should('eq', '/panel/general');

    cy.get('[data-cy=dropdown-user-btn]').click();
    cy.get('[data-cy=sign-out-btn]').click();

    cy.location('pathname').should('eq', '/login');
  });

  it('checks if regular user has an access to admin panel', () => {
    const { regularUserData } = data;

    cy.get('#username-login').type(regularUserData.email);
    cy.get('#password-login').type(regularUserData.password);

    cy.get('#sign-in-btn').click();

    cy.location('pathname').should('eq', '/');

    cy.get('[data-cy=dropdown-user-btn]').click()
    cy.get('[data-cy=admin-panel-btn]').should('not.exist');

    cy.get('[data-cy=dropdown-user-btn]').click();
    cy.get('[data-cy=sign-out-btn]').click();

    cy.location('pathname').should('eq', '/login');
  });

  it('checks if regular user can\'t get into admin panel resources', () => {
    const { regularUserData } = data;

    cy.get('#username-login').type(regularUserData.email);
    cy.get('#password-login').type(regularUserData.password);

    cy.get('#sign-in-btn').click();

    cy.location('pathname').should('eq', '/');

    cy.visit('/panel/general');
  });
});



