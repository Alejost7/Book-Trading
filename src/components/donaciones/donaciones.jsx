import '../../styles/donaciones/donaciones.css';


let libro = { id: 6, title: "Crónica de una Muerte Anunciada necesito ver que pasa cuando el texto es realmente largo", author: "Gabriel García Márquez", cover: "https://silverlibros.com/wp-content/uploads/2022/02/9786070729560-CRONICA-DE-UNA-MUERTE-ANUNCIADA-BOLSILLO-550x874.jpg", descripcion: "rónica de una muerte anunciada es una novela corta de Gabriel García Márquez, publicada en 1981. Tomando elementos del realismo mágico y del relato policial, la novela cuenta la muerte de Santiago Nasar a manos de los hermanos Vicario. La obra está inspirada en un crimen real que tuvo lugar en Colombia. Desde la ficción, Gabriel García Márquez logra construir una crónica, que destaca por el uso original y creativo de recursos literarios y periodísticos"};

const donaciones = () => {
    return(
        <div className="donacionesmain">
            <div className="donacionesLibro">
                <h2 className="pageTitle">
                    Crear Donacion
                </h2>
                <hr></hr>
                <img className='bookCover' src= {libro.cover}></img>
                <h2 className="bookTitle">
                    {libro.title.toUpperCase()}
                </h2>
                <hr></hr>
                <p className="bookDescription">
                    {libro.descripcion}
                </p>
            </div>
            <div className = "botones">
                <button className="boton" id = 'b1'>Seleccionar libro</button>
                <button className="boton" id='b2'>Nuevo Libro</button>
                <button className="boton" id='b3'>DONAR</button>
            </div>
        </div>
    )
}

export default donaciones