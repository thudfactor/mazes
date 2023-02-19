import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";

import { App } from "./app";
import "./index.css";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
} else {
  console.error("Could not find app root.");
}
