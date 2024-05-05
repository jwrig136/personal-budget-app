const user = require('../fixtures/auth-user.json');

describe('template spec', () => {
  const { email, password } = user;
  beforeEach(() => {
    cy.visit('/login')
  })
  it('/passes', () => {
    cy.get('input[type=email]').type(email);
    cy.get('input[type=password]').type(password);
    cy.contains('Login').click();
    cy.getAllLocalStorage('jwt');
    cy.location('pathname').should('equal', '/');
    
  })
})