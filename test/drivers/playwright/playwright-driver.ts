import {
  expect,
  Locator,
  Page,
  test as itPlaywright,
} from '@playwright/test';

import type {
  Assertions,
  AssertionsNot,
  Driver,
  Interactions,
  ItCallback,
  Step,
} from '../types';

type LocatorResolver = () => Locator;

function makeAssertions(elementResolver: LocatorResolver): Assertions {
  return {
    shouldHaveAttribute: (attribute, value) => ({ page }) => expect(elementResolver({ page }))
      .toHaveAttribute(attribute, value || /.*/),
    shouldBeVisible: () => ({ page }) => expect(elementResolver({ page })).toBeVisible(),
    shouldMatchScreenshot: () => () => { throw new Error(`Not implemented! Use a different driver for this!`); },
  };
}

function makeAssertionsNot(elementResolver: LocatorResolver): AssertionsNot {
  return {
    shouldNotBeVisible: () => ({ page }) => expect(elementResolver({ page })).toBeHidden(),
    shouldNotExist: () => ({ page }) => expect(elementResolver({ page })).not.toBeVisible(),
  };
}

function makeInteractions(elementResolver: LocatorResolver): Interactions {
  return {
    check: () => async ({ page }) => {
      await elementResolver({ page }).check();
    },
    click: () => async ({ page }) => {
      await elementResolver({ page }).click();
    },
    focus: () => async ({ page }) => {
      await elementResolver({ page }).focus();
    },
    type: text => async ({ page }) => {
      await elementResolver({ page }).fill(`${text}`);
    },
  };
}

function makeActions(elementResolver: LocatorResolver): Assertions & Interactions {
  return {
    ...makeAssertions(elementResolver),
    ...makeInteractions(elementResolver),
  };
}

const makeDriver = (): Driver => ({
  goTo(path) {
    return async ({ page }) => {
      await page.goto(`http://localhost:5173${path}`);
    };
  },
  findByLabelText(text) {
    return makeActions(({ page }) => page.getByLabel(text));
  },
  findByRole(role, { name }) {
    return makeActions(({ page }) => page.getByRole(role, { name }));
  },
  findByText(text, { withinTestId = null } = {}) {
    return makeAssertions(({ page }) => {
      let screenLocal = withinTestId ? page.locator(`[data-qa="${withinTestId}"]`) : page;
      return screenLocal.getByText(text);
    });
  },
  findAllByText(text, { withinTestId = null } = {}) {
    return makeAssertions(({ page }) => {
      let screenLocal = withinTestId ? page.locator(`[data-qa="${withinTestId}"]`) : page;
      return screenLocal.getAllByText(text);
    });
  },
  findByTestId(testId) {
    return makeActions(({ page }) => page.locator(`[data-qa="${testId}"]`));
  },
  prepare(precondition) {
    return async ({ page }) => {
      let localStorageFake = {
        data: {},
        setItem(key, value) {
          this.data[key] = value;
        },
        getItem(key) {
          return this.data[key];
        },
      };
      precondition({ localStorage: localStorageFake });

      await page.addInitScript((state) => {
        // eslint-disable-next-line no-restricted-syntax
        for (let [key, value] of Object.entries(state)) {
          window.localStorage.setItem(key, value);
        }
      }, localStorageFake.data);
    };
  },
  queryByText(text, { withinTestId = null } = {}) {
    return makeAssertionsNot(({ page }) => {
      let screenLocal = withinTestId ? page.locator(`[data-qa="${withinTestId}"]`) : page;
      return screenLocal.getByText(text);
    });
  },
});


async function runSteps({ driver, page, steps }: { driver: Driver, page: Page, steps: Step[] }) {
// eslint-disable-next-line no-restricted-syntax
  for (let step of steps) {
  // eslint-disable-next-line no-await-in-loop
    let nestedCallback = await step({ driver, page });
    // Step definitions return another callback.
    if (typeof nestedCallback === `function`) nestedCallback({ page });
    // eslint-disable-next-line no-await-in-loop
    if (Array.isArray(nestedCallback)) await runSteps({ driver, page, steps: nestedCallback });
  }
}

function wrapItCallback(description: string, func: ItCallback, itVariant: typeof itPlaywright) {
  let driver = makeDriver();
  let steps = func({ driver });
  itVariant(description, async ({ page }) => {
    await runSteps({ driver, page, steps });
  });
}

const it = (description: string, func: ItCallback) => wrapItCallback(description, func, itPlaywright);
it.only = (description: string, func: ItCallback) => wrapItCallback(description, func, itPlaywright.only);

export {
  it,
};
