describe("Forgot password testing", () => {
    it("Visit reset password page ", () => {
        cy.viewport(1920, 947)
        cy.visit('/sign-up')
        const timeNow = new Date().getTime()
        const email = `testresetpass28${timeNow}@yopmail.com`
        const password = "1234567890W@a"
        const inviticationCode = 'imi-normal'
            cy.get('#firstName').type('test');
            cy.get('#lastName').type('test');
            cy.get('#email').type(email);
            cy.get('#passwordRegis').type(password);
            cy.get('.col-6 > form > :nth-child(7) > .user-box > .form-control').type(inviticationCode)
            cy.get('.col-6 > form > .btn-signup').click()
            cy.wait(3000)

            cy.visit('/login')
            cy.get('.col-6 > form > .status-form > .btn-forgotpass').click()
            cy.get('.col-6 > form > .sc-eggNIi > .user-box > .form-control').type(email)
            cy.get('.col-6 > form > .btn-signup').click()
            cy.wait(3000)


            cy.visit(`/reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RyZXNldHBhc3MxNUB5b3BtYWlsLmNvbSIsImlhdCI6MTYyMTIxODk2NiwiZXhwIjoxOTM2NTc4OTY2fQ.2EjehTEky_TgCLzPqn8atwrUraVSNdCwkveYrPGKrnc&email=${email}`)
    })
    it("Change password fail by password length < 9 ", () => {
        cy.viewport(1920, 947)
        const password = "123"
        cy.get('.col-6 > form > :nth-child(3) > .user-box > #password').type(password)
        cy.get('.col-6 > form > :nth-child(4) > .user-box > #confirmedPassword').type(password)
        cy.get('.d-flex > .btn-backToHome').click()
        cy.on('window:alert', (txt) => {
            expect(txt).to.contains('The password must be 9 characters or more in length and contain a special character, a number, a lowcase character and an uppercase character')
          })
    })
    it("Change password fail by wrong password format(missing Uppercase character)", () => {
        cy.viewport(1920, 947)
        const password = "123123123."
        cy.get('.col-6 > form > :nth-child(3) > .user-box > #password').clear()
        cy.get('.col-6 > form > :nth-child(4) > .user-box > #confirmedPassword').clear()
        cy.get('.col-6 > form > :nth-child(3) > .user-box > #password').type(password)
        cy.get('.col-6 > form > :nth-child(4) > .user-box > #confirmedPassword').type(password)
        cy.get('.d-flex > .btn-backToHome').click()
        cy.on('window:alert', (txt) => {
            expect(txt).to.contains('The password must be 9 characters or more in length and contain a special character, a number, a lowcase character and an uppercase character')
          })
    })
    it("Change password fail by wrong password format (missing Lowcase character) ", () => {
        cy.viewport(1920, 947)
        const password = "123123123.Q"
        cy.get('.col-6 > form > :nth-child(3) > .user-box > #password').clear()
        cy.get('.col-6 > form > :nth-child(4) > .user-box > #confirmedPassword').clear()
        cy.get('.col-6 > form > :nth-child(3) > .user-box > #password').type(password)
        cy.get('.col-6 > form > :nth-child(4) > .user-box > #confirmedPassword').type(password)
        cy.get('.d-flex > .btn-backToHome').click()
        cy.on('window:alert', (txt) => {
            expect(txt).to.contains('The password must be 9 characters or more in length and contain a special character, a number, a lowcase character and an uppercase character')
          })
    })
    it("Change password fail by wrong password format (missing special character) ", () => {
        cy.viewport(1920, 947)
        const password = "123123123Qa"
        cy.get('.col-6 > form > :nth-child(3) > .user-box > #password').clear()
        cy.get('.col-6 > form > :nth-child(4) > .user-box > #confirmedPassword').clear()
        cy.get('.col-6 > form > :nth-child(3) > .user-box > #password').type(password)
        cy.get('.col-6 > form > :nth-child(4) > .user-box > #confirmedPassword').type(password)
        cy.get('.d-flex > .btn-backToHome').click()
        cy.on('window:alert', (txt) => {
            expect(txt).to.contains('The password must be 9 characters or more in length and contain a special character, a number, a lowcase character and an uppercase character')
          })
    })
    it("Change password fail by wrong password format (missing number) ", () => {
        cy.viewport(1920, 947)
        const password = "assdsdsssQa@"
        cy.get('.col-6 > form > :nth-child(3) > .user-box > #password').clear()
        cy.get('.col-6 > form > :nth-child(4) > .user-box > #confirmedPassword').clear()
        cy.get('.col-6 > form > :nth-child(3) > .user-box > #password').type(password)
        cy.get('.col-6 > form > :nth-child(4) > .user-box > #confirmedPassword').type(password)
        cy.get('.d-flex > .btn-backToHome').click()
        cy.on('window:alert', (txt) => {
            expect(txt).to.contains('The password must be 9 characters or more in length and contain a special character, a number, a lowcase character and an uppercase character')
          })
    cy.wait(3000);
    })
    it("Change password fail by password and confirm password are not confirm ", () => {
        cy.viewport(1920, 947)
        const password = "1234567890W@a"
        const confirmPassword = "1234567890W@"
        cy.get('.col-6 > form > :nth-child(3) > .user-box > #password').clear()
        cy.get('.col-6 > form > :nth-child(4) > .user-box > #confirmedPassword').clear()
        cy.get('.col-6 > form > :nth-child(3) > .user-box > #password').type(password)
        cy.get('.col-6 > form > :nth-child(4) > .user-box > #confirmedPassword').type(confirmPassword)
        cy.get('.d-flex > .btn-backToHome').click()
        cy.on('window:alert', (txt) => {
            expect(txt).to.contains('Password does not match')
          })
    cy.wait(3000);
    })
    it("Change password fail by new password same old passpwrd ", () => {
        cy.viewport(1920, 947)
        const password = "1234567890W@a"
        cy.get('.col-6 > form > :nth-child(3) > .user-box > #password').clear()
        cy.get('.col-6 > form > :nth-child(4) > .user-box > #confirmedPassword').clear()
        cy.get('.col-6 > form > :nth-child(3) > .user-box > #password').type(password)
        cy.get('.col-6 > form > :nth-child(4) > .user-box > #confirmedPassword').type(password)
        cy.get('.d-flex > .btn-backToHome').click()
        cy.on('window:alert', (txt) => {
            expect(txt).to.contains('New password cannot be the same as the old password')
          })
    cy.wait(3000);
    })
    it("Change password success ", () => {
        cy.viewport(1920, 947)
        const password = "1234567890W@a1"
        cy.get('.col-6 > form > :nth-child(3) > .user-box > #password').clear()
        cy.get('.col-6 > form > :nth-child(4) > .user-box > #confirmedPassword').clear()
        cy.get('.col-6 > form > :nth-child(3) > .user-box > #password').type(password)
        cy.get('.col-6 > form > :nth-child(4) > .user-box > #confirmedPassword').type(password)
        cy.get('.d-flex > .btn-backToHome').click()
    })
})