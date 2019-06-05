import credentials from '../../fixtures/credentials';

const data = {
  existingUser: {
    ...credentials[0]
  },
  invalidChars: {
    ...credentials[1]
  },
  wrongEmailFormat: {
    ...credentials[2]
  }
};

describe('Registration page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.location('pathname').should('eq', '/login');

    cy.get('a').click();
    cy.location('pathname').should('eq', '/register');
  });

  it('registers user successfully', () => {
    const password = 'password';
    const generatedEmail = `test+${Math.floor(Math.random()*1000000)}@cypress.com`;

    cy.get('#email').type(generatedEmail);
    cy.get('#password').type(password);
    cy.get('#passwordConfirm').type(password);

    cy.get('#create-account-btn').click();

    cy.location('pathname').should('eq', '/');

    cy.get('[data-cy=dropdown-user-btn]').click();
    cy.get('[data-cy=sign-out-btn]').click();
  });

  it('registers with credentials of existing user', () => {
    const { existingUser } = data;

    cy.get('#email').type(existingUser.email);
    cy.get('#password').type(existingUser.password);
    cy.get('#passwordConfirm').type(existingUser.confirmPassword);

    cy.get('#create-account-btn').click();

    cy.get('.notification-content').should('exist').then(() => {
      cy.get('h4.notification-title').should('have.text', 'Error');
      cy.get('p.notification-message').contains('address is already in use');
    });
  });

  it('registers with wrong email format', () => {
    const { wrongEmailFormat } = data;

    cy.get('#email').type(wrongEmailFormat.email);
    cy.get('#password').type(wrongEmailFormat.password);
    cy.get('#passwordConfirm').type(wrongEmailFormat.confirmPassword);

    cy.get('#create-account-btn').click();

    cy.location('pathname').should('eq', '/register');
    cy.focused().should('have.attr', 'id', 'email');
  });

  it('registers with invalid characters in email', () => {
    const { invalidChars } = data;

    cy.get('#email').type(invalidChars.email);
    cy.get('#password').type(invalidChars.password);
    cy.get('#passwordConfirm').type(invalidChars.confirmPassword);

    cy.get('#create-account-btn').click();

    cy.location('pathname').should('eq', '/register');
    cy.focused().should('have.attr', 'id', 'email');
  });

  it('registers with all fields empty', () => {
    cy.get('#create-account-btn').click();

    cy.location('pathname').should('eq', '/register');

    cy.get('#register-form > :nth-child(1) .email-error')
      .should('have.text', 'Missing email');
    cy.get('#register-form > :nth-child(2) .password-error')
      .should('have.text', 'Missing password');
    cy.get('#register-form > :nth-child(3) .confirm-password-error')
      .should('have.text', 'Confirm your password');
  });

  it('registers with password related fields empty', () => {
    const generatedEmail = `test+${Math.floor(Math.random()*1000000)}@cypress.com`;

    cy.get('#email').type(generatedEmail);

    cy.get('#create-account-btn').click();

    cy.location('pathname').should('eq', '/register');

    cy.get('#register-form > :nth-child(2) .password-error')
      .should('have.text', 'Missing password');
    cy.get('#register-form > :nth-child(3) .confirm-password-error')
      .should('have.text', 'Confirm your password');
  });

  it('registers with only email field empty', () => {
    const password = 'password';

    cy.get('#password').type(password);
    cy.get('#passwordConfirm').type(password);

    cy.get('#create-account-btn').click();

    cy.location('pathname').should('eq', '/register');

    cy.get('#register-form > :nth-child(1) .email-error')
      .should('have.text', 'Missing email');
  });

  it('registers with only confirm password field empty', () => {
    const generatedEmail = `test+${Math.floor(Math.random()*1000000)}@cypress.com`;
    const password = 'password';

    cy.get('#email').type(generatedEmail);
    cy.get('#password').type(password);

    cy.get('#create-account-btn').click();

    cy.get('#register-form > :nth-child(3) .confirm-password-error')
      .should('have.text', 'Confirm your password');

    cy.location('pathname').should('eq', '/register');
  });

  it('registers with only password field empty', () => {
    const generatedEmail = `test+${Math.floor(Math.random()*1000000)}@cypress.com`;
    const password = 'password';

    cy.get('#email').type(generatedEmail);
    cy.get('#passwordConfirm').type(password);

    cy.get('#create-account-btn').click();

    cy.location('pathname').should('eq', '/register');

    cy.get('#register-form > :nth-child(2) .password-error')
      .should('have.text', 'Missing password');
  });

  it('registers with password shorter than 8 characters', () => {
    const generatedEmail = `test+${Math.floor(Math.random()*1000000)}@cypress.com`;
    const password = 'pass';

    cy.get('#email').type(generatedEmail);
    cy.get('#password').type(password);
    cy.get('#passwordConfirm').type(password);

    cy.get('#create-account-btn').click();

    cy.get('#register-form > :nth-child(2) .password-error')
      .should('have.text', 'Min 8 characters required');

    cy.location('pathname').should('eq', '/register');
  });

  it('registers with different passwords provided', () => {
    const generatedEmail = `test+${Math.floor(Math.random()*1000000)}@cypress.com`;
    const password = 'password';
    const password2= 'password123';

    cy.get('#email').type(generatedEmail);
    cy.get('#password').type(password);
    cy.get('#passwordConfirm').type(password2);

    cy.get('#create-account-btn').click();

    cy.get('#register-form > :nth-child(3) .confirm-password-error')
      .should('have.text', 'Passwords aren\'t the same');

    cy.location('pathname').should('eq', '/register');
  });
});



