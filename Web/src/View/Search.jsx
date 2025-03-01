import { useState, useEffect } from "react";
import {listPlanets, setStyle} from "../Controller/App"
import {ExpressServeur} from "../Controller/App"
import { SearchBar } from "./SearchBar";

export function Search(){
    setStyle({styles : ["/src/Style/index.css","/src/Style/Search.css","/src/Style/searchBar.css"]}); //Nous permet de définir un style spécial pour chaque page

    const [planets, setPlanets] = useState([]);
    const [search, setSearch] = useState('');
    const [starWarsPlanets, setStarWarsPlanets] = useState(true);
    const [bdPlanets, setBdPlanets] = useState(true);
    const [orderByCroissant, setOrderByCroissant] = useState(true);
    const [shownDropdown, setShownDropdown] = useState(null);
    // Fonction pour afficher ou masquer le dropdown affiché
    const toggleDropdown = (dropdown) => {
        if (shownDropdown === dropdown) {
            setShownDropdown(null);
        } else {
            setShownDropdown(dropdown);
        }
    };

    // Hook pour charger la liste des planètes
    useEffect(() => {
        const getPlanet = async () => {
            let myPlanets = await listPlanets()
            setPlanets(myPlanets)
        };

        getPlanet();
    }, []); 

    // Fonction utilisé pour inverser le sens du tri, est utilisé par la barre de recherche
    const toggleOrderByCroissant = () => {
        setOrderByCroissant(prevState => !prevState);
    };    
    
    
    return (<>
            <SearchBar search={search} setSearch={setSearch} toggleOrderByCroissant={toggleOrderByCroissant}/>
            <div className="ContainerTri">
                <div>
                    <button onClick={() => toggleDropdown('trier')}>Trier</button>
                    {shownDropdown === 'trier' && (
                        <div className="dropdown">
                            <div className="Trier">
                                <div className={orderByCroissant?"bold":""}  onClick={() => {setOrderByCroissant(true); setShownDropdown(null);}}>Nom par ordre croissant</div>
                                <div className={!orderByCroissant?"bold":""} onClick={() => {setOrderByCroissant(false); setShownDropdown(null);}}>Nom par ordre décroissant</div>
                            </div>
                        </div>
                    )}
                </div>
                
                <div>
                    <button onClick={() => toggleDropdown('filtrer')}>Filtrer</button>
                    {shownDropdown === 'filtrer' && (
                        <div className="dropdown">
                            <div className="Filtrer">
                                <div className={starWarsPlanets?"bold":""} onClick={() => {setStarWarsPlanets(!starWarsPlanets); setShownDropdown(null);}}>Star Wars Planets</div>
                                <div className={bdPlanets?"bold":""} onClick={() => {setBdPlanets(!bdPlanets); setShownDropdown(null);}}>Added Planets</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="planetsContainer">
    {planets
        .filter(pl => {
            if (!(pl.type == "En attente") && starWarsPlanets) { return true; }
            if ((pl.type == "En attente") && bdPlanets) { return true; }
            return false;
        })
        .filter(pl => pl.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => orderByCroissant ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))
        .reduce((acc, pl, index) => {
            const chunkIndex = Math.floor(index / 5);
            if (!acc[chunkIndex]) {
                acc[chunkIndex] = []; // Commence un nouveau groupe de 5 planètes
            }
            acc[chunkIndex].push(
                <div key={index} className={pl.type === 'En attente' ? "fanPlanet" : ""}>
                    <a href={"planet/" + pl.name.replace(" ","")}>
                        <img className="planetImage" src={ExpressServeur+"/planet/image/"+pl.name} alt={pl.name} />
                    </a>
                    <h2>{pl.name}</h2>

                </div>
            );
            return acc;
        }, [])
        .map((chunk, index) => (
            <div key={index} className={"planetsGroup "}>{chunk}</div>
        ))}
</div>

        </>
    );

}