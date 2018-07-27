const installer = require('../../lib/installer')

describe('index', () => {
    test('exports install', async () => {
        expect(installer).not.toBeUndefined()
    })
})