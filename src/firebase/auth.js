import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { APP_AUTH } from ".";

export const onRegistartionApi = async (email, password) => {
  try {
    const data = await createUserWithEmailAndPassword(
      APP_AUTH,
      email,
      password
    );
    return {ok : true, data : data.user}
  } catch (error) {
    console.log(error)
    return { ok: false, message: error.message, code: error.code }
  }
}


// signInWithEmailAndPassword
export const onLoginApi = async (email, password) => {
  try {
    const data = await signInWithEmailAndPassword(
      APP_AUTH,
      email,
      password
    )
    return { ok: true, data: data.user }
  } catch (error) {
    console.log(error)
    return { ok: false, message: error.message, code: error.code }
  }
}

const autorisationAPI = () => onAuthStateChanged(APP_AUTH, (user) => {
  if (user) {
    console.log("User is authorized:", user.email);
  } else {
    console.log("No authorized user");
  }
});