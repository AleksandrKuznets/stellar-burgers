import {
  getIngredientsList,
  ingredientsSlise,
  initialState
} from '@slices/ingredients/ingredients';
import { TIngredient } from '@utils-types';

//мок для API
jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

//тестовые данные
const mockIngredients: TIngredient[] = [
  //булка
  {
    _id: '643d69a5c3f7b9001cfa093c',
    type: 'bun',
    name: 'Краторная булка N-200i',
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    calories: 420,
    proteins: 80,
    fat: 24,
    carbohydrates: 53
  },

  //котлета
  {
    _id: '643d69a5c3f7b9001cfa0941',
    type: 'main',
    name: 'Биокотлета из марсианской Магнолии',
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    calories: 4242,
    proteins: 420,
    fat: 142,
    carbohydrates: 242
  }
];

const mockError = new Error('Network error');

describe('ingredients slice', () => {
  //очистка моков перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- тест начального состояния --- \\
  describe('initial state', () => {
    //проверка, что при инициализации редьюсер возвращает корректное начальное состояние
    test('should return initial state', () => {
      const state = ingredientsSlise.reducer(undefined, { type: '' });
      expect(state).toEqual(initialState);
    });
  });

  // --- тест состояния pending - загрузка --- \\
  describe('getIngredientsList pending', () => {
    test('should set loading to true and clear error on pending', () => {
      const action = getIngredientsList.pending('', undefined);
      const state = ingredientsSlise.reducer(initialState, action);

      //проверка, что загрузка началась
      expect(state.loading).toBe(true);
      //ошибки очищены
      expect(state.error).toBe('');
      //данные не изменились
      expect(state.ingredients).toEqual([]);
    });
  });

  // --- тест состояния fulfilled - успешно --- \\
  describe('getIngredientsList fulfilled', () => {
    test('should set loading to false, clear error and set ingredients on success', () => {
      const action = getIngredientsList.fulfilled(
        mockIngredients,
        '',
        undefined
      );
      const state = ingredientsSlise.reducer(
        { ...initialState, loading: true, error: 'Previous error' },
        action
      );

      //проверка, что загрузка завершена
      expect(state.loading).toBe(false);
      //ошибки очищены
      expect(state.error).toBe('');
      //данные получены
      expect(state.ingredients).toEqual(mockIngredients);
    });
  });

  // --- тест состояния rejected - ошибка --- \\
  describe('getIngredientsList rejected', () => {
    //тест с конкретной ошибкой
    test('should set loading to false and set error message on failure', () => {
      const action = getIngredientsList.rejected(mockError, '', undefined);
      const state = ingredientsSlise.reducer(
        { ...initialState, loading: true },
        action
      );

      //проверка, что загрузка остановлена
      expect(state.loading).toBe(false);
      //сообщение об ошибке
      expect(state.error).toBe('Network error');
      //данные не изменились
      expect(state.ingredients).toEqual([]);
    });

    //тест с null ошибкой
    test('should use default error message when error is null', () => {
      //создание действия вручную, чтобы error был действительно null
      const action = {
        type: getIngredientsList.rejected.type,
        error: null,
        meta: {
          arg: undefined,
          requestId: '',
          requestStatus: 'rejected'
        }
      };

      const state = ingredientsSlise.reducer(
        { ...initialState, loading: true },
        action
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Что-то пошло не так');
      expect(state.ingredients).toEqual([]);
    });
  });

  // --- тесты селекторов --- \\
  describe('ingredients selectors', () => {
    //имитация всего store
    const testState = {
      ingredients: {
        ingredients: mockIngredients,
        loading: true,
        error: 'Test error'
      }
    };

    //тест на то, что можем получить всё состояние ингредиентов
    test('getIngredientsState should return entire state', () => {
      const result = ingredientsSlise.selectors.getIngredientsState(testState);
      expect(result).toEqual(testState.ingredients);
    });

    //тест, что можем получить только статус загрузки
    test('getIngredientsLoadingState should return loading state', () => {
      const result =
        ingredientsSlise.selectors.getIngredientsLoadingState(testState);
      expect(result).toBe(true);
    });

    //тест, что можем получить только список ингредиентов
    test('getIngredients should return ingredients array', () => {
      const result = ingredientsSlise.selectors.getIngredients(testState);
      expect(result).toEqual(mockIngredients);
    });
  });
});
