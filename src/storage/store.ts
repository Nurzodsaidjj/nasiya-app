// store.ts

// localStorage ga qiymat saqlash
export const saveState = (key: string, value: any) => {
  try {
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (err) {
    console.error("localStorage saqlashda xato:", err);
  }
};

// localStorage dan qiymat olish
export const loadState = (key: string) => {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) return undefined;

    // JSON bo‘lsa parse qilamiz, oddiy string bo‘lsa shunchaki qaytaramiz
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

// localStorage dan qiymatni o‘chirish
export const removeState = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error("localStorage o‘chirishda xato:", err);
  }
};
