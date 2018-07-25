jest.mock('progress', () => jest.fn())

const tracker = require('../../../lib/helpers/progress-tracker'),
    progress = require('progress'),
    EventEmitter = require('events'),
    faker = require('faker')

class TestEmitter extends EventEmitter {}
    
describe('progress tracker', () => {
    let expectedProgress = {
        tick: jest.fn()
    }

    beforeEach(() => {
        expectedProgress.tick.mockClear()
        progress.mockClear().mockImplementation((_, settings) => {
            expectedProgress.total = settings.total
            return expectedProgress
        })
      });

    test('should create new tracking if response event', async () => {
        let request = new TestEmitter(),
            length = faker.random.number(200),
            length2 = faker.random.number(200)
        
        tracker(request)

        request.emit('response', {
            headers:{'content-length': length.toString()}
        })

        request.emit('response', {
            headers:{'content-length': length2.toString()}
        })

        expect(progress).toBeCalledWith('downloading [:bar] :percent :etas', {
            complete: '=',
            incomplete: '-',
            width: 20,
            total: length
        })
        expect(expectedProgress.total).toEqual(length + length2) 
    })

    test('should not create new tracking if no response event', async () => {
        let request = new TestEmitter()

        tracker(request)

        expect(progress).not.toBeCalled()
    })

    test('retrieve track progress', async () => {
        let request = new TestEmitter(),
            length = faker.random.number(200)
        
        tracker(request)

        request.emit('response', {
            headers:{'content-length': length.toString()}
        })

        request.emit('data', { length : length })

        expect(expectedProgress.tick).toBeCalledWith(length)
        
    })
})
