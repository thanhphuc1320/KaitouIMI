const { first } = require("lodash")
describe('Login page testing', () => {
    it('Login false by invalid email ', () => {
      cy.viewport(1920, 947)
      cy.visit('/home')
      cy.get('.btn-sign').click();
      const email = 'testresetpass9'
      const password = "123123123."
      cy.get('.col-6 > form > :nth-child(2) > .user-box > .form-control').clear()
      cy.get('.col-6 > form > :nth-child(3) > .user-box > .form-control').clear()
      cy.get('.col-6 > form > :nth-child(2) > .user-box > .form-control').type(email)
      cy.get('.col-6 > form > :nth-child(3) > .user-box > .form-control').type(password)
      cy.get('.d-flex > .btn-submit').click()
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('Your email is Invalid')
      })
      cy.wait(3000);
    })

    it('Login false by invalid email is not confirm ', () => {
      cy.viewport(1920, 947)
      const email = 'testresetpass15@yopmail.com'
      const password = "1234567890W@a"
      cy.get('.col-6 > form > :nth-child(2) > .user-box > .form-control').clear()
      cy.get('.col-6 > form > :nth-child(3) > .user-box > .form-control').clear()
      cy.get('.col-6 > form > :nth-child(2) > .user-box > .form-control').type(email)
      cy.get('.col-6 > form > :nth-child(3) > .user-box > .form-control').type(password)
      cy.get('.d-flex > .btn-submit').click()
      cy.wait(3000);
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('Email is not confirm')
      })
      cy.wait(3000);
    })

    it('Login false by invalid password ', () => {
      cy.viewport(1920, 947)
      const email = 'testresetpass9@yopmail.com'
      const password = "123"
      cy.get('.col-6 > form > :nth-child(2) > .user-box > .form-control').clear()
      cy.get('.col-6 > form > :nth-child(3) > .user-box > .form-control').clear()
      cy.get('.col-6 > form > :nth-child(2) > .user-box > .form-control').type(email)
      cy.get('.col-6 > form > :nth-child(3) > .user-box > .form-control').type(password)
      cy.get('.d-flex > .btn-submit').click()
      cy.wait(3000);
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('Wrong password')
      })
      cy.wait(3000);
    })

    it('Login false by invalid email is not exist ', () => {
      cy.viewport(1920, 947)
      const timeNow = new Date().getTime()
      const email = `testresetpass69${timeNow}@yopmail.com`
      const password = "1234567890W@a"
      cy.get('.col-6 > form > :nth-child(2) > .user-box > .form-control').clear()
      cy.get('.col-6 > form > :nth-child(3) > .user-box > .form-control').clear()
      cy.get('.col-6 > form > :nth-child(2) > .user-box > .form-control').type(email)
      cy.get('.col-6 > form > :nth-child(3) > .user-box > .form-control').type(password)
      cy.get('.d-flex > .btn-submit').click()
      cy.wait(3000);
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('User does not exist')
      })
    })
  
    it('Login page valid', () => {
        cy.viewport(1920, 947)
        cy.get('.col-6 > form > :nth-child(2) > .user-box > .form-control').clear()
        cy.get('.col-6 > form > :nth-child(3) > .user-box > .form-control').clear()
        const email = 'patient@imi.ai'
        const password = "imi02468!"
        cy.get('.col-6 > form > :nth-child(2) > .user-box > .form-control').type(email)
        cy.get('.col-6 > form > :nth-child(3) > .user-box > .form-control').type(password)
        cy.get('.d-flex > .btn-submit').click()
    })
  })