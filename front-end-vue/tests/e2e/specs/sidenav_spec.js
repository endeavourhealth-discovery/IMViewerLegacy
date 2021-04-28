describe("The Sidenav", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8081/#/");
    cy.get(".p-button-label")
      .contains("Agree")
      .click();
    cy.contains("Home");
  });

  it("IM button successfully redirects to Home", () => {
    cy.contains("Data model bound value sets").click();
    cy.contains("Concepts");
    cy.contains("IM").click();
    cy.contains("Home");
  });

  it("Login button successfully redirects to Login page", () => {
    cy.get("#user-icon").click();
    cy.contains("Login").click();
    cy.url().should("include", "/user/login");
    cy.contains("Login");
    cy.contains("back").click();
    cy.contains("Home");
  });

  it("Register button successfully redirects to Register page", () => {
    cy.get("#user-icon").click();
    cy.contains("Register").click();
    cy.url().should("include", "/user/register");
    cy.contains("Register");
    cy.contains("back").click();
    cy.contains("Home");
  });
});
