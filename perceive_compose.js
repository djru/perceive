import {Observable} from './perceive'
export const merge = (...args) => {
    args = args.filter(a => a instanceof Observable)
    const new_o = new Observable()
    for (let o of args) {
        o.dip((v) => {
            new_o.emit(v)
        })
    }
}

export const race = () => {
    let lock = false
    args = args.filter(a => a instanceof Observable)
    const new_o = new Observable()
    for (let o of args) {
        m.dip((v) => {
            if (!lock) {
                new_o.emit(v)
                lock = true
            }
        })
    }
    return new_o
}


export const zip = (...args) => {
    const new_o = new Observable()
    args = args.filter(a => a instanceof Observable)
    const state = Array(args.length)
    for (let i of [...state.keys()]) {
        console.log(args[i])
        args[i].dip((v) => {
            state[i] = v
            new_o.emit(state)
        })
    }
    return new_o
}
