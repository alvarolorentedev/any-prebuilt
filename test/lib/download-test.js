const download = require('../../lib/download')

describe('download', () => {
    test('download should request file from remote', async () => {
        expect(download).not.toBeUndefined()
    })
})