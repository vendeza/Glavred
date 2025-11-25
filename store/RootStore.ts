import { createContext, useContext } from 'react';
import { UserStore } from './UserStore';
import { SocialPostStore } from './SocialPostStore';
 

export class RootStore { 
  userStore: UserStore;
  socialPostStore: SocialPostStore;
 

  constructor() { 
    this.userStore = new UserStore(this); 
    this.socialPostStore = new SocialPostStore();
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
 
