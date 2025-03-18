import { useEffect, useState }  from "react";
import './testAPI.css';

const TestAPI = () => {
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/mensaje")
            .then((res) => res.json())
            .then((data) => setMensaje(data.mensaje))
            .catch((error) => 
                {console.log("error al obtener datos :", error);
                setMensaje("Error al obtener datos del servidor");
                });
    }, []);
    return (
        <div>
            <h1 className="mensaje">Mensaje del Servidor:</h1>
            <p className={`pagraph ${mensaje === "Error al obtener datos del servidor" ? "error" : ""}`}>{mensaje}</p>
        </div>
    );
}

export default TestAPI;