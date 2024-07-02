import {assets} from "../../assets/assets.js";
import {marked} from "marked";
import DOMPurify from 'isomorphic-dompurify';

const ResultCard = ({input, loading, resultData, fileName}) => {
    return (
        <div>
            <div className="result">
                <div className="result-title"></div>
                <img src={assets.user_icon} alt=""/>
                <p>{input}</p>
                <p>{fileName !== "" ? <a href={"http://localhost:8000/uploads/" + fileName}>File Uploaded</a>: null}</p>
                <div className="result-data"></div>
                <img src={assets.gemini_icon} alt=""/>
                {
                    loading ?
                        <div className="loader">
                            <hr/>
                            <hr/>
                            <hr/>
                        </div>
                        :
                        <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(marked.parse(resultData))}}></div>
                }
            </div>
        </div>
    );
};

export default ResultCard;
