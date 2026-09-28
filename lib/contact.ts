/**
 * Validation rules shared by the form (browser) and the contact function
 * (server), so both apply exactly the same checks. No imports: this file is
 * bundled into the page script, and must stay small.
 */

export type ContactFields = {
  name: string;
  phone: string;
  matter: string;
  message: string;
};

export type ContactField = keyof ContactFields;

export const LIMITS = { name: 120, phone: 24, message: 2000 } as const;

/** Returns the names of the fields that fail, in form order. */
export function invalidFields(fields: ContactFields, matterTypes: readonly string[]): ContactField[] {
  const invalid: ContactField[] = [];
  const digits = fields.phone.replace(/\D/g, '');

  if (fields.name.trim().length < 2 || fields.name.length > LIMITS.name) invalid.push('name');
  if (!/^[+\d][\d\s()-]*$/.test(fields.phone.trim()) || digits.length < 8 || digits.length > 15)
    invalid.push('phone');
  if (!matterTypes.includes(fields.matter)) invalid.push('matter');
  if (fields.message.trim().length < 10 || fields.message.length > LIMITS.message) invalid.push('message');

  return invalid;
}
