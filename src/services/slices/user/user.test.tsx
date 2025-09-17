import {
  getUserData,
  updateUser,
  registerUser,
  loginUser,
  logoutUser,
  userSlice,
  initialState
} from '@slices/user/user';
import { TRegisterData, TLoginData } from '@api';
import { TUser } from '@utils-types';

//моки для API
jest.mock('@api', () => ({
  getUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  logoutApi: jest.fn()
}));

// --- Тестовые данные --- \\
//тестовый пользователь
const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

//данные для регистрации
const mockRegisterData: TRegisterData = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
};

//данные для логина
const mockLoginData: TLoginData = {
  email: 'test@example.com',
  password: 'password123'
};

//данные для обновления профиля
const mockUpdateData: Partial<TRegisterData> = {
  name: 'Updated User'
};

//ответ API при успехе
const mockUserResponse = {
  user: mockUser,
  success: true,
  accessToken: 'mock-token',
  refreshToken: 'mock-refresh-token'
};

//ответ API при выходе
const mockLogoutResponse = {
  success: true,
  message: 'Logged out successfully'
};

//тестовая ошибка
const mockError = new Error('Ошибка аутентификации');

describe('user slice', () => {
  //очистка моков перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- тест начального состояния --- \\
  describe('initial state', () => {
    test('should return initial state with empty user data and not checked auth', () => {
      const state = userSlice.reducer(undefined, { type: '' });

      expect(state).toEqual(initialState);
    });
  });

  // --- тест начала действий - pending --- \\
  describe('pending actions', () => {
    test('should set loading state and clear error for any pending action', () => {
      // создание массива действий
      const actions = [
        getUserData.pending('request-id', undefined),
        updateUser.pending('request-id', mockUpdateData),
        registerUser.pending('request-id', mockRegisterData),
        loginUser.pending('request-id', mockLoginData),
        logoutUser.pending('request-id', undefined)
      ];

      actions.forEach((action) => {
        //предыдущее состояние с ошибкой и выкл загрузкой
        const previousState = {
          ...initialState,
          error: 'ошибка',
          isLoading: false
        };

        const state = userSlice.reducer(previousState, action);

        //проверка, что получилось: загрузка on, нет ошибки, остальное не изменилось
        expect(state.isLoading).toBe(true);
        expect(state.error).toBe('');
        expect(state.isAuthChecked).toBe(false);
        expect(state.user).toEqual({ email: '', name: '' });
      });
    });
  });

  // --- тест успешных операций - fulfilled --- \\
  describe('fulfilled actions', () => {
    test('should set user data, complete auth check and clear error for user operations', () => {
      //массив успешно выполненных действий
      const actions = [
        getUserData.fulfilled(mockUserResponse, 'request-id', undefined),
        updateUser.fulfilled(mockUserResponse, 'request-id', mockUpdateData),
        registerUser.fulfilled(
          mockUserResponse,
          'request-id',
          mockRegisterData
        ),
        loginUser.fulfilled(mockUserResponse, 'request-id', mockLoginData)
      ];

      actions.forEach((action) => {
        //предыдущее состояние с ошибкой и вкл загрузкой
        const previousState = {
          isAuthChecked: false,
          user: { email: '', name: '' },
          error: 'Предыдущая ошибка',
          isLoading: true
        };

        const state = userSlice.reducer(previousState, action);

        //проверка результатов: флаг аутентификации true, данные пользователя установились, ошибка очистилась, загрузка off
        expect(state.isAuthChecked).toBe(true);
        expect(state.user).toEqual(mockUser);
        expect(state.error).toBe('');
        expect(state.isLoading).toBe(false);
      });
    });

    //тест успешного выхода
    test('should reset state on successful logout', () => {
      //создание действия
      const action = logoutUser.fulfilled(
        mockLogoutResponse,
        'request-id',
        undefined
      );

      //предыдущее состояние с данными пользователя
      const previousState = {
        isAuthChecked: true,
        user: mockUser,
        error: 'Какая-то ошибка',
        isLoading: true
      };

      const state = userSlice.reducer(previousState, action);

      //проверка, что состояние сбросилось к начальному
      expect(state).toEqual(initialState);
    });
  });

  // --- тест ошибок операций - rejected --- \\
  describe('rejected actions', () => {
    test('should set error message and complete loading for any rejected action', () => {
      //массив действий с ошибкой
      const actions = [
        getUserData.rejected(mockError, 'request-id', undefined),
        updateUser.rejected(mockError, 'request-id', mockUpdateData),
        registerUser.rejected(mockError, 'request-id', mockRegisterData),
        loginUser.rejected(mockError, 'request-id', mockLoginData),
        logoutUser.rejected(mockError, 'request-id', undefined)
      ];

      actions.forEach((action) => {
        //предыдущее состояние с вкл загрузкой и без ошибок
        const previousState = {
          ...initialState,
          isLoading: true,
          error: ''
        };

        const state = userSlice.reducer(previousState, action);

        //проверка итогов: загрузка off, сообщение об ошибке, остальное не изменилось
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Ошибка аутентификации');
        expect(state.isAuthChecked).toBe(false);
        expect(state.user).toEqual({ email: '', name: '' });
      });
    });

    //тест обработки null
    test('should handle null error gracefully', () => {
      //создание действия с null
      const action = {
        type: getUserData.rejected.type,
        error: null,
        meta: {
          arg: undefined,
          requestId: 'request-id',
          requestStatus: 'rejected'
        }
      };

      //применение действия к состоянию
      const state = userSlice.reducer(
        { ...initialState, isLoading: true },
        action
      );

      //проверка итогов
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('');
    });
  });

  // --- Тесты селекторов --- \\
  describe('user selectors', () => {
    //тестовое состояние всего store
    const testState = {
      user: {
        isAuthChecked: true,
        user: mockUser,
        error: 'Тестовая ошибка',
        isLoading: false
      }
    };

    //получение флага аутентификации
    test('isAuthCheckedSelector should return auth check status', () => {
      const result = userSlice.selectors.isAuthCheckedSelector(testState);
      expect(result).toBe(true);
    });

    //получение данных пользователя
    test('getUser should return user data', () => {
      const result = userSlice.selectors.getUser(testState);
      expect(result).toEqual(mockUser);
      expect(result.email).toBe('test@example.com');
    });

    //получение имени пользователя
    test('getUserName should return user name', () => {
      const result = userSlice.selectors.getUserName(testState);
      expect(result).toBe('Test User');
    });

    //получение ошибки
    test('getError should return error message', () => {
      const result = userSlice.selectors.getError(testState);
      expect(result).toBe('Тестовая ошибка');
    });
  });
});
