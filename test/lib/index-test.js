const index = require('../../index')

describe('index', () => {
    test('exports install', async () => {
        expect(index.install).not.toBeUndefined()
    })
    test('exports initialize', async () => {
        expect(index.initialize).not.toBeUndefined()
    })
})