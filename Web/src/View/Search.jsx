import { useState, useEffect } from "react";
import {listPlanets, setStyle} from "../Controller/App"
import '/src/Composants/css/searchBar.css'; 
import {ExpressServeur, listPlanets, setStyle} from "../Controller/App"

export function Search(){
    setStyle({styles : ["/src/Style/index.css","/src/Style/Search.css"]}); //Nous permet de définir un style spécial pour chaque page

    const [planets, setPlanets] = useState([]);
    const [search, setSearch] = useState('');
    const [starWarsPlanets, setStarWarsPlanets] = useState(true);
    const [bdPlanets, setBdPlanets] = useState(true);
    const [orderByCroissant, setOrderByCroissant] = useState(true);
    const [showDropdown, setShowDropdown] = useState(null);
    const toggleDropdown = (dropdown) => {
        if (showDropdown === dropdown) {
            setShowDropdown(null);
        } else {
            setShowDropdown(dropdown);
        }
    };


    useEffect(() => {
        const getPlanet = async () => {
            let myPlanets = await listPlanets()
            console.log(myPlanets)
            setPlanets(myPlanets)
        };

        getPlanet();
    }, []); 
    
    
    return (<>
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
            <div className="ContainerTri">
                <button onClick={() => toggleDropdown('trier')}>Trier</button>
                {showDropdown === 'trier' && (
                    <div className="dropdown">
                        <div className="Trier">
                            <div onClick={() => {setOrderByCroissant(true); setShowDropdown(null);}}>Nom par ordre croissant</div>
                            <div onClick={() => {setOrderByCroissant(false); setShowDropdown(null);}}>Nom par ordre décroissant</div>
                        </div>
                    </div>
                 )}
                 
                <button onClick={() => toggleDropdown('filtrer')}>Filtrer</button>
                {showDropdown === 'filtrer' && (
                    <div className="dropdown">
                        <div className="Filtrer">
                            <div onClick={() => {setStarWarsPlanets(!starWarsPlanets); setShowDropdown(null);}}>Star Wars Planets</div>
                            <div onClick={() => {setBdPlanets(!bdPlanets); setShowDropdown(null);}}>Added Planets</div>
                        </div>
                    </div>
                )}
            </div>


            <div className="planetsContainer">
                {planets
                    .filter(pl => {
                        if (!(pl.type == "En attente" || pl.type === "Votee") && starWarsPlanets) { return true; }
                        if ((pl.type == "En attente" || pl.type === "Votee") && bdPlanets) { return true; }
                        return false;
                    })
                    .filter(pl => pl.name.toLowerCase().includes(search.toLowerCase()))
                    .sort((a, b) => orderByCroissant ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))
                    .map((pl, index) => (
                        <div key={index} className={pl.type === 'En attente' ? "fanPlanet" : ""}>
                            <h2>{pl.name}</h2>
                            <a href={"planet/" + pl.name.replace(" ","")}>
                                <img className="planetImage" src={ExpressServeur+"/planet/image/"+pl.name} alt={pl.name} />
                    

                            </a>
                        </div>
                    ))}
            </div>

        </>
    );

}