import { Objects } from "@openforis/arena-core";
import { StaticItemsProvider } from "./StaticItemsProvider";

export class FilteredStaticItemsProvider extends StaticItemsProvider {
  constructor({ items, itemLabelExtractor = (item) => item?.label }) {
    super({ items });
    this.itemLabelExtractor = itemLabelExtractor;
  }

  async fetchItems({
    offset = 0,
    limit = 50,
    search = null,
    excludedItems = null,
  } = {}) {
    const searchPrepared = Objects.isEmpty(search)
      ? null
      : search.toLocaleLowerCase();

    const filteredItems =
      Objects.isEmpty(searchPrepared) && Objects.isEmpty(excludedItems)
        ? this.items
        : this.items.filter(
            (item) =>
              !excludedItems?.includes(item) &&
              this.itemLabelExtractor(item)
                .toLocaleLowerCase()
                .includes(searchPrepared)
          );
    return {
      count: filteredItems.length,
      items: filteredItems.slice(offset, offset + limit),
    };
  }
}
