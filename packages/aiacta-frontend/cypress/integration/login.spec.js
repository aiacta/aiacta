describe('Login', () => {
  it('should be able to sign in to an existing account', () => {
    cy.visit('/');

    cy.get('input[name="name"]').type('haha');
    cy.get('input[name="password"]').type('haha');
    cy.get('button[type="submit"]').click();
  });
});
