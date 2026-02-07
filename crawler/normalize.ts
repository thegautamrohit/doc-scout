export const normalizeUrl = (url: string) => {
  try {
    const normalizedUrl = new URL(url);
    normalizedUrl.hash = "";
    normalizedUrl.search = "";
    return normalizedUrl.toString().replace(/\/$/, "");
  } catch (error) {
    return "";
  }
};
