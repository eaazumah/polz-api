import * as firebase from 'firebase-admin';
import * as serviceAccount from './polz-c9d90-ecd0de248297.json';
import CONFIG from '../config/config';
import { Bucket } from '@google-cloud/storage';

firebase.initializeApp({
	credential: firebase.credential.cert(JSON.parse(CONFIG.FIREBASE_SERVICE_ACCOUNT)),
	databaseURL: 'https://polz-c9d90.firebaseio.com',
	storageBucket: CONFIG.STORAGE_BUCKET
});

const firestore = firebase.firestore();

const storage = firebase.storage();

export { firestore, storage };
