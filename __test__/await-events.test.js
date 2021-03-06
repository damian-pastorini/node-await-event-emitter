/**
 * @file: await-event-emitter.test.js
 * @author: Cuttle Cong
 * @date: 2018/1/21
 * @description:
 */
function tick(func) {
  return new Promise(resolve => {
    setTimeout(() => {
      func()
      resolve()
    }, 1000)
  })
}

describe('await-event-emitter', async () => {
  const runTest = () => {
    it('on', () => {
      const emitter = new AwaitEventEmitter()
      let flag = 1
      const listener = async (a, b) => {
        flag = b
      }
      emitter.on('event', listener)
      emitter.emit('event', 2, 4)
      emitter.emit('event', 2, 6)

      expect(flag).toEqual(6)
      expect(emitter._events['event'][0].fn).toEqual(listener)
    })

    it('once', () => {
      const emitter = new AwaitEventEmitter()
      let flag = 1
      const listener = (a, b) => {
        flag = b
      }
      emitter.once('event', listener)
      emitter.emit('event', 2, 4)
      emitter.emit('event', 2, 6)

      expect(flag).toEqual(4)
      expect(emitter.listeners('event')).toEqual([])
    })

    it('prependListener', () => {
      const emitter = new AwaitEventEmitter()
      let flag = 1
      const listener = (a, b) => {
        flag = b
      }
      emitter.addListener('event', (a, b) => {
        flag = b + 1
      })
      emitter.prependListener('event', listener)
      emitter.emit('event', 2, 4)
      emitter.emit('event', 2, 6)

      expect(flag).toEqual(7)
      expect(emitter.listeners('event').length).toEqual(2)
      expect(emitter.listeners('event')[0]).toEqual(listener)
      expect(emitter.listeners('event')[1]).not.toEqual(listener)
    })

    it('sync!', () => {
      const emitter = new AwaitEventEmitter()
      let flag = 1
      const listener = async (a, b) => {
        flag = b
      }
      emitter.addListener('event', async (a, b) => {
        flag = b + 1
      })
      emitter.prependListener('event', listener)
      emitter.emitSync('event', 2, 4)
      emitter.emitSync('event', 2, 6)
      emitter.emitSync('event', 2, 9)

      expect(flag).toEqual(10)
      expect(emitter.listeners('event').length).toEqual(2)
      expect(emitter.listeners('event')[0]).toEqual(listener)
      expect(emitter.listeners('event')[1]).not.toEqual(listener)
    })

    it('removeListener', () => {
      const emitter = new AwaitEventEmitter()
      let flag = 1
      const listener = (a, b) => {
        flag = b
      }
      emitter.addListener('event', listener)
             .prependListener('event', listener)
             .prependOnceListener('event', listener)
             .removeListener('event', listener)
      expect(emitter.listeners('event').length).toEqual(0)


      const listenerA = () => {}
      emitter.addListener('event', listener)
             .prependListener('event', listenerA)
             .removeListener('event', listener)
      expect(emitter.listeners('event').length).toEqual(1)
      expect(emitter.listeners('event')[0]).toEqual(listenerA)
    })

    it('prependOnceListener', () => {
      const emitter = new AwaitEventEmitter()
      let flag = 1
      const listener = (a, b) => {
        flag = b
      }
      emitter.prependOnceListener('event', () => flag = 5)
             .prependListener('event', listener)

      emitter.emit('event', 2, 1)
      expect(flag).toEqual(5)
      expect(emitter.listeners('event').length).toEqual(1)
    })

    it('sync', () => {
      const emitter = new AwaitEventEmitter()
      let flag = 1
      emitter.on('event', (a, b) => {
        flag = b
      })
      emitter.on('event', (a, b) => {
        flag = b + 1
      })
      emitter.emit('event', 2, 4)
      expect(flag).toEqual(5)

      emitter.on('event-a', (a, b) => {
        flag = b
      })
      emitter.on('event-a', (a, b) => {
        tick(() => flag = b + 1)
      })
      emitter.emit('event-a', 2, 4)
      expect(flag).toEqual(4)
    })

    it('async', async () => {
      const emitter = new AwaitEventEmitter()
      let flag = 1
      emitter.on('event', (a, b) => {
        flag = b
      })
      emitter.on('event', (a, b) => {
        return tick(() => flag = b + 1)
      })
      await emitter.emit('event', 2, 4)
      expect(flag).toEqual(5)

      emitter.removeListener('event')
      emitter.on('event', (a, b) => {
        flag = b
      })
      emitter.on('event', async (a, b) => {
        return tick(() => flag = b + 1)
      })
      await emitter.emit('event', 2, 4)
      expect(flag).toEqual(5)

      emitter.removeListener('event')
      emitter.on('event', (a, b) => {
        flag = b
      })
      emitter.on('event', async (a, b) => {
        await tick(() => flag = b + 1)
      })
      await emitter.emit('event', 2, 4)
      expect(flag).toEqual(5)

      emitter.removeListener('event')
      emitter.on('event', (a, b) => {
        flag = b
      })
      emitter.on('event', async (a, b) => {
        tick(() => flag = b + 1)
      })
      await emitter.emit('event', 2, 4)
      expect(flag).toEqual(4)
    })

    it('once remove', async function () {
      const emitter = new AwaitEventEmitter()

      emitter.once('aa', function () {
      })
      emitter.once('aa', function () {})
      emitter.once('aa', function () {})
      await emitter.emit('aa')
    })
  }

  let AwaitEventEmitter
  describe('index', function () {
    beforeEach(() => {
      AwaitEventEmitter = require('../index')
    })
    runTest()
  })

  describe('index.es5', function () {
    beforeEach(() => {
      AwaitEventEmitter = require('../index.es5')
    })
    runTest()
  })

})


