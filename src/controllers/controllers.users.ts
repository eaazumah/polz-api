import { firestore } from '../datastores/firestore.datastore';
import docPath from '../constants/firestoreDocPath';

/**
 * create new user function takes user data
 * @param user
 *
 */
export const create = (user: { [x: string]: any; id?: any }) =>
	new Promise(async(resolve, reject) => {
		firestore
			.doc(docPath.USERS + '/' + user.id)
			.set(user)
			.then(() => {
				resolve();
			})
			.catch((error) => {
				reject(error);
			});
	});

/**
 * read user data
 * @param id
 *
 */
export const read = async(id: string) =>
	new Promise((resolve, reject) => {
		firestore
			.doc(docPath.USERS + '/' + id)
			.get()
			.then((doc) => {
				resolve(doc.data());
			})
			.catch((error) => {
				reject(error);
			});
	});

/**
 * update costumer data
 * @param user
 *
 */
export const update = async(user: { [x: string]: any; id?: any }) =>
	new Promise((resolve, reject) => {
		firestore
			.doc(docPath.USERS + '/' + user.id)
			.update(user)
			.then((doc) => {
				resolve(doc);
			})
			.catch((error) => {
				reject(error);
			});
	});

export const readAll = async() =>
	new Promise((resolve, reject) => {
		firestore
			.collection(docPath.USERS)
			.get()
			.then((snapshot) => {
				const docs = snapshot.docs.map((doc) => doc.data());
				resolve(docs);
			})
			.catch((error) => {
				reject(error);
			});
	});
