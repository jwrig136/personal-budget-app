const user = require('../fixtures/auth-user.json');

describe('template spec', () => {
  const { email, password } = user;
  beforeEach(() => {
    cy.visit('/login')
  })

  it('Adding Items', () => {

    //Login
    cy.get('input[type=email]').type(email);
    cy.get('input[type=password]').type(password);
    cy.get('button').contains('Login').click();
    cy.getAllLocalStorage('jwt');
    cy.location('pathname').should('equal', '/');

    //Add Budget Item
    cy.get('input[name=title]').type("Entertainment");
    cy.get('input[name=budgetAmount]').type("150");
    cy.get('button').contains('Submit Budget').click();

    //Add 1st Expense
    cy.get('input[name=expenseTitle]').type("Netflix");
    cy.get('input[name=expenseAmount]').type("39.99");
    cy.get('button').contains('Submit Expense').click();;
    cy.contains("You spent $39.99 on Netflix");

    //Add 2nd Expense
    cy.wait(1000);
    cy.get('input[name=expenseTitle]').type("Amazon Prime");
    cy.get('input[name=expenseAmount]').type("69.95");
    cy.get('button').contains('Submit Expense').click();
    cy.contains("You spent $69.95 on Amazon Prime");
    cy.wait(10000);

    //Check Dashboard for Visualizations
    cy.contains('Dashboard').click();
    cy.location('pathname').should('equal', '/dashboard');
    cy.wait(10000);

    //Delete Budget Item
    cy.contains('Home').click();
    cy.location('pathname').should('equal', '/');
    cy.contains("Entertainment").get('[class=budget__deleteButton]').click();

    //Check Dashboard for deletion
    cy.wait(10000);
    cy.contains('Dashboard').click();
    cy.location('pathname').should('equal', '/dashboard');
    cy.contains("Add Data");

    //Logout
    cy.contains('Logout').click();
    cy.location('pathname').should('equal', '/login');
  })

  it('Incorrect Login', () => {
    cy.get('input[type=email]').type(email);
    cy.get('input[type=password]').type("wrongpassword");
    cy.get('button').contains('Login').click();
    cy.contains("The email/password entered is incorrect");
    cy.location('pathname').should('equal', '/login');
  })

})