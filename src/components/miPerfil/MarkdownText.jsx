import ReactMarkdown from "react-markdown"
import "../../styles/miPerfil/MarkdownText.css"

const MarkdownCard = ({content}) => {
    return (
        <div className="MarkdownCard">
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
};

export default MarkdownCard