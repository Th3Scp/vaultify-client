export function matchURL(url: string): boolean {
  const regex = /https?:\/\/(?:www\.)?[^\s/$.?#].[^\s]*/;
  return regex.test(url);
}
export function matchEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}