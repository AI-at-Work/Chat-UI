import {createSlice} from "@reduxjs/toolkit";
import {DEFAULT_MODEL, USERNAME} from "../../../configs/config.js";

const initialState = {
    username: USERNAME,
    modelName: DEFAULT_MODEL,
    allModels: [],
    chats: []
}

export const chatPanelSlice = createSlice({
    name: "chatPanel",
    initialState: initialState,
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload
        },
        addChat: (state, action) => {
            state.chats = state.chats.filter(item => item.loading !== true); // only take loading = false data
            state.chats.push({
                request: action.payload.request,
                loading: action.payload.loading,
                response: action.payload.response,
                fileName: action.payload.fileName,
            })
            console.log("CHATS: ", state.chats)
        },
        setModelName: (state, action) => {
            state.modelName = action.payload
        },
        setAllModel: (state, action) => {
            state.allModels = action.payload
        },
        setChat: (state, action) => {
            state.chats = action.payload;
        },
        removeChat: (state, action) => {
            state.chats.pop()
        }
    }
})

export const {setAllModel, setModelName, setChat , setUsername, addChat, removeChat} = chatPanelSlice.actions;
export default chatPanelSlice.reducer;