import "./Siderbar.css";
import {assets} from "../../assets/assets";
import {useDispatch, useSelector} from "react-redux";
import {setActiveSessionId, setExtended, setPopupOpen} from "../../store/features/sideBarSlice/sideBarSlice.js";
import {MessageCodeChatsBySessionId} from "../../middleware/messageTypes.js";
import {USER_ID} from "../../configs/config.js";
import {setModelName} from "../../store/features/chatPanelSlice/chatPanelSlice.js";

function Sidebar() {
    const allModels = useSelector(state => state.chatPanel.allModels);
    const selectedModel = useSelector(state => state.chatPanel.modelName);
    const extended = useSelector(state => state.sideBar.extended);
    const sessions = useSelector(state => state.sideBar.sessions);
    const isPopupOpen = useSelector(state => state.sideBar.isPopupOpen);
    const dispatch = useDispatch();


    const closeModal = () => dispatch(setPopupOpen(false));

    const handleChange = (event) => {
        dispatch(setModelName(event.target.value));
    };

    const openPopup = () => {
        dispatch(setPopupOpen(true))
    };

    const loadPrompt = (item) => {
        dispatch({ type: 'WEBSOCKET_SEND', payload: {
                type: MessageCodeChatsBySessionId,
                userId: USER_ID,
                sessionId: item,
            }
        });

    }

    const newChat = () => {
        dispatch(setActiveSessionId("NEW"));
    }

    const extend = () => {
        dispatch(setExtended())
    }

    return (
        <div>
            <div className="sidebar">
                <div className="top">
                    <img
                        onClick={extend}
                        className="menu"
                        src={assets.menu_icon}
                        alt=""
                    />
                    <div className="new-chat" onClick={newChat}>
                        <img src={assets.plus_icon} alt=""/>
                        {extended ? <p>New Chat</p> : null}
                    </div>
                    {extended ? (
                        <div className="recent">
                            <p className="recent-title">History</p>
                            {sessions ?
                                sessions?.map((item, index) => {
                                    console.log(item)
                                return (
                                    <div className="recent-entry" key={index} onClick={() => loadPrompt(item?.session_id)}>
                                        <img src={assets.message_icon} alt=""/>
                                        <p>{item?.session_name?.slice(0, 18)} ...</p>
                                    </div>

                                );
                            })
                            : null}
                        </div>
                    ) : null}
                </div>
                <div className="bottom">
                    <div className="bottom-item recent-entry">
                        <img src={assets.question_icon} alt=""/>
                        {extended ? <p>Help</p> : null}
                    </div>
                    <div className="bottom-item recent-entry">
                        <img src={assets.history_icon} alt=""/>
                        {extended ? <p>Activity</p> : null}
                    </div>
                    <div className="bottom-item recent-entry" onClick={openPopup}>
                        <img src={assets.setting_icon} alt=""/>
                        {extended ? <p>Settings</p> : null}
                    </div>
                </div>
            </div>
            {
                isPopupOpen &&
                <div>
                    {
                        <div style={{
                            position: 'fixed',
                            top: '20%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: 'white',
                            padding: '20px',
                            zIndex: 1000
                        }}>
                            <h2>Select AI Model</h2>
                            <select value={selectedModel} onChange={handleChange}>
                                {allModels.map((model, index) => (
                                    <option key={index} value={model}>{model}</option>
                                ))}
                            </select>
                            <button onClick={closeModal}>Close</button>
                        </div>
                    }
                    {isPopupOpen && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        }} onClick={closeModal}>

                        </div>
                    )}
                </div>

            }
        </div>
    );

}

export default Sidebar;
