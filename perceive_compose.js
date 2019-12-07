import {Observable} from './perceive'

const filter_obs = (a) => a.filter(a => a instanceof Observable)

export const merge = (...args) => {
    args = filter_obs(args)
    const new_o = new Observable()
    for (let o of args) {
        o.dip((v) => {
            new_o.emit(v)
        })
    }
}

export const race = (...args) => {
    let lock = false
    args = filter_obs(args)
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

export const buffer = (...args) => {
    const new_o = new Observable()
    args = filter_obs(args)
    let state = Array(args.length)
    for (let i of [...state.keys()]) {
        args[i].dip((v) => {
            state[i] = v
            if(!state.find(undefined)){
                new_o.emit(state)
                state = Array(args.length)
            }
        })
    }
}


export const pairwise = (...args) => {
    const new_o = new Observable()
    args = filter_obs(args)
    const state = Array(args.length)
    for (let i of [...state.keys()]) {
        args[i].dip((v) => {
            state[i] = v
            new_o.emit(state)
        })
    }
    return new_o
}
