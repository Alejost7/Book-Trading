import searchIcon from '../../../assets/icons/searchIcon.png';
const Search = () => {
    return (
        <div class="search">
            <input type="text" placeholder="Busca lo mejor para ti..." class="searchInput"/>
            <img src={searchIcon} class="searchIcon" />
        </div>
    )
}

export default Search;