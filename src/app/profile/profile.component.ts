import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestoreDocument,
  AngularFirestore,
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UserProfile } from '../models/user-profile.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private itemDoc: AngularFirestoreDocument<UserProfile>;
  item: Observable<UserProfile>;
  uid: string;

  loading = false;
  error: string;

  downloadUrl: Observable<string>;
  uploadProgress: Observable<number>;

  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private route: ActivatedRoute,
    private auth: AuthService,
    private afStorage: AngularFireStorage
  ) {
    this.uid = this.route.snapshot.paramMap.get('id');
    this.downloadUrl = this.afStorage
      .ref(`users/${this.uid}/profile-image`)
      .getDownloadURL();
      console.log(this.downloadUrl);
  }

  async ngOnInit() {
    this.itemDoc = this.afs.doc<UserProfile>(
      `users/${this.uid}`
    );

    this.item = this.itemDoc.valueChanges();
  }

  async onSubmit(form: NgForm) {
    this.loading = true;

    const { email, name, address, city, state, zip, ip, phone, specialty } =
      form.form.getRawValue();

    const userProfile: UserProfile = {
      uid: this.uid,
      email,
      name,
      address,
      city,
      state,
      zip,
      ip,
      phone,
      specialty,
    };

    try {
      await this.auth.updateUserDocument(userProfile);
    } catch (error) {
      console.log(error.message);
      this.error = error.message;
    }

    this.loading = false;
  }

  profileImageChange(event) {
    this.downloadUrl = null;
    this.error = null;

    //get the file
    const file = event.target.files[0];

    // create the file reference
    const filePath = `users/${this.uid}/profile-image`;
    const fileRef = this.afStorage.ref(filePath);

    // upload and store the task
    const task = this.afStorage.upload(filePath, file);
    task.catch((error) => (this.error = error.message));

    // Observer percentage changes
    this.uploadProgress = task.percentageChanges();

    //get notified when the downloadURL is available
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadUrl = fileRef.getDownloadURL();
        })
      )
      .subscribe();
  }
}