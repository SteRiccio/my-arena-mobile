import { ItemsProvider } from "./ItemsProvider";

export class StaticItemsProvider extends ItemsProvider {
  constructor({ items }) {
    super();
    this.items = items;
  }

  async fetchItems({ offset = 0, limit = 50 } = {}) {
    return {
      count: this.items.length,
      items: this.items.slice(offset, offset + limit),
    };
  }
}
