import { InputHTMLAttributes } from "react";
import styles from "../styles/TextBox.module.scss";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function TextBox(props: Props) {
  return <input type="text" className={styles.text} {...props} />;
}
