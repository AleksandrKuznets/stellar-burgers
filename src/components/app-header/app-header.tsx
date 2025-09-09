import { AppHeaderUI } from '@ui';
import { FC } from 'react';

type TAppHeaderUIProps = {
  userName: string | undefined;
};

export const AppHeader: FC<TAppHeaderUIProps> = ({ userName }) => (
  <AppHeaderUI userName={userName} />
);
