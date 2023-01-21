import { createRoot } from "react-dom/client";
import { App } from './app';
import './index.css';

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("Could not find app root.");
}
