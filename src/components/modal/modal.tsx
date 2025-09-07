import { ModalUI } from '@ui';
import { FC, memo, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useLocation } from 'react-router-dom';
import { TModalProps } from './type';

const modalRoot = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  const location = useLocation();

  const modalTitle = useMemo(() => {
    if (title) return title;

    const isOrderPath =
      location.pathname.includes('/feed/') ||
      location.pathname.includes('/profile/orders/');

    if (isOrderPath) {
      const orderId = location.pathname.split('/').pop();
      return orderId ? `#${orderId}` : '';
    }

    return '';
  }, [title, location.pathname]);

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return ReactDOM.createPortal(
    <ModalUI title={modalTitle} onClose={onClose}>
      {children}
    </ModalUI>,
    modalRoot!
  );
});
