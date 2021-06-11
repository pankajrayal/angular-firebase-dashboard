import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  async login(email: string, password: string) {
    var result = await this.afAuth.signInWithEmailAndPassword(email, password);
    // this.router.navigate(['']);
  }

  async logout() {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['']);
  }

  isLoggedIn() {
    console.log('abc');
    return true;
    // const user = JSON.parse(localStorage.getItem('user') || '');
    // return user != '';
    //AngularFireAuth.currentUser
    // return !!this.afAuth.currentUser;
  }
}
