module.exports = {
  overrides: [
    {
      files: [
        `./driver.ts`,
        `./setup.ts`,
      ],
      env: {
        browser: true,
        node: true,
      },
    },
  ],
};
