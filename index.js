class Observable {
    constructor() {
        this.pipes = []
    }

    dip(fn) {
        this.pipe((v) => {
            fn(v)
            return v
        })
    }

    async emit(v) {
        if (v instanceof Array) {
            for (let i of v) {
                this.emit(i)
            }
        } else {
            this.pipes.reduce((_v, fn) => fn(_v), v)
        }
    }
    pipe(fn) {
        this.pipes.push(fn)
        return this
    }

    debug() {
        this.pipe(v => {
            console.log(v)
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

    kill() {
        this.pipes = []
    }
}

export default Observable

// let t = new Observable()
// t.timer(1000)
// t.listen().store().pipe(v => `val: ${v}`).debug()
// t.listen().pipe(v => v / v).debug()


const m_height = window.innerHeight
const m_width = window.innerWidth

const m_rad = Math.ceil((m_height ** 2 + m_width ** 2) ** .5)
const rad = Math.min(m_height, m_width)


const div = document.querySelector('#main')
div.style.width = `${rad}px`
div.style.height = `${rad}px`
const m_scale = m_rad / rad
const start = Date.now()
setInterval(() => {
    percent_elapsed = Math.abs(((Date.now() - start) % 2000) - 1000) / 1000
    div.style.transform = `scale(${m_scale * percent_elapsed})`

}, 10)