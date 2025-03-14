import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/registro/registro.css';
const Registro = () => {
    const [form, setForm] = useState({email: '', password: ''});
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e, action) => {
        e.preventDefault();

        if (!form.email.includes("@") || form.password.length < 6) {
            setError("Ingrese un correo válido y una contraseña de almenos 6 caracteres.")
            return;
        }

        setError("");

        if(action === "login") {
            console.log("iniciando sesión con:", form);
        } else {
            console.log("Registrando usuario con: ",form);
        }

        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", form.email);

        setTimeout(() => navigate("/afterLogin"), 500);
    };

    return (
    <form className="form-box">
        <h2 className="form-title">Registro</h2>
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
            <button className="login-button" type="button" onClick={(e) => handleSubmit(e, "login")}>iniciar Sesión</button>
            <button className='register-button' type="button" onClick={(e) => handleSubmit(e, "register")}>Registrarse</button>
        </div>
    </form>
    );
};

export default Registro;