import { useDispatch, useSelector } from '@services/store';
import { getError, loginUser } from '@slices/user';
import { LoginUI } from '@ui-pages';
import { FC, SyntheticEvent, useState } from 'react';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const errorMessage = useSelector(getError);
  const localStorageEmail = localStorage.getItem('email') ?? '';
  const [email, setEmail] = useState(localStorageEmail);
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    localStorage.setItem('email', email);
    dispatch(
      loginUser({
        email: email,
        password: password
      })
    );
  };

  return (
    <LoginUI
      errorText={errorMessage}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
