import styles from "../styles/MessageContent.module.scss";

export default ({ content }: { content: string }) => {
    return (
        <div>
            {content.split(" ").map((part, key) => {
                let returnPart;
                if (
                    !part.startsWith("https://") &&
                    !part.startsWith("http://")
                ) {
                    returnPart = part;
                } else {
                    returnPart = (
                        <a href={part} target="_blank" className={styles.link}>
                            {part}
                        </a>
                    );
                }
                return <span key={key}>{returnPart} </span>;
            })}
        </div>
    );
};
