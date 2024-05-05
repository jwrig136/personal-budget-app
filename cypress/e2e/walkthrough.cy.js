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

    cy.get('input[name=expenseTitle]').type("Netflix");
    cy.get('input[name=expenseAmount]').type("40");
    cy.get('button').contains('Submit Expense').click();
    //cy.get('[class=budget__editButton]').click();
    
    //cy.get('.modalContainer').should('be.visible')
    //cy.contains('[class=editBudget]').contains('input[name=title]').clear({force: true});

    //cy.get('[class=budget__editButton]').click();
    //cy.contains('Entertainment').clear({force: true});
    cy.get('[class=budget__deleteButton]').click();
    //cy.get('input[name=expenseAmount]').type("20");
    //cy.contains('Enter Expense Title').type("Netflix");
    //cy.get('input[name=expenseAmount]').type("20");
    //cy.get('button').contains('Submit Expense').click();
    })
})