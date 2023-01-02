module.exports = {
  overrides: [
    {
      files: [
        `./playwright-driver.ts`,
      ],
      env: {
        browser: true,
        node: true,
      },
    },
  ],
};
