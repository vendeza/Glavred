import { makeAutoObservable } from 'mobx';
import { RootStore } from './RootStore';


export class UserStore {
  name: string = 'NAME TEST';
  constructor(private readonly rootStore: RootStore) {
    makeAutoObservable(this); 
  }
 
}
