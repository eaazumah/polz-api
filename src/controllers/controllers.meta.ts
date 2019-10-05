import firestore from "../datastores/firestore-datastore";
import docPath from "../constants/firestoreDocPath";

/**
 * read polls counts
 * @param
 *
 */
export const readPollCount = async () =>
    new Promise((resolve, reject) => {
        firestore
            .doc(docPath.META + "/pollscount")
            .get()
            .then(doc => {
                resolve(doc.data().total);
            })
            .catch(error => {
                reject(error);
            });
    });

/**
 * update costumer data
 * @param poll
 *
 */
export const updatePollCount = async (total: any) =>
    new Promise((resolve, reject) => {
        firestore
            .doc(docPath.POLLS + "/pollscount")
            .update({ total })
            .then(doc => {
                resolve(doc);
            })
            .catch(error => {
                reject(error);
            });
    });
