import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store';
import { getAllFeeds, getOrdersFeeds } from '@slices/feeds';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllFeeds());
  }, []);

  const orders: TOrder[] = useSelector(getOrdersFeeds);

  const handleGetAllFeeds = () => {
    dispatch(getAllFeeds());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetAllFeeds} />;
};
