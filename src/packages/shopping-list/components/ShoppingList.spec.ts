import {
  expect,
  it,
  render,
  screen,
  userEvent,
} from '../../../__test__/utils';

import ShoppingList from './ShoppingList.vue';

it(`it should emit an "remove" event when we click an item`, async () => {
  let user = userEvent.setup();
  let { emitted } = render(ShoppingList, {
    props: {
      items: [{ id: 1, title: `Bread`, status: `active` }],
    },
  });

  await user.click(await screen.findByRole(`button`, { name: `Bread` }));
  expect(emitted().remove[0][0]).toBe(1);
});
