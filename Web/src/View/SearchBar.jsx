export function SearchBar({search,setSearch}){
    return <>
    <div className="searchContainer">
            <div class="searchBarContainer">
                <a class="aSearchBar">
                    <img src="/src/Composants/assets/filtre.svg" alt="filtre"/>
                </a>
                <input type="text" className="searchBar" value={search} placeholder="Rechercher une planète" onChange={(e)=>{setSearch(e.target.value)}} 
                />
                <a class="aSearchBar loupe">
                    <img src="/src/Composants/assets/loupe.svg" alt="loupe"/>
                </a>
            </div>
        </div>
    </>
}