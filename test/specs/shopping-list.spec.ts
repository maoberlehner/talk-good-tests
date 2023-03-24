import { it } from '../drivers/virtual/driver';
import { Driver, Precondition } from '../drivers/types';

const hasItemsActive: Precondition = ({ localStorage }): void => {
  localStorage.setItem(`shopping-list`, JSON.stringify([
    { id: 1, title: `Bread`, state: `active` },
    { id: 2, title: `Butter`, state: `active` },
  ]));
};

// DSL
const makeShoppingList = ({ driver }: { driver: Driver }) => ({
  addItem: async (title: string) => {
    await driver.findByLabelText(`Title`).type(title);
    await driver.findByRole(`button`, { name: `Add item` }).click();
  },
  removeItem: async (title: string) => {
    await driver.findByRole(`button`, { name: title }).click();
  },
  expectItemOnList: async (item: string) => {
    await driver.findByText(item).shouldBeVisible();
  },
  expectItemNotOnList: async (item: string) => {
    await driver.queryByText(item).shouldNotExist();
  },
  open: async () => {
    await driver.goTo(`/`);
  },
});

it(`should list active items`, async ({ driver }) => {
  driver.prepare(hasItemsActive);
  let shoppingList = makeShoppingList({ driver });
  await shoppingList.open();
  await shoppingList.expectItemOnList(`Bread`);
  await shoppingList.expectItemOnList(`Butter`);
});

it(`should be possible to add a new item`, async ({ driver }) => {
  let shoppingList = makeShoppingList({ driver });
  await shoppingList.open();
  await shoppingList.addItem(`Bread`);
  await shoppingList.expectItemOnList(`Bread`);
});
