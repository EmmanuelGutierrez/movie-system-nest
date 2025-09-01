export const getCookie = (name: string, allCookies: string) => {
  // const value = `; ${document.cookie}`;
  const parts = allCookies.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};
