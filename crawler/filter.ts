export const isValidDocUrl = (url: string, allowedDomain: string) => {
  if (!url?.startsWith(allowedDomain)) return false;

  const denyPatterns = [
    "blog",
    "/pricing",
    "login",
    "signup",
    "changelog",
    "/about",
    "/contact",
    "/legal",
    "/privacy",
    "/terms",
    "/help",
    "/support",
    "/status/",
  ];

  return !denyPatterns.some((pattern) => url.includes(pattern));
};
