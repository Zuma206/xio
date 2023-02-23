import styles from "../styles/Error.module.scss";
import { useError } from "../xio";
import Button from "./Button";

export default () => {
  const [, closeError, errorData] = useError("");

  return errorData ? (
    <div className={styles.container} onClick={closeError}>
      <div className={styles.error} onClick={(e) => e.stopPropagation()}>
        <div className={styles.message}>
          <div className={styles.title}>{errorData.title}</div>
          <div>
            {errorData.name}: {errorData.code}
          </div>
        </div>
        <div>
          <Button onClick={closeError}>Close</Button>
        </div>
      </div>
    </div>
  ) : null;
};
