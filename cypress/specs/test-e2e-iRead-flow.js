const { first } = require("lodash");
describe("iReader flow testing", () => {
  it("Login by premium patient account ", () => {
    cy.visit("/home");
    cy.get(".btn-sign").click();
    const email = "premium_patient@imi.ai";
    const password = "imi02468!";
    cy.get(".col-6 > form > :nth-child(2) > .user-box > .form-control").clear();
    cy.get(".col-6 > form > :nth-child(3) > .user-box > .form-control").clear();
    cy.get(".col-6 > form > :nth-child(2) > .user-box > .form-control").type(
      email
    );
    cy.get(".col-6 > form > :nth-child(3) > .user-box > .form-control").type(
      password
    );
    cy.get(".d-flex > .btn-submit").click();
    cy.wait(10000);
    // cy.get(":nth-child(1) > .btn-gradient-yellow").click();
    // cy.visit("/smart-reader")
    cy.get(':nth-child(1) > .btn-gradient-yellow').click()
    cy.wait(7000);
    cy.get(".btn").click();
    cy.wait(2500);
    const fileName = "../file/CBC sample 1.jpg";

    cy.fixture(fileName, "binary")
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) => {
        cy.get("input").attachFile({
          fileContent,
          filePath: fileName,
          encoding: "utf-8",
          lastModified: new Date().getTime(),
        });
      });

    cy.wait(5000);
    cy.get(".btn").click();

    cy.wait(12000);
    cy.get('[style="background: rgb(47, 128, 237);"]').click();
  });
});
