describe('Smart record reader testing', () => {
    it('Testing quiz test home page', () => {
      cy.viewport(1920, 947)
      cy.visit('/home');
      cy.get('#showQuiz').click()
      cy.get('#quizName').type('test');
      cy.get('#quizEmail').type('test@imi.ai');
      cy.get('#nextStep2').click()
      cy.wait(3000)

      cy.get('.selectionId').first().click()
      cy.wait(1000)
      cy.get('#confirmCongrats').click({force: true})
      cy.wait(1000)
      
      cy.get('.selectionId').last().click()
      cy.wait(1000)
      cy.get('#confirmCongrats').click({force: true})
      cy.wait(1000)

      cy.get('.selectionId').first().click()
      cy.wait(1000)
      cy.get('#confirmCongrats').click({force: true})
      cy.wait(1000)

      cy.get('.selectionId').last().click()
      cy.wait(1000)
      cy.get('#confirmCongrats').click({force: true})
      cy.wait(1000)

      cy.get('.selectionId').last().click()
      cy.wait(1000)
      cy.get('#confirmCongrats').click({force: true})
      cy.wait(1000)
    });
  });