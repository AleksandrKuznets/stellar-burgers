import store, { RootState } from './store';

describe('rootReducer', () => {
  test('should properly initialize with combined reducers', () => {
    //проверка, что стор создан
    expect(store).toBeDefined();

    //получение состояния rootReducer
    const state = store.getState() as RootState;

    //проверка, что все слайсы существуют в rootReducer
    expect(state.constructorIngredient).toBeDefined();
    expect(state.ingredients).toBeDefined();
    expect(state.feeds).toBeDefined();
    expect(state.user).toBeDefined();
    expect(state.newOrder).toBeDefined();
  });
});
