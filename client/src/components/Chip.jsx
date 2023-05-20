export default function Chip({content}) {
    return (<>
        {typeof content === 'object' && content.map((item) => <div className="chip">
            {item}
        </div>)}
        {typeof content !== 'object' && <div className="chip">
            {content}
        </div>}
    </>);
}