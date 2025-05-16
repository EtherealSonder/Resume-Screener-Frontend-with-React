import { createPortal } from "react-dom";

export default function ModalPortal({ children }) {
    const modalRoot = document.getElementById("modal-root");
    return modalRoot ? createPortal(children, modalRoot) : null;
}
