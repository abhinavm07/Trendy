import {negativeSentiment, neutralSentiment, positiveSentiment} from "../../../controllers/sentiments.jsx";

const SentimentSearchResults = ({emotion}) => {
    function renderEmotions(emotions) {
        switch (emotion) {
            case 'Positive':
                return positiveSentiment;
            case 'Neutral':
                return neutralSentiment;
            case 'Negative':
                return negativeSentiment;
            default:
                return <></>;
        }
    }

    return (
        <div className='flex h-full w-full '>
            {renderEmotions(emotion)}
        </div>
    )
}

export default SentimentSearchResults
