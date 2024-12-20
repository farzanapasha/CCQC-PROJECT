describe('User Login Workflow', () => {
  it('should allow the user to log in and view the dashboard', () => {
    // Visit the login page
    cy.visit('http://localhost:8080/login');

    // Enter credentials
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('1234');
    cy.get('button[type="submit"]').click();

    // Verify successful login
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome, Test User');
  });
});

