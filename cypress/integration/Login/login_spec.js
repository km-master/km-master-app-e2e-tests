import loginData from '../../fixtures/sign-in-data';

const data = {
  correctCredentials: {
    ...loginData[0]
  },
  incorrectPasswordCredentials: {
    ...loginData[1]
  },
  nonExistingCredentials: {
    ...loginData[2]
  },
  capitalLetterCredentials: {
    ...loginData[3]
  },
  incorrectEmailFormat: {
    ...loginData[4]
  }
};

describe('Sign in page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.location('pathname').should('eq', '/login');
  })

  it('signs in user successfully', () => {
    const { correctCredentials } = data;

    cy.get('#username-login').type(correctCredentials.email);
    cy.get('#password-login').type(correctCredentials.password);

    cy.get('#sign-in-btn').click();

    cy.location('pathname').should('eq', '/');

    cy.get('[data-cy=dropdown-user-btn]').click();
    cy.get('[data-cy=sign-out-btn]').click();
  });

  it('signs in with both fields empty', () => {
    cy.get('#sign-in-btn').click();

    cy.focused().should('have.attr', 'id', 'username-login');
    cy.location('pathname').should('eq', '/login');
  });

  it('signs in leaving Password field empty', () => {
    const { correctCredentials } = data;

    cy.get('#username-login').type(correctCredentials.email);

    cy.get('#sign-in-btn').click();

    cy.focused().should('have.attr', 'id', 'password-login');
    cy.location('pathname').should('eq', '/login');
  });

  it('signs in leaving Username field empty', () => {
    const { correctCredentials } = data;

    cy.get('#password-login').type(correctCredentials.password);

    cy.get('#sign-in-btn').click();

    cy.focused().should('have.attr', 'id', 'username-login');
    cy.location('pathname').should('eq', '/login');
  });

  it('signs in with correct username and incorrect password', () => {
    const { incorrectPasswordCredentials } = data;

    cy.get('#username-login').type(incorrectPasswordCredentials.email);
    cy.get('#password-login').type(incorrectPasswordCredentials.password);

    cy.get('#sign-in-btn').click();

    cy.get('.notification-content').should('exist').then(() => {
      cy.get('h4.notification-title').should('have.text', 'Error');
      cy.get('p.notification-message').contains('Invalid credentials');
    });

    cy.location('pathname').should('eq', '/login');
  });

  it('signs in with non existing credentials in the app', () => {
    const { nonExistingCredentials } = data;

    cy.get('#username-login').type(nonExistingCredentials.email);
    cy.get('#password-login').type(nonExistingCredentials.password);

    cy.get('#sign-in-btn').click();

    cy.get('.notification-content').should('exist').then(() => {
      cy.get('h4.notification-title').should('have.text', 'Error');
      cy.get('p.notification-message').contains('User doesn\'t exist');
    });

    cy.location('pathname').should('eq', '/login');
  });

  it('signs in with incorrect email format and correct password', () => {
    const { incorrectEmailFormat } = data;

    cy.get('#username-login').type(incorrectEmailFormat.email);
    cy.get('#password-login').type(incorrectEmailFormat.password);

    cy.get('#sign-in-btn').click();

    cy.focused().should('have.attr', 'id', 'username-login');
    cy.location('pathname').should('eq', '/login');
  });

  it('signs in with email starting with capital letter', () => {
    const { capitalLetterCredentials } = data;

    cy.get('#username-login').type(capitalLetterCredentials.email);
    cy.get('#password-login').type(capitalLetterCredentials.password);

    cy.get('#sign-in-btn').click();

    cy.location('pathname').should('eq', '/');

    cy.get('[data-cy=dropdown-user-btn]').click();
    cy.get('[data-cy=sign-out-btn]').click();
  });

  it('checks if user can get app resources without authentication', () => {
    cy.visit('https://km-master-app.netlify.com');
    cy.location('pathname').should('eq', '/login');
  });

  it('checks if user can get app resources being already authenticated', () => {
    const { correctCredentials } = data;

    cy.get('#username-login').type(correctCredentials.email);
    cy.get('#password-login').type(correctCredentials.password);

    cy.get('#sign-in-btn').click();

    cy.location('pathname').should('eq', '/');

    cy.visit('https://km-master-app.netlify.com');
    cy.location('pathname').should('eq', '/');
  });
});



