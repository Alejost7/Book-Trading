import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../../../Redux/modalSlice';
import '../../../styles/beforeLogin/authModal.css';

const AuthModal = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isOpen, modalType } = useSelector((state) => state.modal);

    if (!isOpen || modalType !== "auth") return null;

    const handleLoginClick = () => {
        navigate('/registro');
        dispatch(closeModal());
    };

    const handleClose = () => {
        dispatch(closeModal());
    };

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal">
                <h2>Iniciar Sesión Requerido</h2>
                <p>Para realizar esta acción, primero debes iniciar sesión o registrarte.</p>
                <div className="auth-modal-buttons">
                    <button className="cancel-button" onClick={handleClose}>
                        Cancelar
                    </button>
                    <button className="login-button" onClick={handleLoginClick}>
                        Ir a Iniciar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal; 