jest.mock('../../lib/helpers/toggles', () => ({ isRefactor: jest.fn(() => false)}))
jest.mock('../../lib/installer', () => jest.fn())

const index = require('../../index'),
    toggles = require('../../lib/helpers/toggles'),
    installer = require('../../lib/installer')

describe('index', () => {

    test('if toggle IS_REFACTOR is on call installer library', async () => {
        expect(index.install).not.toBe(installer)
    })

    test('exports initialize', async () => {
        expect(index.initialize).not.toBeUndefined()
    })
})