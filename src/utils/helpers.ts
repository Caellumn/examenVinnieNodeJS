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




