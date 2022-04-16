describe("Test for iDoctor flow", () => {
  it("iDoctor", () => {
    cy.viewport(1920, 947);
    cy.visit("/home");
    cy.get(".btn-sign").click();
    const email = "premium_patient@imi.ai";
    const password = "imi02468!";
    cy.get(".col-6 > form > :nth-child(2) > .user-box > .form-control").type(
      email
    );
    cy.get(".col-6 > form > :nth-child(3) > .user-box > .form-control").type(
      password
    );
    cy.get(".d-flex > .btn-submit").click();
    cy.wait(7000);
    cy.get(":nth-child(2) > .btn-gradient-yellow").click();
    cy.wait(2000);
    cy.get(".btn").click();
    cy.wait(2000);
    const special = "../file/CBC sample 1.jpg";

    cy.fixture(special, "binary")
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) => {
        cy.get("input").attachFile({
          fileContent,
          filePath: special,
          encoding: "utf-8",
        });
      });

    cy.wait(4000);
    cy.get(".btn").click();
    cy.wait(2000);
    cy.get(".justify-content-center > button").click();

    cy.wait(5000);
    cy.get(".justify-content-center > button").click();

    cy.wait(3000);
    cy.get(".btn").click();
    cy.wait(2000);

    const image = "../file/CBC sample 2.jpg";
    cy.fixture(image, "binary")
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) => {
        cy.get("input").attachFile({
          fileContent,
          filePath: image,
          encoding: "utf-8",
        });
      });
    cy.wait(4000);
    cy.get(".mt-37vh > div > .btn").click();
    cy.wait(3000);

    cy.get(
      '[style="color: rgba(0, 0, 0, 0.87); height: 56px; line-height: 56px; overflow: hidden; opacity: 1; position: relative; padding-left: 0px; padding-right: 56px; text-overflow: ellipsis; top: -4px; white-space: nowrap;"]'
    ).click();
    cy.wait(2000);
    cy.get(
      ':nth-child(2) > span > :nth-child(1) > [style="margin-left: 0px; padding: 0px 24px; position: relative;"] > div'
    ).click();
    cy.wait(1000);
    cy.get("textarea").type("Just for testing !!!!!");
    cy.wait(2000);
    cy.get(".btn").click();

    cy.wait(2000);
    cy.get('.web > .form-group > .btn').click();

    cy.wait(4000);
    cy.get(".btn").click();

    //   end
  });
});
