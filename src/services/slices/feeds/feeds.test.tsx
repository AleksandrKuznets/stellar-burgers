import { getAllFeeds, feedsSlice, initialState } from './feeds';
import { TOrder } from '@utils-types';

//мок для API
jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

//тестовые данные (массив тестовых заказов)
const mockOrders: TOrder[] = [
  {
    _id: '68c9745d673086001ba887a5',
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa093c'
    ],
    status: 'done',
    name: 'Краторный био-марсианский бургер',
    createdAt: '2025-09-16T14:29:49.829Z',
    updatedAt: '2025-09-16T14:29:51.043Z',
    number: 88827
  },
  {
    _id: '68c9745d673086001ba887a6',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa0942',
      '643d69a5c3f7b9001cfa093d'
    ],
    status: 'pending',
    name: 'Флюоресцентный космический бургер',
    createdAt: '2025-09-16T14:30:00.000Z',
    updatedAt: '2025-09-16T14:30:02.000Z',
    number: 88828
  }
];

const mockFeedsResponse = {
  success: true,
  orders: mockOrders,
  total: 88827, //общее кол-во заказов
  totalToday: 42 //заказов за сегодня
};

const mockError = new Error('Ошибка сети');

describe('feeds slice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- тест начального состояния --- \\
  describe('initial state', () => {
    //проверка, что при инициализации все поля имеют значения по умолчанию
    test('should return initial state with empty orders and zero counters', () => {
      const state = feedsSlice.reducer(undefined, { type: '' });

      expect(state).toEqual(initialState);
    });
  });

  // --- тест начала загрузки --- \\
  describe('getAllFeeds pending', () => {
    test('should set loading state and clear any previous errors', () => {
      //создание действия начало загрузки
      const action = getAllFeeds.pending('', undefined);

      //предыдущее состояние (с ошибкой)
      const previousState = {
        ...initialState,
        error: 'ошибка'
      };

      const state = feedsSlice.reducer(previousState, action);

      //проверка, что загрузка началась
      expect(state.isLoading).toBe(true);

      //проверка, ошибка очищена
      expect(state.error).toBeUndefined();

      //проверка, что остальные поля не изменились
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });
  });

  // --- тест успешной загрузки --- \\
  describe('getAllFeeds fulfilled', () => {
    //создание действия успешной загрузки
    test('should update state with feeds data and clear loading state', () => {
      const action = getAllFeeds.fulfilled(mockFeedsResponse, '', undefined);

      //предыдущее состояние(в процессе загрузки с ошибкой)
      const previousState = {
        ...initialState,
        isLoading: true,
        error: 'ошибка'
      };

      const state = feedsSlice.reducer(previousState, action);

      //проверка, что загрузка завершена
      expect(state.isLoading).toBe(false);

      //проверка, что ошибка очищена
      expect(state.error).toBeUndefined();

      //проверка, что заказы обновлены
      expect(state.orders).toEqual(mockOrders);

      //общ кол-во
      expect(state.total).toBe(88827);

      //заказов сегодня
      expect(state.totalToday).toBe(42);
    });

    //тест структуры данных заказа
    test('should contain correct order data structure', () => {
      //создание действия успешной загрузки
      const action = getAllFeeds.fulfilled(mockFeedsResponse, '', undefined);
      const state = feedsSlice.reducer(initialState, action);

      //проверка структуры первого заказа
      const firstOrder = state.orders[0];
      expect(firstOrder._id).toBe('68c9745d673086001ba887a5');
      expect(firstOrder.name).toBe('Краторный био-марсианский бургер');
      expect(firstOrder.number).toBe(88827);
      expect(firstOrder.status).toBe('done');
      expect(firstOrder.ingredients).toHaveLength(3);
      expect(firstOrder.createdAt).toBe('2025-09-16T14:29:49.829Z');
    });
  });

  // --- тест ошибки загрузки --- \\
  describe('getAllFeeds rejected', () => {
    //тест ошибки загрузки с конкретной ошибкой
    test('should set error message and reset all data on failure', () => {
      //создание ошибки загрузки с mock ошибкой
      const action = getAllFeeds.rejected(mockError, '', undefined);

      //предыдущее состояние
      const previousState = {
        orders: mockOrders,
        total: 88827,
        totalToday: 42,
        isLoading: true,
        error: undefined
      };

      const state = feedsSlice.reducer(previousState, action);

      //проверка, что загрузка остановилась
      expect(state.isLoading).toBe(false);

      //ошибка установлена
      expect(state.error).toBe('Ошибка сети');

      //данные очищены
      expect(state.orders).toEqual([]);

      //счётчики = 0
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });

    //тест обработки null ошибки
    test('should handle null error gracefully', () => {
      // объект с null
      const action = {
        type: getAllFeeds.rejected.type,
        error: null,
        meta: {
          arg: undefined,
          requestId: '',
          requestStatus: 'rejected'
        }
      };

      //идёт загрузка -> ошибка с null
      const state = feedsSlice.reducer(
        { ...initialState, isLoading: true },
        action
      );

      //проверка, что загрузка остановилась
      expect(state.isLoading).toBe(false);

      // ошибка должна быть undefined
      expect(state.error).toBeUndefined();

      //данные очищены
      expect(state.orders).toEqual([]);

      //счётчики = 0
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });
  });

  // --- тесты селекторов --- \\
  describe('feeds selectors', () => {
    //тестовое состояние всего приложения
    const testState = {
      feeds: {
        orders: mockOrders,
        total: 88827,
        totalToday: 42,
        isLoading: true,
        error: 'Тестовая ошибка'
      }
    };

    //проверка на корректное извлечение массива заказов из состояния
    test('getOrdersFeeds should return array of orders', () => {
      const result = feedsSlice.selectors.getOrdersFeeds(testState);
      expect(result).toEqual(mockOrders);
      expect(result[0].name).toBe('Краторный био-марсианский бургер');
    });

    //проверка на корректное извлечение кол-ва заказов из состояния
    test('getTotalFeeds should return total orders count', () => {
      const result = feedsSlice.selectors.getTotalFeeds(testState);
      expect(result).toBe(88827);
    });

    //проверка на корректное извлечение кол-ва заказов за сегодня из состояния
    test('getTotalTodayFeeds should return today orders count', () => {
      const result = feedsSlice.selectors.getTotalTodayFeeds(testState);
      expect(result).toBe(42);
    });
  });
});
