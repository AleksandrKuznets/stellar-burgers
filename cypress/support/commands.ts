export {};

//расширение встроенных команд
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      addIngredientToConstructor(ingredientName: string): Chainable<void>;
      createOrder(): Chainable<void>;
      closeModal(): Chainable<void>;
    }
  }
}

//команда авторизации
Cypress.Commands.add('login', (email: string, password: string) => {
  //мокирование запроса авторизации
  cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/login', {
    statusCode: 200,
    body: {
      success: true,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: { email: 'test@example.com', name: 'Test User' }
    }
  }).as('loginRequest');

  //мокирование запроса получения данных пользователя
  cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
    statusCode: 200,
    body: {
      success: true,
      user: { email: 'test@example.com', name: 'Test User' }
    }
  }).as('getUser');

  //заполнение формы логина
  cy.get('input[name=email]').type(email);
  cy.get('input[name=password]').type(password);
  cy.get('button').contains('Войти').click();

  //ожидание завершения запроса логина
  cy.wait('@loginRequest');

  //проверка, что запрос данных не произошёл(так, чисто на ошибочку)
  cy.get('@getUser.all', { timeout: 1000 }).then((interceptions) => {
    if (interceptions.length === 0) {
      console.log('getUser request did not occur, continuing...');
    }
  });
});

//команда добавления ингредиента в конструктор
Cypress.Commands.add('addIngredientToConstructor', (ingredientName: string) => {
  //поиск элемента с текстом ингредиента
  cy.contains(ingredientName)
    //родительский <li> (карточка ингредиента)
    .parents('li')
    .within(() => {
      //поиск и клик кнопки с текстом "Добавить" в карточке
      cy.get('button').contains('Добавить').click();
    });
});

//команда создания заказа
Cypress.Commands.add('createOrder', () => {
  //мокирование запроса создания заказа
  cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', {
    statusCode: 200,
    body: {
      success: true,
      name: 'Space burger',
      order: { number: 12345 }
    }
  }).as('createOrder');

  //клик по кнопке оформления заказа
  cy.get('button').contains('Оформить заказ').click();
  //ожидание завершения запроса создания заказа
  cy.wait('@createOrder');
});

//команда закрытия модального окна
Cypress.Commands.add('closeModal', () => {
  //клик по кнопке закрытия модального окна
  cy.get('[data-testid=modal-close]').click();
  //проверка, что модальное окно закрылось
  cy.get('[data-testid=modal]').should('not.exist');
});
