import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    input: "",
    attachment: {},
    fileName: "",
    isDisable: false
}

export const inputBarSlice = createSlice({
    name: "inputBar",
    initialState: initialState,
    reducers: {
        setInput: (state, action) => {
            state.input = action.payload
        },
        setAttachment: (state, action) => {
            state.attachment = action.payload.files
        },
        setFileName: (state, action) => {
            state.fileName = action.payload
        },
        setDisable: (state, action) => {
            state.isDisable = action.payload
        }
    }
})

export const {setFileName, setAttachment, setInput, setDisable} = inputBarSlice.actions;
export default inputBarSlice.reducer;