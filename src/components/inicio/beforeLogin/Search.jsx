import searchIcon from '../../../assets/icons/searchIcon.png';
const Search = () => {
    return (
        <div className="search">
            <input type="text" placeholder="Busca lo mejor para ti..." class="searchInput"/>
            <img src={searchIcon} class="searchIcon" alt="Search Icon" />
        </div>
    )
}

export default Search;