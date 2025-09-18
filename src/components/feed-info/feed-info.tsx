import { FC } from 'react';

import { useSelector } from '@services/store/store';
import {
  getOrdersFeeds,
  getTotalFeeds,
  getTotalTodayFeeds
} from '@slices/feeds/feeds';
import { FeedInfoUI } from '@ui';
import { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders: TOrder[] = useSelector(getOrdersFeeds);
  const feed = {
    total: useSelector(getTotalFeeds),
    totalToday: useSelector(getTotalTodayFeeds)
  };

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
