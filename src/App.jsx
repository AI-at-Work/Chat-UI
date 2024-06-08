import Sidebar from "./components/SideBar/Sidebar";
import ChatPanel from "./components/ChatPanel/ChatPanel.jsx";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {USER_ID, WEBSOCKET_URL} from "./configs/config.js";
import {MessageCodeGetAIModels, MessageCodeListSessions, MessageCodeUserDetails} from "./middleware/messageTypes.js";

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Dispatch action to connect to the WebSocket
        dispatch({ type: 'WEBSOCKET_CONNECT', payload: {
                url: WEBSOCKET_URL,
            }
        });

        dispatch({ type: 'WEBSOCKET_SEND', payload: {
                type: MessageCodeUserDetails,
                userId: USER_ID,
            }
        });

        dispatch({ type: 'WEBSOCKET_SEND', payload: {
                type: MessageCodeListSessions,
                userId: USER_ID,
            }
        });

        dispatch({ type: 'WEBSOCKET_SEND', payload: {
                type: MessageCodeGetAIModels,
                userId: USER_ID,
            }
        });

    });


    return (
      <>
        <Sidebar/>
        <ChatPanel/>
      </>
  );
};

export default App;