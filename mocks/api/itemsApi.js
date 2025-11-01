import { items } from "../db/items";
import { delay, lsKeys } from "../utils";
import { v4 as uuidv4 } from "uuid";

export const itemsApi = {
  async getAll() {
    await delay();
    return [...items];
  },

  async createItem(data) {
    await delay(500);

    const newItem = {
      id: uuidv4(),
      name: data.name,
      isAvailable: data.isAvailable,
      owner: data.userId,
    };

    items.push(newItem);

    localStorage.setItem(lsKeys.items, JSON.stringify(items));

    return { ok: true, newItem };
  },

  async updateItem(itemId, data) {
    await delay();
    let updatedItem;
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === itemId) {
        updatedItem = {
          ...items[i],
          name: data.name,
          isAvailable: data.isAvailable,
        };
        items[i] = updatedItem;
      }
    }

    localStorage.setItem(lsKeys.items, JSON.stringify(items));

    return { ok: true, updatedItem };
  },

  async deleteItem(itemId) {
    await delay(1000);
    let idx;
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === itemId) idx = i;
    }
    items.splice(idx, 1);

    localStorage.setItem(lsKeys.items, JSON.stringify(items));

    return { ok: true };
  },
};
