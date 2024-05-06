import React from 'react'
import Login from '../../src/LoginPage/LoginPage'
import { BrowserRouter as Router } from 'react-router-dom';
import '../support/commands'

const user = require('../fixtures/auth-user.json');

describe('Login Page Functionality', () => {
  const { email, password } = user;

  it('Login Successful', () => {
    cy.mount(
      <Router>
        <Login />
      </Router>)

    cy.get('input[type=email]').type(email);
    cy.get('input[type=password]').type(password);
    cy.get('button').contains('Login').click();
    cy.getAllLocalStorage('jwt');  })

  it('Wrong Login information', () => {
    cy.mount(
      <Router>
        <Login />
      </Router>)

    cy.get('input[type=email]').type(email);
    cy.get('input[type=password]').type('wrongpassword');
    cy.get('button').contains('Login').click();
    cy.contains('The email/password entered is incorrect')
  })

  it('User does not have an account', () => {
    cy.mount(
      <Router>
        <Login />
      </Router>)
    cy.contains('Sign up').click();
    cy.location('pathname').should('equal', '/signup');
  })

})