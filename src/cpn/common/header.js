export default (props) => {
    const { title, desc } = props;

    return(
        <div className="border-bottom pb-2" style={{ background: "#FAFAFA" }}>
            <h1 className="block h1">{ title }</h1>
            <span className="mt-1">{ desc }</span>
        </div>
    )
}