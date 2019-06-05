const password = 'password';
const incorrectPassword = 'password123';

describe('Delete account', () => {
  beforeEach(() => {
    const generatedEmail = `test+${Math.floor(Math.random()*100000000)}@cypress.com`;

    cy.visit('/');
    cy.location('pathname').should('eq', '/login');

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
  });

  it('deletes account successfully', () => {
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

  it('inputs incorrect password before account deleting', () => {
    cy.get('.btn-danger').click();

    cy.get('.modal-dialog').should('exist').then(() => {
      cy.get('.modal-title').should('have.text', 'Confirm your current password');
      cy.get('#currentPassword').type(incorrectPassword);
      cy.get('#confirm-password-btn').click().then(() => {
        cy.get('.notification-content').should('exist').then(() => {
          cy.get('h4.notification-title').should('have.text', 'Error');
          cy.get('p.notification-message').contains('Invalid password');
        });

        cy.location('pathname').should('eq', '/settings');
      });
    });

    cy.get('.modal-dialog').should('exist').then(() => {
      cy.get('.modal-title').should('have.text', 'Confirm your current password');
      cy.get('.close').click();
    });

    cy.get('[data-cy=dropdown-user-btn]').click();
    cy.get('[data-cy=sign-out-btn]').click();

    cy.location('pathname').should('eq', '/login');
  });

  it('inputs no password before deleting account', () => {
    cy.get('.btn-danger').click();
    cy.get('.modal-dialog').should('exist').then(() => {
      cy.get('.modal-title').should('have.text', 'Confirm your current password');
      cy.get('#confirm-password-btn').click().then(() => {
        cy.get('.form-group > .small').should('have.text', 'Missing password');

        cy.location('pathname').should('eq', '/settings');
        cy.get('.close').click();
      });
    });

    cy.get('[data-cy=dropdown-user-btn]').click();
    cy.get('[data-cy=sign-out-btn]').click();

    cy.location('pathname').should('eq', '/login');
  });

  it('checks if app requires password confirmation each account deletion attempt', () => {
    cy.get('.btn-danger').click();
    cy.get('.modal-dialog').should('exist').then(() => {
      cy.get('.modal-title').should('have.text', 'Confirm your current password');
      cy.get('#currentPassword').type(password);
      cy.get('#confirm-password-btn').click().then(() => {
        cy.get('h5.modal-title').should('have.text', 'Are you sure?');
        cy.get('#cancel-delete-btn').click();

        cy.location('pathname').should('eq', '/settings');
      });
    });

    cy.get('[data-cy=delete-account-btn]').click();
    cy.get('.modal-dialog').should('exist').then(() => {
      cy.get('.modal-title').should('have.text', 'Confirm your current password');
    });

    cy.get('[data-cy=dropdown-user-btn]').click();
    cy.get('[data-cy=sign-out-btn]').click();

    cy.location('pathname').should('eq', '/login');
  });
});



