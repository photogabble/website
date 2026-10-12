/**
 * Convert a value into an instance of Date, or undefined on failure.
 */
export const toDate = (value) => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
};
