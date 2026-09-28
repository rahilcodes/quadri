import { site } from './site';

/** Shared by the form (client) and the API route (server), so both apply the same rules. */

export type ContactFields = {
  name: string;
  phone: string;
  matter: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

export const LIMITS = { name: 120, phone: 24, message: 2000 } as const;

export const matterTypes = site.practice.areas.map((area) => area.title);

export function validateContact(fields: ContactFields): ContactErrors {
  const copy = site.contact.form.errors;
  const errors: ContactErrors = {};
  const digits = fields.phone.replace(/\D/g, '');

  if (fields.name.trim().length < 2 || fields.name.length > LIMITS.name) errors.name = copy.name;
  if (!/^[+\d][\d\s()-]*$/.test(fields.phone.trim()) || digits.length < 8 || digits.length > 15)
    errors.phone = copy.phone;
  if (!matterTypes.includes(fields.matter)) errors.matter = copy.matter;
  if (fields.message.trim().length < 10 || fields.message.length > LIMITS.message)
    errors.message = copy.message;

  return errors;
}
