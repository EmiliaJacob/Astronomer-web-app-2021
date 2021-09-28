/*
Declaire a set of variables for different use-cases like the ID or the landingpage
*/
const landingpage = "http://193.197.231.179:4200/Asteroids-Search";
/*
in General, all the waits within the Cypress files are to ensure that the data is complete.
Sometimes the API needs some time to deliver all the data and Cypress is "to fast", so it will throw errors. 
with the wait of a few seconds, this can be worked around
*/

describe("Testing the Favorite function", () => {
  it("Check the landingpage", () => {
    //cy.clearCookies();
    cy.visit(landingpage);
    cy.wait(2000);
  });
  it("go to user profile", () => {
    cy.get(
      ".mat-toolbar > :nth-child(1) > .mat-button-wrapper > .mat-icon"
    ).click();
    cy.wait(2000);
  });
  it("logging in", () => {
    const username = "usertest";
    const password = "123456abcd";
    cy.get(
      ".mat-toolbar > :nth-child(1) > .mat-button-wrapper > .mat-icon"
    ).click();
    cy.wait(2000);
    cy.get("#mat-input-3").type(username).blur();
    cy.get("#mat-input-4").type(password).blur();
    cy.get(".mat-raised-button").click();
  });
  it("select the second Asteroid and mark it as favorite", () => {
    cy.wait(5000);
    cy.get(":nth-child(3) > .cdk-column-name").click();
    cy.get(
      ".example-expanded-row > .button > .ng-star-inserted > .mat-focus-indicator"
    ).click();
  });
});
