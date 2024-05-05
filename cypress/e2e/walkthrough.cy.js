const user = require('../fixtures/auth-user.json');

describe('template spec', () => {
  const { email, password } = user;
  beforeEach(() => {
    cy.visit('/login')
  })
  it('/passes', () => {
    cy.get('input[type=email]').type(email);
    cy.get('input[type=password]').type(password);
    cy.get('button').contains('Login').click();
    cy.getAllLocalStorage('jwt');
    cy.location('pathname').should('equal', '/');

    cy.get('input[name=title]').type("Entertainment");
    cy.get('input[name=budgetAmount]').type("150");
    cy.get('button').contains('Submit Budget').click();
    })
})