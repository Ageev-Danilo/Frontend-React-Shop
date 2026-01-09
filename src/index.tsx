import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);
root.render(<div><h1>Hello world :D </h1></div>)