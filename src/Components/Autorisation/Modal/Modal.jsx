import SignInForm from "../../Forms/SignInForm/SignInForm";
import SignUpForm from "../../Forms/SignUpForm/SignUpForm";
import { TYPE_MODAL } from "../../Forms/typeModeHelper";
import { useStoreContext } from "../../../store/store";

import styles from './Modal.module.css'

export default function Modal() {
  const { setModalOpen, authMode } = useStoreContext()

  return (

    <div className={styles.modal}>
      <span onClick={() => setModalOpen(false)} className={styles.closeBtn}>✕</span>
      {authMode.type === TYPE_MODAL.SING_UP.type
        ? <SignUpForm />
        : <SignInForm />}
    </div>
  )
}
