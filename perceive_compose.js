import {Observable} from './perceive'

const filter_obs = (a) => a.filter(a => a instanceof Observable)
// need to wrap lock in an object because booleans are pass by value in js
const generate_lock = (initial_value=false) => ({locked: initial_value, lock: function(){this.locked = true}, unlock: function(){this.locked = false}})
// template that creates lock, filters observables, manages state and passes to a callback
const compose = (callback) => {
    return (..args) => {
        args = filter_obs(args)
        let state = Array(args.length)
        let lock = generate_lock()
        let output = new Observable()
        callback({args, output, state, lock})
    }
    
}

// common logic is abstracted here. This is used when you want to subscribe to many things and do something with the value. It takes a callback and passes the value, state lock and i 
const multiplex = (callback) => (...args) => {
    args = filter_obs(args)
    let state = Array(args.length)
    let lock = generate_lock()
    let output = new Observable()
    let i = 0
    for (let o of args) {
        const _i = i
        o.subscribe((v) => {
            callback({v, output, lock, state, i: _i})
            
        }
        i += 1
    }
})

    

export const merge = multiplex(({v, output}) => {
    output.emit(v)
})

export const race = multiplex(({v, lock, output}) => {
    if(!lock.locked){
        output.emit(v)
        lock.lock()
    }
})

export const buffer = multiplex(({v, output, state, i}) => {
    state[i] = v
    if(!state.find(undefined)){
        new_o.emit(state)
        state = Array(state.length)
    }
})


export const pairwise = multiplex(({v, output, state, i}) => {
    state[i] = v
    new_o.emit(state)
})
