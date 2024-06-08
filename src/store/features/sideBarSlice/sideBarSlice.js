import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    activeSessionId: null,
    isPopupOpen: false,
    extended: false,
    sessions: [],
}

export const sideBarSlice = createSlice({
    name: "sideBar",
    initialState: initialState,
    reducers: {
        setActiveSessionId: (state, action) => {
            state.activeSessionId = action.payload;
        },
        setExtended: (state) => {
            state.extended = !state.extended
        },
        addToSidebar: (state, action) => {
            state.sessions = action.payload.sessions
        },
        setPopupOpen: (state, action) => {
          state.isPopupOpen = action.payload
        },
        addOneSidebar: (state, action) => {
            state.sessions?.unshift(
                action.payload
            )
        },
    }
})

export const {setPopupOpen, addOneSidebar, setActiveSessionId, setExtended, addToSidebar} = sideBarSlice.actions;
export default sideBarSlice.reducer;