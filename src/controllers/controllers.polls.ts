import firestore from '../datastores/firestore-datastore';
import docPath from '../constants/firestoreDocPath';

/**
 * create new poll function takes poll data
 * @param poll
 *
 */
export const create = (poll: { [x: string]: any; id?: any }) =>
	new Promise(async(resolve, reject) => {
		firestore
			.doc(docPath.POLLS + '/' + poll.id)
			.set(poll)
			.then(() => {
				resolve();
			})
			.catch((error) => {
				reject(error);
			});
	});

/**
 * read poll data
 * @param id
 *
 */
export const read = async(id: string) =>
	new Promise((resolve, reject) => {
		firestore
			.doc(docPath.POLLS + '/' + id)
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
 * @param poll
 *
 */
export const update = async(poll: { [x: string]: any; id?: any }) =>
	new Promise((resolve, reject) => {
		firestore
			.doc(docPath.POLLS + '/' + poll.id)
			.update(poll)
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
			.collection(docPath.POLLS)
			.get()
			.then((snapshot) => {
				const docs = snapshot.docs.map((doc) => doc.data());
				resolve(docs);
			})
			.catch((error) => {
				reject(error);
			});
	});

export const queryByCode = async(code: string) =>
	new Promise((resolve, reject) => {
		firestore
			.collection(docPath.POLLS)
			.where('code', '==', code)
			.limit(1)
			.get()
			.then((sanpshot) => {
				if (sanpshot.empty) {
					reject(true);
				} else {
					const docs = sanpshot.docs.map((doc) => doc.data());
					resolve(docs[0]);
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
