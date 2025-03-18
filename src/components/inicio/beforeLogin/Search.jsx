import searchIcon from '../../../assets/icons/searchIcon.png';
const Search = () => {
    return (
        <div className="search">
            <input type="text" placeholder="Busca lo mejor para ti..." className="searchInput"/>
            <img src={searchIcon} className="searchIcon" alt="Search Icon" />
        </div>
    )
}

export default Search;