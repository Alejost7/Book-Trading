import "../../styles/miPerfil/ProfileCard.css"

const ProfileCard = ({
    imgSrc,
    imgAlt,
    username,
    role
}) =>{
    return(
        <div className="ProfileCard">
            <img className="CardImage" src={imgSrc} alt={imgAlt}></img>
            <h2 className="Username">{username}</h2>
            <p className="Role">{role}</p>
        </div>
    );
}


export default ProfileCard