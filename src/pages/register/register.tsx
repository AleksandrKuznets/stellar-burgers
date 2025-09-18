import { TRegisterData } from '@api';
import { useDispatch, useSelector } from '@services/store/store';
import { getError, registerUser } from '@slices/user/user';
import { RegisterUI } from '@ui-pages';
import { FC, SyntheticEvent, useState } from 'react';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const errorMessage = useSelector(getError);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const userData: TRegisterData = {
      name: userName,
      email: email,
      password: password
    };
    dispatch(registerUser(userData));
  };

  return (
    <RegisterUI
      errorText={errorMessage}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
