import { it } from '@talk-vitest-cypress/application-test-driver';

import { Precondition, Step } from '../drivers/types';

const hasItemsActive: Precondition = ({ localStorage }): void => {
  localStorage.setItem(`shopping-list`, JSON.stringify([
    { id: 1, title: `Bread`, state: `active` },
    { id: 2, title: `Butter`, state: `active` },
  ]));
};

// DSL
const shoppingList: Record<string, (...params: any) => Step> = {
  addItem: (title: string) => ({ driver }) => [
    driver.findByLabelText(`Title`).type(title),
    driver.findByRole(`button`, { name: `Add item` }).click(),
  ],
  removeItem: (title: string) => ({ driver }) => [
    driver.findByRole(`button`, { name: title }).click(),
  ],
  expectItemOnList: (item: string) => ({ driver }) => [
    driver.findByText(item).shouldBeVisible(),
  ],
  expectItemNotOnList: (item: string) => ({ driver }) => [
    driver.queryByText(item).shouldNotExist(),
  ],
  open: () => ({ driver }) => [
    driver.goTo(`/`),
  ],
};

it(`should list active items`, ({ driver }) => [
  driver.prepare(hasItemsActive),
  shoppingList.open(),
  shoppingList.expectItemOnList(`Bread`),
  shoppingList.expectItemOnList(`Butter`),
]);

it(`should be possible to add a new item`, () => [
  shoppingList.open(),
  shoppingList.addItem(`Bread`),
  shoppingList.expectItemOnList(`Bread`),
]);

it(`should be possible to remove an item`, ({ driver }) => [
  driver.prepare(hasItemsActive),
  shoppingList.open(),
  shoppingList.removeItem(`Bread`),
  shoppingList.expectItemNotOnList(`Bread`),
]);
