// Vercel serverless function: POST /api/contact
import { handleContact } from '../lib/contact-handler';

export const POST = (request: Request) => handleContact(request);
