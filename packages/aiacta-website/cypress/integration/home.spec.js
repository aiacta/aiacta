describe('Home', () => {
  it('should have a play button with a link to the app', () => {
    cy.visit('/');

    cy.contains('a', 'Play now')
      .should('exist')
      .and('have.attr', 'href', 'https://play.aiacta.com');
  });
});
