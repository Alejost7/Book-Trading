import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../../Redux/modalSlice";
import "../../../styles/afterLogin/logOut.css"; // Importamos el CSS

const Modal = () => {
    const isOpen = useSelector((state) => state.modal.isOpen);
    const dispatch = useDispatch();

    if (!isOpen) return null;

    return (
    <div className="modal-overlay modal-open">
        <div className="modal-container">
        <h2 className="text-xl font-bold text-center">¡Hola, soy un modal!</h2>
        <p className="text-gray-600 text-center mt-2">Este es un modal con fondo borroso.</p>

        <button onClick={() => dispatch(closeModal())} className="modal-close">
            Cerrar Modal
        </button>
        </div>
    </div>
    );
    };

export default Modal;
