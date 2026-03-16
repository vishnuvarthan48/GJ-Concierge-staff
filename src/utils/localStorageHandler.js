export const getStorageItem = (key) => {
  const item = localStorage.getItem(key);
  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch {
    return item;
  }
};

export const setStorageItem = (key, value) => {
  if (value === undefined || value === null) {
    localStorage.removeItem(key);
    return;
  }

  if (typeof value === "string") {
    localStorage.setItem(key, value);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeStorageItem = (key) => {
  localStorage.removeItem(key);
};
