import robotsParser from "robots-parser";

export const getRobotsParser = async (baseUrl: string) => {
  try {
    const robotsUrl = new URL("/robots.txt", baseUrl).toString();
    const res = await fetch(robotsUrl);
    const text = await res.text();
    return robotsParser(robotsUrl, text);
  } catch (error) {
    console.error("Error fetching robots.txt:", error);
    return null;
  }
};
