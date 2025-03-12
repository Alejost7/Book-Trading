import {useState} from 'react';

const Registro = () => {
    const [form, setForm] = useState({email: '', password: ''});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos Enviados: ', form);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Registro</h2>
            <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={form.email}
            onChange={handleChange}
            required
            />
            <input
            type="password"
            name="password"
            placeholder='Contraseña'
            value={form.password}
            onChange={handleChange}
            required
            />
            <button type="submit">Registrar</button>
        </form>
    );
};

export default Registro;