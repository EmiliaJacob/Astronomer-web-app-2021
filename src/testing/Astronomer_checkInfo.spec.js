/*
Declaire a set of variables for different use-cases like the ID or the landingpage
*/
const landingpage = "http://193.197.231.179:4200/Asteroids-Search";
// ID declaired globally to ensure it can be reached by every it 
const id = "3795101";

/*
in General, all the waits within the Cypress files are to ensure that the data is complete.
Sometimes the API needs some time to deliver all the data and Cypress is "to fast", so it will throw errors. 
with the wait of a few seconds, this can be worked around
*/

describe("Testing the searchfunction", () => {
  it("Check the landingpage", () => {
    cy.visit(landingpage);
    cy.wait(2000);
  });

  it("search for one specific Asteroid", () => {
    cy.get("#mat-input-2").type(id);
    cy.wait(3000);
    cy.get(":nth-child(7) > .mat-button-wrapper > .mat-icon").click();
    cy.wait(3000);
    cy.get(".example-element-row > .cdk-column-name").first().click();
    cy.get(".example-element-description").contains(id);
  });

  it("click the info and check the NASA page", () => {
    cy.get('.cdk-column-link > .mat-focus-indicator > .mat-button-wrapper').click();
    cy.url().should('include', id)
  });
});
