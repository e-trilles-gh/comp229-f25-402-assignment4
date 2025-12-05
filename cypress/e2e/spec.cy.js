describe('navigation is working', () => {
  it('navigation', function () {
    cy.visit('https://comp229-f25-402-assignment4.onrender.com/')
    cy.get('#root a[href="/"]').click();
    cy.get('#root a[href="/about"]').click();
    cy.get('#root a[href="/contact"]').click();
    cy.get('#root a[href="/education"]').click();
    cy.get('#root a[href="/projects"]').click();
    cy.get('#gallerybox button.rightButton').click();
    cy.get('#gallerybox button.rightButton').click();
    cy.get('#gallerybox button.rightButton').click();
    cy.get('#gallerybox button.rightButton').click();
    cy.get('#gallerybox button.rightButton').click();
    cy.get('#gallerybox button.rightButton').click();
    cy.get('#root a[href="/services"]').click();
    cy.get('#root a[href="/signin"]').click();
    cy.get('#root a[href="/signup"]').click();
  })
});

describe('registration and signout is working', () => {
  it('registration and signout', function () {
    cy.visit('https://comp229-f25-402-assignment4.onrender.com/')
    cy.get('#root a[href="/signup"]').click();
    cy.get('[name="firstName"]').click();
    cy.get('[name="firstName"]').type('john');
    cy.get('[name="lastName"]').type('doe');
    cy.get('[name="email"]').type('john@gmail.com');
    cy.get('[name="password"]').type('password');
    cy.get('[name="retypePassword"]').type('password');
    cy.get('#root button[type="submit"]').click();
    cy.contains('button', 'Sign Out').should('be.visible').click();

  })
});

describe('create, edit, and delete are working', () => {
  it('signin, create and edit/delete objects', function () {
    cy.visit('https://comp229-f25-402-assignment4.onrender.com/')
    cy.get('#root a[href="/signin"]').click();
    cy.get('[name="email"]').click();
    cy.get('[name="email"]').type('john@gmail.com');
    cy.get('[name="password"]').type('password');
    cy.intercept('POST', '/api/users/login').as('login');
    cy.get('#root input[type="submit"]').click();
    cy.wait('@login').then((res) => {
      const realToken = res.response.body.token;
      window.localStorage.setItem('token', realToken);
    });
    cy.get('#root a[href="/contact"]').click();
    cy.contains('button', 'Add Contact').should('be.visible').click();
    cy.get('[name="firstname"]', { timeout: 10000 }).should('be.visible').click();
    cy.get('[name="firstname"]').type('john');
    cy.get('[name="lastname"]').type('doe');
    cy.get('[name="email"]').type('john@gmail.com');
    cy.get('#root button[type="submit"]').click();
    cy.get('#root a[href="/education"]').click();
    cy.get('#root div:nth-child(1) > button').click();
    cy.get('[name="title"]').click();
    cy.get('[name="title"]').type('Degree');
    cy.get('[name="firstname"]').type('John');
    cy.get('[name="lastname"]').type('Doe');
    cy.get('[name="email"]').type('John@gmail.com');
    cy.get('[name="completion"]').type('2025-12-04');
    cy.get('#root [name="description"]').type('Description for Education Degree');
    cy.get('#root button[type="submit"]').click();
    cy.get('#root a[href="/projects"]').click();
    cy.get('#root div:nth-child(1) > button').click();
    cy.get('[name="title"]').click();
    cy.get('[name="title"]').type('Full Stack Application');
    cy.get('[name="firstname"]').type('John');
    cy.get('[name="lastname"]').type('Doe');
    cy.get('[name="email"]').type('john@gmail.com');
    cy.get('[name="completion"]').type('2025-12-04');
    cy.get('#root [name="description"]').type('Description for the project');
    cy.get('#root button[type="submit"]').click();

    cy.get('#root a[href="/contact"]').click();
    cy.get('#root tr:nth-child(1) button:nth-child(1)').click();
    cy.get('[name="firstname"]').click();
    cy.get('[name="firstname"]').type(' jr');
    cy.get('#root button[type="submit"]').click();
    cy.get('#root a[href="/education"]').click();
    cy.get('#root tr:nth-child(1) button:nth-child(1)').click();
    cy.get('[name="title"]').click();
    cy.get('[name="title"]').type(' - edited');
    cy.get('#root button[type="submit"]').click();
    cy.get('#root a[href="/projects"]').click();
    cy.get('#root tr:nth-child(1) button:nth-child(1)').click();
    cy.get('[name="title"]').click();
    cy.get('[name="title"]').type(' - edited');
    cy.get('#root button[type="submit"]').click();

    cy.get('#root a[href="/contact"]').click();
    cy.get('#root tr:nth-child(1) button:nth-child(2)').click();
    cy.get('#root a[href="/education"]').click();
    cy.get('#root tr:nth-child(1) button:nth-child(2)').click();
    cy.get('#root a[href="/projects"]').click();
    cy.get('#root tr:nth-child(1) button:nth-child(2)').click();

  })
});

describe('delete user and its objects are working', () => {
  it('sign in and delete user', function () {
    cy.visit('https://comp229-f25-402-assignment4.onrender.com/')
    cy.get('#root a[href="/signin"]').click();
    cy.get('[name="email"]').click();
    cy.get('[name="email"]').type('john@gmail.com');
    cy.get('[name="password"]').type('password');
    cy.get('#root input[type="submit"]').click();
    cy.get('#root button:nth-child(2)').click();
  })
});