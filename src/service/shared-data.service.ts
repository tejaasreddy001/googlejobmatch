import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SharedDataService {
  private userIdSubject = new BehaviorSubject<string | null>(this.getFromLocalStorage('userId'));
  userId$ = this.userIdSubject.asObservable();

  private userNameSubject = new BehaviorSubject<string | null>(this.getFromLocalStorage('userName'));
  userName$ = this.userNameSubject.asObservable();

  constructor() { }

  setUserId(userId: string): void {
    this.userIdSubject.next(userId);
    this.saveToLocalStorage('userId', userId);
  }

  setUserName(userName: string): void {
    this.userNameSubject.next(userName);
    this.saveToLocalStorage('userName', userName);
  }

  private removeFromLocalStorage(key: string): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem(key);
    }
  }

  clearUserData(): void {
    this.userIdSubject.next(null);
    this.userNameSubject.next(null);
    this.removeFromLocalStorage('userId');
    this.removeFromLocalStorage('userName');
  }

  private saveToLocalStorage(key: string, value: string): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem(key, value);
    }
  }

  
  private getFromLocalStorage(key: string): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  }
}