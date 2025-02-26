import {
    MessageCodeChatMessage,
    MessageCodeChatsBySessionId,
    MessageCodeListSessions,
    MessageCodeUserDetails,
    MessageCodeSessionDelete, MessageCodeGetAIModels, MessageCodeGetBalance
} from "./messageTypes.js";

export const getUserDetails = (userId) => ({
    type: MessageCodeUserDetails,
    data: {
        user_id: userId,
    },
});

export const getUserSessions = (userId) => ({
    type: MessageCodeListSessions,
    data: {
        user_id: userId,
    },
});

export const getUserChatsBySessionId = (userId, sessionId) => ({
    type: MessageCodeChatsBySessionId,
    data: {
        user_id: userId,
        session_id: sessionId,
    },
});

export const getUserChatsResponse = (
    userId,
    sessionId,
    modelName,
    message,
    sessionPrompt,
    fileName
) => ({
    type: MessageCodeChatMessage,
    data: {
        user_id: userId,
        session_id: sessionId,
        model_name: modelName,
        message: message,
        session_prompt: sessionPrompt,
        file_name: fileName,
    },
});

export const deleteUserSession = (userId, sessionId) => ({
    type: MessageCodeSessionDelete,
    data: {
        user_id: userId,
        session_id: sessionId,
    },
});

export const modelList = (userId) => ({
    type: MessageCodeGetAIModels,
    data: {
        user_id: userId,
    },
});

export const getBalance = (userId) => ({
    type: MessageCodeGetBalance,
    data: {
        user_id: userId,
    },
});
