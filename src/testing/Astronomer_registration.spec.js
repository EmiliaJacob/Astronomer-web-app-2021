/*
Declaire a set of variables for different use-cases like the ID or the landingpage
*/
const landingpage = "http://193.197.231.179:4200/Asteroids-Search";

/*
in General, all the waits within the Cypress files are to ensure that the data is complete.
Sometimes the API needs some time to deliver all the data and Cypress is "to fast", so it will throw errors. 
with the wait of a few seconds, this can be worked around
*/

/*
important: after running once, the user is registered in the database. Please ensure to pick a different username then and 
select another username. 
*/

describe("Testing the Mainpage", () => {
  it("Check the landingpage", () => {
    cy.visit(landingpage);
    cy.wait(2000);
  });
});

describe("Creating a user profile", () => {
  // Declaration of user variables, to create an account later on
  const username = "usertest3";
  const email = "testemail@web.com";
  const password = "123456abcd";

  it("go to user profile", () => {
    cy.get(
      ".mat-toolbar > :nth-child(1) > .mat-button-wrapper > .mat-icon"
    ).click();
    cy.wait(2000);
  });

  it("click the register field", () => {
    cy.get(".login-form > p").click();
    cy.wait(2000);
  });

  it("create the profile", () => {
    cy.get("#mat-input-7").type(username).blur();
    cy.get("#mat-input-5").type(email).blur();
    cy.get("#mat-input-6").type(password).blur();
    cy.get(".mat-raised-button").click();
    cy.wait(3000);
    //logout the user
    cy.get(".mat-warn").click();
  });

  // as the user will be prompted back to the login-mask, login will be checked
  it("check if the registration worked", () => {
    cy.get("#mat-input-8").type(username).blur();
    cy.get("#mat-input-9").type(password).blur();
    cy.get(".mat-raised-button").click();
    cy.wait(3000);
  });
});
