export default class Stream {
    constructor(source = null) {
        this.subscribers = []
        this.source = parent
    }
    subscribe(callback) {
        let active = true
        this.subscribers.push(v => {
            if (active) {
                // want the subscriber propogation to be async, so use requestIdleCallback
                requestIdleCallback(() => {
                    callback(v)
                })
            }
        })
        return () => {
            active = false
        }
    }

    getRoot() {
        return this.source ? this.source.getRoot() : this
    }

    emit(v) {
        if (v instanceof Array) {
            v.map(_v => this.emit(_v))
        } else {
            for (let s of this.subscribers) {
                s(v)
            }
        }

    }

    clear() {
        this.subscribers = []
    }

    pipe(...pipes) {
        const o = new Stream(this)
        this.subscribe(v => {
            const piped_value = pipes.reduce((a, f) => f(a), v)
            o.emit(piped_value)
        })
        return o
    }

    debounce(t) {
        let ts = Date.now()
        const o = new Stream(this)
        this.subscribe(v => {
            if (Date.now() > ts + t) {
                ts = Date.now()
                o.emit(v)
            }
        })
        return o
    }

    reduce(callback, init_val) {
        let stored_val = init_val
        const o = new Stream(this)
        this.subscribe(v => {
            stored_val = callback(stored_val, v)
            o.emit(stored_val)
        })
        return o
    }

    debug() {
        const o = new Stream(this)
        this.subscribe(v => {
            console.log(v)
            o.emit(v)
        })
        return o
    }

    collect() {
        const o = new Stream(this)
        const state = []
        this.subscribe(v => {
            state.push(v)
            o.emit(state)
        })
        return o
    }
}


export const merge = (...Streams) => {
    const o = new Stream()
    for (let _o of Streams) {
        _o.subscribe(v => {
            o.emit(v)
        })
    }
    return o
}
export const race = (...Streams) => {
    const o = new Stream()
    let lock = false
    for (let _o of Streams) {
        _o.subscribe(v => {
            if (!lock) {
                lock = true
                o.emit(v)
            }
        })
    }
    return o
}

export const combinedLatest = (...Streams) => {
    let state = Array(Streams.length).fill(null)
    const o = new Stream()
    const i = 0
    for (let _o of Streams) {
        let _i = i
        _o.subscribe(v => {
            state[_i] = v
            if (state.every(v => v !== null)) {
                o.emit(state)
                state = Array(Streams.length).fill(null)
            }
        })
    }
    return o
}

export const timer = (ms) => {
    const o = new Stream()
    setInterval(() => {
        o.emit(Date.now())
    }, ms)
    return o
}
