import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../../Redux/modalSlice";
import { useNavigate } from "react-router-dom";
import {logout } from "../../../Redux/authSlice";
import "../../../styles/afterLogin/logOut.css"; // Importamos el CSS

const Modal = () => {
    const isOpen = useSelector((state) => state.modal.isOpen);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleConfirmLogout = () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userEmail");
        dispatch(closeModal());
        navigate("/");
        dispatch(logout());

    }
    return (
        <div className="modal-overlay modal-open">
            <div className="modal-container">
            <h2 className="close-sesion">¿Cerrar Sesión?</h2>
            <p className="question">¿Estás seguro que deseas cerrar sesión?.</p>
            <button onClick={handleConfirmLogout} className="modal confirm">
                Cerrar Sesión
            </button>
            <button onClick={() => dispatch(closeModal())} className="modal cancel">
                Cancelar
            </button>
            </div>
        </div>
        );
    };

export default Modal;
