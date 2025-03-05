// contexts/FavoritesContext.tsx
import React, { createContext, useReducer, ReactNode, useContext } from 'react';
import { CompanyId } from '../types';

export interface FavoritesState {
  favorites: CompanyId[];
}

const initialState: FavoritesState = {
  favorites: [],
};

export type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: { companyId: CompanyId } }
  | { type: 'REMOVE_FAVORITE'; payload: { companyId: CompanyId } }
  | { type: 'SET_FAVORITES'; payload: { favorites: CompanyId[] } };

function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'ADD_FAVORITE':
      return { favorites: [...state.favorites, action.payload.companyId] };
    case 'REMOVE_FAVORITE':
      return { favorites: state.favorites.filter(id => id !== action.payload.companyId) };
    case 'SET_FAVORITES':
      return { favorites: action.payload.favorites };
    default:
      return state;
  }
}

interface FavoritesContextProps {
  state: FavoritesState;
  dispatch: React.Dispatch<FavoritesAction>;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);
  return <FavoritesContext.Provider value={{ state, dispatch }}>{children}</FavoritesContext.Provider>;
};

export function useFavoritesContext(): FavoritesContextProps {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavoritesContext は FavoritesProvider 内で使用してください');
  }
  return context;
}
