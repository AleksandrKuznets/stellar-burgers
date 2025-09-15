import '../support/commands';

describe('Burger Constructor', () => {
  beforeEach(() => {
    //идём на главную
    cy.visit('http://localhost:4000');
    //ждём загрузки продуктов
    cy.wait('@getIngredients');
  });

  // --- ТЕСТ 1 - добавление ингредиентов --- \\
  it('should add ingredients to constructor', () => {
    //добавление булки
    cy.addIngredientToConstructor('Краторная булка N-200i');
    //проверка, что булка появилась в конструкторе
    cy.get('[data-testid=constructor-bun]').should(
      'contain',
      'Краторная булка N-200i'
    );

    //добавление начинки
    cy.addIngredientToConstructor('Биокотлета из марсианской Магнолии');
    //проверка, что начинка появилась в конструкторе
    cy.get('[data-testid=constructor-ingredients]').should(
      'contain',
      'Биокотлета'
    );

    //добавление соуса
    cy.addIngredientToConstructor('Соус Spicy-X');
    // Проверяем что соус появился в конструкторе
    cy.get('[data-testid=constructor-ingredients]').should(
      'contain',
      'Соус Spicy-X'
    );
  });

  // --- ТЕСТ 2 - модальные окна ингредиентов --- \\
  it('should open and close ingredient modal', () => {
    //клик по ингредиенту - открытие модального окна
    cy.contains('Краторная булка N-200i').click();

    //проверка, что модалка открылась
    cy.get('[data-testid=modal]').should('be.visible');
    cy.get('[data-testid=modal]').should('contain', 'Краторная булка N-200i');

    //закрытие модалки крестиком
    cy.closeModal();

    //открытие модалки снова
    cy.contains('Краторная булка N-200i').click();

    //закрытие модалки через оверлей
    cy.get('[data-testid=modal-overlay]').click({ force: true });
    //проверяем что закрылась
    cy.get('[data-testid=modal]').should('not.exist');
  });

  // --- ТЕСТ 3 - полный ход действий от логина, до создания заказа --- \\
  it('should create order successfully', () => {
    //переход на страницу логина
    cy.visit('http://localhost:4000/login');

    //кастомная команда логина
    cy.login('test@example.com', 'password');

    //возврат на главную
    cy.visit('http://localhost:4000/');
    cy.wait('@getIngredients');

    //добавление ингредиентов в конструктор
    cy.addIngredientToConstructor('Краторная булка N-200i');
    cy.addIngredientToConstructor('Биокотлета из марсианской Магнолии');
    cy.addIngredientToConstructor('Соус Spicy-X');

    //кастомная команда оформления заказа
    cy.createOrder();

    //проверка, что модалка с номером заказа открылась
    cy.get('[data-testid=modal]').should('be.visible');
    cy.get('[data-testid=order-number]').should('contain', '12345');

    //закрытие модалки
    cy.closeModal();

    //проверка, что конструктор очистился
    cy.get('[data-testid=constructor-bun]').should('not.exist');
    cy.get('[data-testid=constructor-ingredients]')
      .should('not.contain', 'Биокотлета из марсианской Магнолии')
      .and('not.contain', 'Соус Spicy-X');
  });
});
