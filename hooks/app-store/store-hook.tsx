"use client";

import { createContext, useContext, useReducer } from "react";
import { IRoom, ReduxAction, Reducer, IAppState } from "./reducer";

const initialState: IAppState = {
    rooms: [],
    loading: {
        messages: false,
        room: false,
    },
    selectedRoom: undefined,
};

const StateContext = createContext<IAppState>(initialState);
const ReduxDispatchContext = createContext<React.Dispatch<ReduxAction> | null>(null);


export function ReduxProvider({children}: {children: React.ReactNode}) {
    const [redux, dispatch] = useReducer(Reducer, initialState);

    return (
        <StateContext.Provider value={redux}>
            <ReduxDispatchContext.Provider value={dispatch}>
                {children}
            </ReduxDispatchContext.Provider>
        </StateContext.Provider>
    )
}

export function useAppState() {
    const state = useContext(StateContext);
    if (state === null) {
        throw new Error("useRooms must be used within a RoomProvider");
    }
    return state;
}

export function useReduxDispatch() {
    const reduxDispatch = useContext(ReduxDispatchContext);
    if (reduxDispatch === null) {
        throw new Error("useRoomDispatch must be used within a RoomDispatchProvider");
    }
    return reduxDispatch;
}