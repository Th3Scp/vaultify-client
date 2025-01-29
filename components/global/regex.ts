export function matchURL(url: string): boolean {
    const regex = /https?:\/\/(?:www\.)?[^\s/$.?#].[^\s]*/;
    return regex.test(url);
  }
  