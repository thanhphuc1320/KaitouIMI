const { first } = require("lodash")
describe('Login page testing', () => {
    it('Login false by invalid email ', () => {
      cy.visit('/home')
      cy.get('.btn-sign').click();
      const email = 'premium_patient@imi.ai'
      const password = "imi02468!"
      cy.get('.col-6 > form > :nth-child(2) > .user-box > .form-control').clear()
      cy.get('.col-6 > form > :nth-child(3) > .user-box > .form-control').clear()
      cy.get('.col-6 > form > :nth-child(2) > .user-box > .form-control').type(email)
      cy.get('.col-6 > form > :nth-child(3) > .user-box > .form-control').type(password)
      cy.get('.d-flex > .btn-submit').click()
      cy.wait(7000);
      cy.visit('/all-file-test-result')
      cy.wait(7000);
      cy.get(':nth-child(1) > :nth-child(2) > [style="display: flex; height: 100%;"]').click()
    })
})