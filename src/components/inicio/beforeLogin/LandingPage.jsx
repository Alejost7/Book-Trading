import { FiLogIn } from "react-icons/fi";

function LandingPage() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 text-center">
            <h1 className="text-5xl font-extrabold text-blue-400">Bienvenido a BookSwap</h1>
            <p className="mt-4 text-lg text-gray-300 max w-2x1">
                Intercambia, descubre y disfruta de los libros con una comunidad apasionada por la lectura.
            </p>
            <div className="mt-6 flex gap-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg flex items-center gap-2 shadow-md">
                <FiLogIn /> Iniciar Sesión
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg text-lg shadow-md">
                Registrarse
                </button>
            </div>
        </div>
    );
};

export default LandingPage;