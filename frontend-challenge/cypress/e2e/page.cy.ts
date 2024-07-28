describe('Home Component', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/people/*', { fixture: 'people.json' }).as('getPeople');
    cy.intercept('GET', '**/films/*', { fixture: 'film.json' }).as('getFilm');
    cy.visit('http://localhost:3000');
  });

  it('should render initial elements correctly', () => {
    cy.contains('Personagens dos filmes Star Wars').should('be.visible');
    cy.get('.people-list').should('exist');
    cy.get('table').should('exist');
  });

  it('should load more data on scroll', () => {
    cy.wait('@getPeople');
    cy.get('.people-list').scrollTo('bottom');
    cy.wait('@getPeople');
    cy.get('table tbody tr').should('have.length.greaterThan', 10); // Assuming initial load has less than 10 rows
  });

  it('should display error toast on API failure', () => {
    cy.intercept('GET', '**/people/*', { statusCode: 500 }).as('getPeopleError');
    cy.visit('http://localhost:3000');
    cy.wait('@getPeopleError');
    cy.contains('Erro ao buscar os personagens, por favor tente novamente mais tarde').should('be.visible');
  });
});
