class Observable {
    constructor() {
        this.pipes = []
    }

    subscribe(fn) {
        this.pipe((v) => {
            fn(v)
            return v
        })
    }

    emit(v) {
        if (v instanceof Array) {
            for (let i of v) {
                this.emit(i)
            }
        } else {
            this.pipes.reduce((_v, fn) => fn(_v), v)
        }
    }
    pipe(fn, _prepend=false) {
        if(_prepend){
            this.pipes.unshift(fn)
        }
        else{
            this.pipes.push(fn)
        }
        return this
    }

    debug() {
        this.pipe(v => {
            console.log(...arguments, v)
            return v
        })
        return this
    }

    reduce(fn, initial_state) {
        let _acc = initial_state
        let _fn = fn
        this.pipe(v => {
            _acc = _fn(_acc, v)
            return _acc
        })
        return this
    }

    timer(ms) {
        const timer = setInterval(() => {
            this.emit(Date.now())
        }, ms)
        return this
    }

    store() {
        this.reduce((a, v) => {
            a.push(v)
            return a
        }, [])
        return this
    }
    listen() {
        const new_o = new Observable()
        this.pipe(v => {
            new_o.emit(v)
            return v
        })
        return new_o
    }
    copy() {
        const new_o = new Observable()
        this.pipe(v => {
            new_o.emit(v)
            return v
        }, true)
        return new_o
    }

    kill() {
        this.pipes = []
    }
}
