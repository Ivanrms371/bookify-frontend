export const getFirstName = (fullName?: string) => {
  return fullName?.split(' ')[0] ?? '';
};

export const getInitials = (fullName?: string) => {
  return fullName
    ?.split(' ')
    .map((s: string) => s[0])
    .join('')
    .slice(0, 2);
};

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};
