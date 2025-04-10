import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { closeModal } from '../../../Redux/modalSlice';
import '../../../styles/beforeLogin/authModal.css';
import { FiX, FiLogIn, FiUserPlus } from 'react-icons/fi';

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

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.9,
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: [0.29, 0.98, 0.35, 1.0],
            },
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: {
                duration: 0.2,
            },
        },
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.2 }
        },
        exit: { 
            opacity: 0,
            transition: { duration: 0.2, delay: 0.1 }
        },
    };

    return (
        <AnimatePresence>
            <motion.div 
                className="auth-modal-overlay"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={handleClose}
            >
                <motion.div 
                    className="auth-modal"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="auth-modal-header">
                        <h2>Inicia Sesión</h2>
                        <motion.button 
                            className="close-modal-btn"
                            onClick={handleClose}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FiX />
                        </motion.button>
                    </div>
                    
                    <div className="auth-modal-icon">
                        <FiLogIn size={40} />
                    </div>
                    
                    <div className="auth-modal-content">
                        <p>Para realizar esta acción, primero debes iniciar sesión o registrarte en nuestra plataforma.</p>
                        
                        <div className="auth-benefits">
                            <h4>Beneficios de tener una cuenta:</h4>
                            <ul>
                                <li>Intercambia libros con otros usuarios</li>
                                <li>Guarda tus libros favoritos</li>
                                <li>Realiza donaciones a la comunidad</li>
                                <li>Recibe notificaciones sobre nuevos libros</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="auth-modal-buttons">
                        <motion.button 
                            className="cancel-button"
                            onClick={handleClose}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Cancelar
                        </motion.button>
                        <motion.button 
                            className="login-button"
                            onClick={handleLoginClick}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <FiUserPlus />
                            <span>Crear Cuenta / Iniciar Sesión</span>
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AuthModal; 