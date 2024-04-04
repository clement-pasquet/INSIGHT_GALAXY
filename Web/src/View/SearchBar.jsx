export function SearchBar({search,setSearch}){
    return <>
    <div className="searchContainer">
            <div className="searchBarContainer">
                <a className="aSearchBar">
                    <img src="/src/assets/filtre.svg" alt="filtre"/>
                </a>
                <input type="text" className="searchBar" value={search} placeholder="Rechercher une planète" onChange={(e)=>{setSearch(e.target.value)}} 
                />
                <a className="aSearchBar loupe">
                    <img src="/src/assets/loupe.svg" alt="loupe"/>
                </a>
            </div>
        </div>
    </>
}