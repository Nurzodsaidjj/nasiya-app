
export const saveState = (key: string, value: any) => {
  try {
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (err) {
    console.error("localStorage saqlashda xato:", err);
  }
};

export const loadState = (key: string) => {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) return undefined;

    try {
      return JSON.parse(serialized);
    } catch {
      return serialized;
    }
  } catch (err) {
    console.error("localStorage o‘qishda xato:", err);
    return undefined;
  }
};

export const removeState = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error("localStorage o‘chirishda xato:", err);
  }
};
