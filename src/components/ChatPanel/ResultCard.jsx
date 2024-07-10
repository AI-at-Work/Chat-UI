import {assets} from "../../assets/assets.js";
import {marked} from "marked";
import DOMPurify from 'isomorphic-dompurify';

const ResultCard = ({input, loading, resultData, fileName}) => {
    return (
        <div className="result-card">
            <div className="user-input">
                <img src={assets.user_icon} alt="User" className="user-icon"/>
                <div className="input-content">
                    <p>{input}</p>
                    {fileName !== "" && <p><a href={`http://localhost:8000/uploads/${fileName}`}>File Uploaded</a></p>}
                </div>
            </div>
            <div className="ai-response">
                {loading ? (
                    <div className="loader">
                        <hr/><hr/><hr/>
                    </div>
                ) : (
                    <div
                        className="response-content"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(marked.parse(resultData))
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ResultCard;