import './InputBar.css'
import {assets} from "../../assets/assets.js";
import {useDispatch, useSelector} from "react-redux";
import {setAttachment, setDisable, setFileName, setInput} from "../../store/features/inputBarSlice/inputBarSlice.js";
import {useCallback, useEffect, useState} from "react";
import {addChat, removeChat, setModelName} from "../../store/features/chatPanelSlice/chatPanelSlice.js";
import {MessageCodeChatMessage} from "../../middleware/messageTypes.js";
import {SESSION_PROMPT, USER_ID} from "../../configs/config.js";
import Dropzone from "react-dropzone";
import axios from 'axios';
import {setActiveSessionId} from "../../store/features/sideBarSlice/sideBarSlice.js";

async function uploadFile(userId, sessionId, attachment, modelName, sessionPrompt, dispatch) {
    let fileName = "";
    let sessionIdNew = "";
    let error = null
    try {
        const formData = new FormData();
        formData.append("file", attachment);
        formData.set("user_id", userId);
        formData.set("session_id", sessionId);
        formData.set("model_name", modelName);
        formData.set("session_prompt", sessionPrompt);
        const response = await axios.post("http://localhost:8000/upload", formData);
        console.log("response", response);
        if (response.data.data) {
            console.log(response.data);
            fileName = response.data.data.fileName;
            sessionIdNew = response.data.data.sessionId;
        }
    } catch (err) {
        error = err
        console.log(error);
    } finally {
        dispatch(setAttachment({ files: {} }));
    }
    console.log("File Uploading Done Session Id", sessionIdNew)
    return [fileName, sessionIdNew, error];
}


const InputBar = () => {
    const input = useSelector(state => state.inputBar.input);
    const isDisable = useSelector(state => state.inputBar.isDisable);
    const activeSessionId = useSelector(state => state.sideBar.activeSessionId);
    const attachment = useSelector(state => state.inputBar.attachment);
    const modelName = useSelector(state => state.chatPanel.modelName);
    const dispatcher = useDispatch();

    const [textInput, setTextInput] = useState("");
    const [buttonControl, setButtonControl] = useState(false);
    const [preview, setPreview] = useState("");


    useEffect(() => {
        setTextInput(input)
        setButtonControl(isDisable)
    }, [input, isDisable]);

    const updateInput = async () => {
        console.log("I am getting clicked ..!!")

        if(activeSessionId == null) return;

        if(textInput.length === 0 || buttonControl) {
            return
        }

        console.log("ACTIVE ID: ",activeSessionId);

        setButtonControl(true);
        dispatcher(setInput(textInput));
        dispatcher(setDisable(true));
        dispatcher(addChat({request: textInput, loading: true, response: "", fileName: ""}));

        let fileName = ""
        let localSessionId = activeSessionId
        if(preview !== "") {
            let [receivedFileName, newSessionId, error]  =
                await uploadFile(USER_ID, activeSessionId, attachment, modelName, SESSION_PROMPT, dispatcher)

            if(error !== null) {
                alert("Unable to upload file .!!!")
                setButtonControl(false);
                dispatcher(setInput(""));
                dispatcher(setDisable(false));
                dispatcher(removeChat());
                return
            }

            console.log("Active SessionId: ", activeSessionId)
            if(activeSessionId === "NEW") {
                dispatcher(removeChat());
            }

            fileName = receivedFileName
            localSessionId = newSessionId

            dispatcher(setActiveSessionId(newSessionId))
            dispatcher(setFileName(fileName))
            console.log("Local Active SessionId: ", localSessionId)
            console.log("Generated Active SessionId: ", newSessionId)
            console.log("New Active SessionId: ", activeSessionId)

            URL.revokeObjectURL(preview)
            setPreview("")
        }

        console.log("INOUT")
        console.log("Local Active SessionId: ", localSessionId)
        console.log("New Active SessionId: ", activeSessionId)

        dispatcher({
            type: 'WEBSOCKET_SEND',
            payload: {
                type: MessageCodeChatMessage,
                userId: USER_ID,
                sessionId: localSessionId,
                modelName: modelName,
                message: textInput,
                fileName: fileName,
                sessionPrompt: SESSION_PROMPT,
            }
        });
    }

    return (
        <div>
            <div className="search-box">
                {preview && (
                    <div className="message-form-preview">
                        <img
                            alt="message-form-preview"
                            className="message-form-preview-image"
                            src={preview}
                            onLoad={() => URL.revokeObjectURL(preview)}
                        />
                        <img
                            src={assets.cross_icon}
                            className="message-form-icon-x"
                            onClick={() => {
                                setPreview("");
                                dispatcher(setAttachment({files: {}}));
                            }}
                        />

                    </div>
                )}

                <input id="inputBarInput" type="text" value={textInput}
                       onChange={(e) => setTextInput(e.target.value)}
                       placeholder="Enter a prompt here ..!!"
                       disabled={buttonControl}/>

                <div>
                    <Dropzone
                        className="dropzone-button"
                        maxFiles={1}
                        acceptedFiles=".jpg,.jpeg,.png,.pdf,.txt"
                        multiple={false}
                        noClick={true}
                        onDrop={(acceptedFiles) => {
                            dispatcher(setAttachment({files: acceptedFiles[0]}));
                            setPreview(URL.createObjectURL(acceptedFiles[0]));
                        }}
                    >
                        {({ getRootProps, getInputProps, open }) => (
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <img
                                    src={assets.gallery_icon}
                                    onClick={open}
                                />
                            </div>
                        )}
                    </Dropzone>

                    <img src={assets.mic_icon} alt=""/>

                    <button onClick={updateInput} disabled={buttonControl} className="send-button">
                        <img src={assets.send_icon} alt="Send"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InputBar;
