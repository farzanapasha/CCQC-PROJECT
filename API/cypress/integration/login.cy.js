describe('User Login Workflow', () => {
  it('should allow the user to log in and view the dashboard', () => {
    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: 'fake-token' } }).as('loginRequest');

    // Perform login
    cy.visit('http://localhost:8080/login');
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('1234');
    cy.get('button[type="submit"]').click();

    // Wait for mocked API call
    cy.wait('@loginRequest');
    cy.url().should('include', '/dashboard');
  });
});

