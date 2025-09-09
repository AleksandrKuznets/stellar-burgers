import { useDispatch, useSelector } from '@services/store';
import { getUserOrders, userOrdersList } from '@slices/userOrders';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(userOrdersList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserOrders());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
