import { storage } from './firestore.datastore';
import UUID from 'uuid/v4';

const bucket = storage.bucket();

/**
 * upload a base64 image to firebase
 * @param  {string} base64String
 * @param  {string} filename
 * @param  {string='image/jpeg'} mimeType
 * @param {string='data:image/jpeg;base64,'} encoding
 */
export const upload = (
	base64String: string,
	filename: string,
	mimeType: string = 'image/jpeg',
	errorCallback?: (error: any) => void
) => {
	let data = base64String;
	// tslint:disable-next-line: no-console
	if (base64String.slice(0, 4) === 'data') {
		mimeType = base64String.slice(6, 12) === 'j' ? 'image/jpeg' : 'image/png';
		data = data.replace(`data:${mimeType};base64,`, '');
	}
	data = data.replace('data:image/jpeg;base64,', '');
	// @ts-ignore
	const imageBuffer = new Buffer.from(data, 'base64');
	const uuid = UUID(); // generate firebase download token

	// Upload the image to the bucket
	const file = bucket.file(filename);
	file.save(
		imageBuffer,
		{
			metadata: {
				contentType: mimeType,
				metadata: {
					firebaseStorageDownloadTokens: uuid
				}
			}
		},
		(error) => {
			if (error) {
				// tslint:disable-next-line: no-unused-expression
				errorCallback && errorCallback(new Error('Failed to upload image'));
			}
		}
	);
	return createPublicFileURL(filename, uuid);
};

/**
 * generate public url for file
 * @param  {string} path
 * @param  {string} uuid
 */
const createPublicFileURL = (path: string, uuid: string) => {
	return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
		path
	)}?alt=media&token=${uuid}`;
};
