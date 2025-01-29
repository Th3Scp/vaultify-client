export default function extractDomain(url: string, full = false): string {
  const protocolPattern = /^(https?:\/\/)?(www\.)?/i;
  const cleanedUrl = url.replace(protocolPattern, '');

  const domainWithPath = cleanedUrl.split('/')[0];

  let domain = domainWithPath.replace(/^www\./, '');

  if (full) {
      return domain;
  } else {
      const domainParts = domain.split('.');
      if (domainParts.length > 1) {
          domainParts.pop(); 
      }
      return domainParts.join('.'); 
  }
}