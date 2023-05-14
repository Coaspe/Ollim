import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import FirebaseContext from "./context/firebase";
import { firebase, storage, FieldValue } from "./lib/firebase";
import { store } from "./redux/store";
import { Provider } from "react-redux";
ReactDOM.render(
  <FirebaseContext.Provider value={{ firebase, FieldValue, storage }}>
    <Provider store={store}>
      <App />
    </Provider>
  </FirebaseContext.Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
