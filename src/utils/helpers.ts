// a function to change miliseconds to seconds in a string
export const msToSeconds = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  return seconds;
 
};  

// a function to change seconds in a string to miliseconds in other words reverse msToSeconds
export const secondsToMs = (seconds: number) => {
  const ms =seconds * 1000;
  return ms;
};

// a function to replace double quotes inside a string with single quotes
export const replaceQuotes = (str: string) => {
  return str.replace(/"/g, "'");
};

// a function to check the current time
export const checkTime = () => {
  const now = new Date();
  return now;
};

// a function to check if the snippet is expired
export const isExpired = (expiresIn: number) => {
  const now = checkTime();
  const expiresAt = new Date(now.getTime() + expiresIn * 1000);
  return expiresAt < now;
};

// a function to check transform the updatedAt into miliseconds
export const updatedAtToMs = (updatedAt: Date) => {
  const ms = updatedAt.getTime();
  return ms;
};

// a function to transform ISO date string to milliseconds
export const isoStringToMs = (dateString: string) => {
  const date = new Date(dateString);
  return date.getTime();
};
