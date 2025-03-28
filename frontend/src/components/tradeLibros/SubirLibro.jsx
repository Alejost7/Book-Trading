import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../Redux/modalSlice";
import { useState } from "react";
import '../../styles/tradeLibros/subirLibros.css';

const ModalUpload = () => {
    const { isOpen, modalType} = useSelector((state) => state.modal);
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        title: "",
        author: "",
        image: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen || modalType !== "upload") return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const userId = localStorage.getItem("userId");
        if (!userId) {
        setError("Usuario no autenticado");
        setIsLoading(false);
        return;
        }

        try {
        const response = await fetch("http://localhost:5000/addBooks", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({ ...form, owner: userId })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Error al subir el libro");
        }
        dispatch(closeModal());
        // Aquí podrías actualizar la lista de libros o redirigir
        } catch (error) {
        setError(error.message);
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
        <div className="modal-content">
            <button className="close-button" onClick={() => dispatch(closeModal())}>X</button>
            <h2>Subir Nuevo Libro</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
            <label>
                Título:
                <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                />
            </label>
            <label>
                Autor:
                <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                required
                />
            </label>
            <label>
                URL de la portada:
                <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                />
            </label>
            <button type="submit" disabled={isLoading}>
                {isLoading ? "Subiendo..." : "Subir Libro"}
            </button>
            </form>
        </div>
        </div>
    );
};

export default ModalUpload;
