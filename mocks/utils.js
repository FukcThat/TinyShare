export const delay = (ms = Math.random() * 400 + 200) =>
  new Promise((res) => setTimeout(res, ms));
