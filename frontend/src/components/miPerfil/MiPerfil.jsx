import "../../styles/miPerfil/MiPerfil.css"
import ProfileCard from "./ProfileCard"
import spideypfp from "../../assets/images/spideypfp.jpg"
import Footer from "../inicio/beforeLogin/Footer"
import Navbar from "../inicio/beforeLogin/NavBar"
import MarkdownText from "./MarkdownText"
import BookList from "./BookList"

const misLibros = [
    {image: "https://m.media-amazon.com/images/I/81t2CVWEsUL.jpg", name: "Harry Potter"},
    {image: "https://m.media-amazon.com/images/I/71kxa1-0mfL.jpg", name: "1984"},
    {image: "https://www.polifemo.com/static/img/portadas/_visd_0000JPG030DW.jpg", name: "Cien anhos de soledad"},
    {image: "https://www.laguiadelvaron.com/wp-content/uploads/2020/11/it-1-1127x2048.jpg", name: "IT"},
    {image: "https://www.radioacktiva.com/wp-content/uploads/2020/05/El-Principito.-640x983.jpg", name: "El Principito"},
    {image: "https://www.okchicas.com/wp-content/uploads/2018/04/libros-que-nos-hicieron-lectoras-1.jpg", name: "Diario de Ana Frank"},
    

]

const MiPerfil = () => {
    return(
        <div>
            <Navbar />
                <div className="container">
                    <ProfileCard imgSrc={spideypfp} imgAlt={"Imagen de perfil"} username={"jorluos"} role={"Usuario"} name={"Jorge Osorio"}/>
                    <MarkdownText content={`
# 👋 ¡Hola, soy Jorge Luis!
Soy estudiante de **Ingeniería de Sistemas y Computación** en la *Universidad Javeriana* en Cali, Colombia.
💻 Me apasiona la programación
¡Siempre buscando mejorar y aprender de la manera más óptima posible! 🔥
---
*"El conocimiento no tiene límites, solo los que tú le pongas."*
                                    `}/>
                </div>
                <h1></h1>
                <div className="container-books">
                    <BookList books={misLibros}/>
                </div>
            <Footer />
        </div>
    )
}

export default MiPerfil