const toggle = require('../../../lib/helpers/toggles')

describe('toggle active for test', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      process.env = { ...OLD_ENV };
      delete process.env.IS_REFACTOR;
    });
  
    afterEach(() => {
      process.env = OLD_ENV;
    });

    test('If environment variables IS_REFACTOR is true then return true', async () => {
        process.env.IS_REFACTOR = "true"
        expect(toggle.isRefactor()).toEqual(true)
    })

    test('If environment variables IS_REFACTOR is not true then return false', async () => {
        expect(toggle.isRefactor()).toEqual(false)
    })
})