import { createContext, useContext } from 'react';
import { UserStore } from './UserStore';
 

export class RootStore { 
  userStore: UserStore;
 

  constructor() { 
    this.userStore = new UserStore(this); 
  }
}

const RootStoreContext = createContext<RootStore | null>(null);

export const RootStoreProvider = RootStoreContext.Provider;

export const useStores = () => {
  const store = useContext(RootStoreContext);
  if (!store) {
    throw new Error('useStores must be used within a RootStoreProvider');
  }
  return store;
};
 
