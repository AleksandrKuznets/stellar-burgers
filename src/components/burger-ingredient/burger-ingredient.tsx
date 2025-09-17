import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as generatedId } from 'uuid';

import { useDispatch } from '@services/store/store';
import { addItem } from '@slices/constructor/constructor';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      dispatch(addItem({ ...ingredient, id: generatedId() }));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
