'use client';

import { createContext, useContext, useReducer } from 'react';

const ScratchpadContext = createContext(null);
const ScratchpadDispatchContext = createContext(null)

export function ScratchpadProvider({ children }) {
    const [ scratchpads, dispatch ] = useReducer(
        scratchpadsReducer,
        initialScratchpads
    );

    return (
        <ScratchpadContext.Provider value={scratchpads}>
            <ScratchpadDispatchContext.Provider value={dispatch}>
                {children}
            </ScratchpadDispatchContext.Provider>
        </ScratchpadContext.Provider>
    );
}

export function useScratchpads() {
    return useContext(ScratchpadContext);
}

export function useScratchpadsDispatch() {
    return useContext(ScratchpadDispatchContext);
}

function scratchpadsReducer(scratchpads, action) {
    switch (action.type) {
        case 'add': {
            return {
                ...scratchpads,
                [action.name]: {
                    data: action.data,
                    width: action.width,
                    height: action.height
                }
            }
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

const initialScratchpads = {
    defaultW: 32,
    defaultH: 32
}