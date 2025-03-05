// hooks/useFavorites.ts
import { useFavoritesContext } from '../contexts/FavoritesContext';
import { CompanyId } from '../types';

export const useFavorites = () => {
  const { state, dispatch } = useFavoritesContext();

  const addFavorite = (companyId: CompanyId) => {
    dispatch({ type: 'ADD_FAVORITE', payload: { companyId } });
  };

  const removeFavorite = (companyId: CompanyId) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: { companyId } });
  };

  const setFavorites = (favorites: CompanyId[]) => {
    dispatch({ type: 'SET_FAVORITES', payload: { favorites } });
  };

  return { favorites: state.favorites, addFavorite, removeFavorite, setFavorites };
};
