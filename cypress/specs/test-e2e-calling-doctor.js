// const { first } = require("lodash")
// describe('Login page testing', () => {
//     it('Login false by invalid email ', () => {
//     cy.viewport(1920, 947)
// 		cy.visit('/login')
// 		const email = 'doctor@imi.ai'
// 		const password = "imi02468!"
// 		cy.setCookie('SameSite', 'None')
// 		cy.get('.col-6 > form > :nth-child(2) > .user-box > .form-control').clear().type(email)
// 		cy.get('.col-6 > form > :nth-child(3) > .user-box > .form-control').clear().type(password)
// 		cy.get('.d-flex > .btn-submit').click()
// 		cy.wait(5000);
// 		cy.visit('/appointment')
// 		cy.wait(5000);
// 		cy.get('.item-available').first().click();
// 		cy.wait(5000);
//    		cy.get('.btn').click()
// 		})
//   })