describe('Register page testing', () => {

  it('Resgister fail by email invalid', () => {
      cy.viewport(1920, 947)
      cy.visit('/home');
      cy.get('.btn-sign').click();
      cy.get('.btn-signup').click();
      const email = 'testresetpass10'
      const password = "123123123."
      cy.get('#firstName').type('test');
      cy.get('#lastName').type('test last name');
      cy.get('#email').type(email);
      cy.get('.col-6 > form > :nth-child(5) > .user-box > .form-control').type(password);
      cy.get('.col-6 > form > .btn-signup').click()
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('Your email is Invalid')
      })
  })
  it('Resgister fail by password length < 8', () => {
    cy.viewport(1920, 947)
    const email = 'testresetpass10@yopmail.com'
    const password = "123"
    cy.get('#email').clear();
    cy.get('.col-6 > form > :nth-child(5) > .user-box > .form-control').clear();
    cy.get('#email').type(email);
    cy.get('#passwordRegis').type(password);
    cy.get('.col-6 > form > :nth-child(7) > .user-box > .form-control').type('imi-normal')
    cy.get('.col-6 > form > .btn-signup').click()
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('The password must be 8 characters or more in length and contain a special character, a number, a lowcase character and an uppercase character')
    })
   })

   it('Resgister fail by wrong password format(missing Uppercase character)', () => {
    cy.viewport(1920, 947)
    const email = 'testresetpass10@yopmail.com'
    const password = "123123123."
    cy.get('#email').clear();
    cy.get('#email').type(email);
    cy.get('#passwordRegis').clear();
     cy.get('#passwordRegis').type(password);
     expect(
       cy.get('.col-6 > form > .check-status-pass > :nth-child(3)').find('img').should('have.attr', 'src').should('include', '/static/media/ico-delete.705ae040.png')
       
     )
    
    
    
   })

   it('Resgister fail by wrong password format (missing Lowcase character)', () => {
    cy.viewport(1920, 947)
    const email = 'testresetpass10@yopmail.com'
    const password = "123123123."
    cy.get('#email').clear();
    cy.get('#email').type(email);
    cy.get('#passwordRegis').clear();
     cy.get('#passwordRegis').type(password);
     expect(
       cy.get('.col-6 > form > .check-status-pass > :nth-child(3)').find('img').should('have.attr', 'src').should('include', '/static/media/ico-delete.705ae040.png')
       
     )
   })

   it('Resgister fail by wrong password format (missing special character)', () => {
    cy.viewport(1920, 947)
    const email = 'testresetpass10@yopmail.com'
    const password = "123123123Qa"
    cy.get('#email').clear();
    cy.get('.col-6 > form > :nth-child(5) > .user-box > .form-control').clear();
    cy.get('#email').type(email);
    cy.get('.col-6 > form > :nth-child(5) > .user-box > .form-control').type(password);
    cy.get('.col-6 > form > .btn-signup').click()
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('The password must be 8 characters or more in length and contain a special character, a number, a lowcase character and an uppercase character')
    })
   })

   it('Resgister fail by wrong password format (missing number)', () => {
    cy.viewport(1920, 947)
    const email = 'testresetpass10@yopmail.com'
    const password = "assdsdsssQa@"
    cy.get('#email').clear();
    cy.get('.col-6 > form > :nth-child(5) > .user-box > .form-control').clear();
    cy.get('#email').type(email);
    cy.get('.col-6 > form > :nth-child(5) > .user-box > .form-control').type(password);
    cy.get('.col-6 > form > .btn-signup').click()
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('The password must be 8 characters or more in length and contain a special character, a number, a lowcase character and an uppercase character')
    })
   })

   it('Resgister fail by Invitication Code is wrong', () => {
    cy.viewport(1920, 947)
    const email = 'testresetpass10@yopmail.com'
    const password = "1234567890W@a"
    const inviticationCode = 'waasss'
    cy.get('#email').clear();
    cy.get('.col-6 > form > :nth-child(5) > .user-box > .form-control').clear();
    cy.get('#email').type(email);
    cy.get('#passwordRegis').type(password);
    cy.get('.col-6 > form > :nth-child(7) > .user-box > .form-control').type(inviticationCode)
    cy.get('.col-6 > form > .btn-signup').click()
    cy.wait(3000);
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Invalid invititation code !')
    })
    cy.wait(3000);
   })

   it('Resgister fail by email is exist', () => {
    cy.viewport(1920, 947)
    const email = 'testresetpass10@yopmail.com'
    const password = "1234567890W@a"
    const inviticationCode = 'imi-normal'
    cy.get('#email').clear();
    cy.get('.col-6 > form > :nth-child(5) > .user-box > .form-control').clear();
    cy.get('#email').type(email);
    cy.get('#passwordRegis').type(password);
    cy.get('.col-6 > form > :nth-child(7) > .user-box > .form-control').type(inviticationCode)
    cy.get('.col-6 > form > .btn-signup').click()
    cy.wait(3000);
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Invalid invititation code !')
    })
    cy.wait(3000);
   })
  
  it('Register valid Confirm Email', () => {
    cy.viewport(1920, 947)
    const timeNow = new Date().getTime()
    const email = `testresetpass28${timeNow}@yopmail.com`
    const password = "1234567890W@a"
    const inviticationCode = 'imi-normal'
      cy.get('#firstName').type('test');
      cy.get('#lastName').clear();
      cy.get('#lastName').type('test 1');
      cy.get('#email').clear();
      cy.get('.col-6 > form > :nth-child(5) > .user-box > .form-control').clear();
      cy.get('#email').type(email);
      cy.get('#passwordRegis').type(password);
      cy.get('.col-6 > form > :nth-child(7) > .user-box > .form-control').type(inviticationCode)
      const body = {
        email: email,
        firstName: "test",
        lastName: "test 1",
        password: password,
        emailConfirmed: true
      }
      cy.request('POST', 'https://dev-api.imi.ai/v2/users', body).then((res) => {
        console.log(res);
      })
      cy.wait(3000);
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('SignUp successfully! A mail send to your mail')
      })
      cy.visit('/login')
      const emailLogin = email
      const passwordLogin = "1234567890W@a"
      cy.get('.col-6 > form > :nth-child(2) > .user-box > .form-control').clear()
      cy.get('.col-6 > form > :nth-child(3) > .user-box > .form-control').clear()
      cy.get('.col-6 > form > :nth-child(2) > .user-box > .form-control').type(emailLogin)
      cy.get('.col-6 > form > :nth-child(3) > .user-box > .form-control').type(passwordLogin)
      cy.get('.d-flex > .btn-submit').click()
      cy.wait(3000);
  })
  it('Register valid No Confirm Email', () => {
    cy.viewport(1920, 947)
    cy.visit('/sign-up')
    const timeNow = new Date().getTime()
    const email = `testresetpass28${timeNow}@yopmail.com`
    const password = "1234567890W@a"
    const inviticationCode = 'imi-normal'
      cy.get('#lastName').clear();
      cy.get('#firstName').type('test');
      cy.get('#lastName').type('test last name');
      cy.get('#email').clear();
      cy.get('.col-6 > form > :nth-child(5) > .user-box > .form-control').clear();
      cy.get('#email').type(email);
      cy.get('#passwordRegis').type(password);
      cy.get('.col-6 > form > :nth-child(7) > .user-box > .form-control').type(inviticationCode)
      const body = {
        email: email,
        firstName: "test",
        lastName: "test 1",
        password: password
      }
      cy.request('POST', 'https://dev-api.imi.ai/v2/users', body).then((res) => {
        console.log(res);
      })
      cy.visit('/login')
      const emailLogin = email
      const passwordLogin = "1234567890W@a"
      cy.get('.col-6 > form > :nth-child(2) > .user-box > .form-control').clear()
      cy.get('.col-6 > form > :nth-child(3) > .user-box > .form-control').clear()
      cy.get('.col-6 > form > :nth-child(2) > .user-box > .form-control').type(emailLogin)
      cy.get('.col-6 > form > :nth-child(3) > .user-box > .form-control').type(passwordLogin)
      cy.get('.d-flex > .btn-submit').click()
      cy.wait(3000);
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('Email is not confirm')
      })
  })
})