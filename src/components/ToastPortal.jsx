// src/components/ToastPortal.jsx
import { createPortal } from "react-dom";

export default function ToastPortal({ children }) {
    const root = document.getElementById("toast-root");
    return root ? createPortal(children, root) : null;
}
