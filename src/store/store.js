import {configureStore} from "@reduxjs/toolkit";
import chatPanelReducer from "./features/chatPanelSlice/chatPanelSlice.js";
import inputBarReducer from "./features/inputBarSlice/inputBarSlice.js";
import sideBarReducer from "./features/sideBarSlice/sideBarSlice.js";
import createWebSocketMiddleware from "../middleware/middleware.js";

export const store = configureStore({
    reducer: {
        chatPanel: chatPanelReducer,
        inputBar: inputBarReducer,
        sideBar: sideBarReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(createWebSocketMiddleware()),
})