import {
    deleteUserSession, getBalance,
    getUserChatsBySessionId,
    getUserChatsResponse,
    getUserDetails,
    getUserSessions, modelList
} from "./messages.js";
import {
    MessageCodeChatMessage,
    MessageCodeChatsBySessionId,
    MessageCodeListSessions,
    MessageCodeUserDetails,
    MessageCodeSessionDelete, MessageCodeGetAIModels, MessageCodeGetBalance
} from "./messageTypes.js";
import {addOneSidebar, addToSidebar, setActiveSessionId} from "../store/features/sideBarSlice/sideBarSlice.js";
import {setDisable, setFileName, setInput} from "../store/features/inputBarSlice/inputBarSlice.js";
import {
    setChat, setAllModel,
    setUsername, addChat, setBalance
} from "../store/features/chatPanelSlice/chatPanelSlice.js";
import {USER_ID} from "../configs/config.js";

function convertMessages(messages) {
    const result = [];
    let request = "";
    let response = "";
    let fileName = "";

    if(messages === null) {
        return [];
    }

    console.log("MGS: ", messages)

    messages.forEach((message, index) => {
        if (message.role === "user") {
            request = message.content;
            // Find the next 'assistant' message to pair as a response
            for (let i = index + 1; i < messages.length; i++) {
                console.log(messages[i])

                if (messages[i].role === "assistant") {
                    response = messages[i].content;

                    if(i + 1 < messages.length) {
                        if (messages[i + 1].role === "file") {
                            fileName = messages[i + 1].content;
                        }
                    }
                    break;
                }
            }
            // Push the request-response pair into result
            result.push({ request, response, loading: false, fileName: fileName });
            fileName = request = response = ""
        }
    });

    console.log(result)

    return result;
}

function createWebSocketMiddleware() {
    let socket = null;
    let messageQueue = []; // Buffer for messages to send once connected
    let retryCount = 0;
    const maxRetries = 3; // Maximum retry attempts


    const sendMessagesFromQueue = () => {
        while (messageQueue.length > 0) {
            const message = messageQueue.shift();
            socket.send(JSON.stringify(message));
        }
    };

    const reconnect = (store, url) => {
        if (retryCount < maxRetries) {
            setTimeout(() => {
                console.log(`Attempting to reconnect... (${retryCount + 1})`);
                store.dispatch({ type: 'WEBSOCKET_CONNECT', payload: { url } });
                retryCount++;
            }, 1000 * Math.pow(2, retryCount)); // Exponential backoff
        } else {
            console.error('Max retries reached. Unable to connect to WebSocket.');
        }
    }

    const onOpen = (store) => () => {
        console.log('WebSocket connection established');
        setTimeout(sendMessagesFromQueue , 100); // Send all buffered messages
        retryCount = 0; // Reset retry count after a successful connection
    };

    const onError = (store, url) => (event) => {
        console.error('WebSocket error:', event);
        socket.close();
        reconnect(store, url); // Try to reconnect on error
    };

    const onClose = (store, url) => (event) => {
        console.log('WebSocket closed. Attempting to reconnect...', event);
        reconnect(store, url);
    };

    const onMessage = (store) => (event) => {
        console.log(event.data)
        const response = JSON.parse(event.data);
        if(Object.prototype.hasOwnProperty.call(response, 'error')) {
            console.log("ERROR: ", response);
            alert(response.error);
            return;
        }
        console.log(response)
        switch (response.type) {
            case MessageCodeUserDetails:
                store.dispatch(setUsername(response.data.username));
                break
            case MessageCodeListSessions:
                store.dispatch(addToSidebar({sessions: response.data.session_info !== null ? response.data.session_info : []} ))
                break
            case MessageCodeChatsBySessionId:
                store.dispatch(setActiveSessionId(response.data.session_id))
                store.dispatch(setChat(convertMessages(JSON.parse(response.data.chat))))
                store.dispatch(setDisable(false))
                break
            case MessageCodeChatMessage:
                console.log("In Middle Ware On Receiving: ", response.data.session_id)
                if(store.getState().sideBar.activeSessionId === "NEW") {
                    store.dispatch(setActiveSessionId(response.data.session_id))
                    store.dispatch(addOneSidebar({session_id: response.data.session_id, session_name: response.data.session_name}))
                    store.dispatch(setChat([]))
                }

                store.dispatch(addChat({ request: store.getState().inputBar.input, response: response.data.message, loading: false, fileName: store.getState().inputBar.fileName}))
                store.dispatch(setFileName(""))
                store.dispatch(setDisable(false))
                store.dispatch(setInput(""))

                store.dispatch({
                    type: 'WEBSOCKET_SEND',
                    payload: {
                        type: MessageCodeGetBalance,
                        userId: USER_ID,
                    }
                })

                break
            case MessageCodeGetAIModels:
                store.dispatch(setAllModel(response.data.models))
                break
            case MessageCodeGetBalance:
                store.dispatch(setBalance(response.data.balance))
                break
            case MessageCodeSessionDelete:
                break
        }
    };

    return store => next => action => {
        switch (action.type) {
            case 'WEBSOCKET_CONNECT':
                if (socket !== null) {
                    socket.close();
                }
                socket = new WebSocket(action.payload.url);
                socket.onerror = onError(store, action.payload.url);
                socket.onclose = onClose(store, action.payload.status);
                socket.onopen = onOpen(store);
                socket.onmessage = onMessage(store);
                break;
            case 'WEBSOCKET_SEND':
                var request = null;
                switch (action.payload.type) {
                    case MessageCodeUserDetails:
                        request = getUserDetails(action.payload.userId)
                        break
                    case MessageCodeListSessions:
                        request = getUserSessions(action.payload.userId)
                        break
                    case MessageCodeChatsBySessionId:
                        request = getUserChatsBySessionId(action.payload.userId, action.payload.sessionId)
                        break
                    case MessageCodeChatMessage:
                        console.log("In Middle Ware On Sending: ", action.payload.sessionId)
                        request = getUserChatsResponse(action.payload.userId, action.payload.sessionId,
                            action.payload.modelName, action.payload.message, action.payload.sessionPrompt,
                            action.payload.fileName)
                        break
                    case MessageCodeSessionDelete:
                        request = deleteUserSession(action.payload.userId, action.payload.sessionId)
                        break
                    case MessageCodeGetAIModels:
                        request = modelList(action.payload.userId)
                        break
                    case MessageCodeGetBalance:
                        request = getBalance(action.payload.userId)
                        break
                    default:
                        return
                }

                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify(request));
                } else {
                    messageQueue.push(request)
                }
                break;
            default:
                return next(action);
        }
    };
}

export default createWebSocketMiddleware;
