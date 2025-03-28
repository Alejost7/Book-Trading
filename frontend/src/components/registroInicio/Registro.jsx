import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../Redux/authSlice';
import '../../styles/registro/registro.css';

const Registro = () => {
    const [form, setForm] = useState({email: '', password: ''});
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e, action) => {
        e.preventDefault();
        setIsLoading(true);

        if (!form.email.includes("@") || form.password.length < 6) {
            setError("Ingrese un correo válido y una contraseña de almenos 6 caracteres.")
            setIsLoading(false);
            return;
        }

        setError("");

        try {
            const response = await fetch(`http://localhost:5000/${action}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
            

            if(!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Error en la solicitud");
        }
        const data = await response.json();
        const { userId } = data;
        if (!userId) {
            throw new Error("No se recibió un ID de usuario del servidor"); 
        }

        localStorage.setItem("userId", userId);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", form.email);
        dispatch(login());

        console.log("User ID recibido del backend:", userId);

        setTimeout(() => navigate("/afterLogin"));

    } catch (error) {
        console.error("Error al conectar con el servidor: ", error);
        setError(error.message || "No se pudo conectar con el servidor");
        
    } finally {
        setIsLoading(false);
    }

    };

    return (
    <form className="form-box">
        <h2 className="form-title">Registro / Iniciar Sesión</h2>
        {error && <p className="error-message">{error}</p>}
        <input
        type="email"
        name="email"
        placeholder="Correo Electrónico"
        value={form.email}
        onChange={handleChange}
        required
        className="form-input"
        />
        <input
        type="password"
        name="password"
        placeholder='Contraseña'
        value={form.password}
        onChange={handleChange}
        required
        className="form-input"
        />
        <div className="button-container">
            <button 
                className="login-button" 
                type="button" 
                onClick={(e) => handleSubmit(e, "login")}
                disabled={isLoading}>
                    {isLoading ? "cargando..." : "Iniciar Sesión"}
            </button>
            <button 
                className='register-button' 
                type="button" 
                onClick={(e) => handleSubmit(e, "register")}
                disabled={isLoading}>
                    {isLoading ? "Cargando..." : "Registrarse"}
            </button>
        </div>
    </form>
    );
};

export default Registro;