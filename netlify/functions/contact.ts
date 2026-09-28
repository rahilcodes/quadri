// Netlify function, served at /api/contact
import { handleContact } from '../../lib/contact-handler';

export default (request: Request) => handleContact(request);

export const config = { path: '/api/contact', method: 'POST' };
