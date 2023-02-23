import HeaderBar from "../components/HeaderBar";
import styles from "../styles/404.module.scss";
import { Link } from "react-router-dom";
import Button from "../components/Button";

export default () => {
  return (
    <HeaderBar>
      <div className={styles.notFound}>
        <h1>Route not found :/</h1>
        <Link to="/">
          <Button className={styles.button}>Take me somewhere real</Button>
        </Link>
      </div>
    </HeaderBar>
  );
};
