import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserProfile } from '../models/user-profile.model';
import { first } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {}

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
    // return true;
    // // const user = JSON.parse(localStorage.getItem('user') || '');
    // // return user != '';
    // //AngularFireAuth.currentUser
    // // return !!this.afAuth.currentUser;
    // return this.afAuth.authState.pipe(first()).toPromise();
    return true;
  }

  async createUserDocument() {
    // get the current user
    const user = await this.afAuth?.currentUser;

    // create the object with new data
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      specialty: '',
      ip: '',
    };

    //write to Cloud Firestore
    return this.afs.doc(`users/${user.uid}`).set(userProfile);
  }

  updateUserDocument(userProfile: UserProfile) {
    return this.afs.doc(`users/${userProfile.uid}`).update(userProfile);
  }

  async routeOnLogin() {
    const user = this.afAuth.currentUser;
    const token = await (await user).getIdTokenResult();

    if (token.claims.admin) {
      this.router.navigate(['/users']);
    } else {
      this.router.navigate([`/profile/${(await user).uid}`]);
    }
  }
}
