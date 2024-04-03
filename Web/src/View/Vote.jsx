import { useEffect, useState } from "react";
import { ExpressServeur, listPlanets, setStyle, votedPlanets } from "../Controller/App";
import { SearchBar } from "./SearchBar";

export function Vote(){
    setStyle({styles : ["/src/Style/index.css","/src/Style/Vote.css","/src/Style/searchBar.css"]}); //Nous permet de définir un style spécial pour chaque page

    const [planets, setPlanets] = useState([]);
    const [votedPlanetsList, setVotedPlanets] = useState([]);
    const [search, setSearch] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [shownDropdown, setShownDropdown] = useState(null);
    const toggleDropdown = (dropdown) => {
        if (shownDropdown === dropdown) {
            setShownDropdown(null);
        } else {
            setShownDropdown(dropdown);
        }
    };

    useEffect(() => {
        const fetchPlanets = async () => {
            try {
                const myPlanets = await listPlanets();
                setPlanets(myPlanets);
            } catch (error) {
                console.error("Error fetching planets:", error);
            }
        };
        fetchPlanets();
    }, []); 
    
    useEffect(() => {
        const fetchVotedPlanets = async () => {
            try {
                const voted = await votedPlanets();
                setVotedPlanets(voted.map(planet => planet.name));
            } catch (error) {
                console.error("Error fetching voted planets:", error);
            }
        };
        fetchVotedPlanets();
    }, []); 

    const sendVote = async (name) => {
        if (isDisabled) return
        try {
            const response = await fetch(ExpressServeur + `/vote/${name}`);
            if (response.status === 200) {
                const updatedVotedPlanets = await votedPlanets();   
                setVotedPlanets(updatedVotedPlanets.map(planet => planet.name));
                //Désactiver le bouton
                setIsDisabled(true);
                setTimeout(() => {
                    setIsDisabled(false);
                }, 1000);
            }
        } catch (error) {
            console.error("Error sending vote:", error);
            alert('Erreur lors de la requête fetch : ' + error.message);
        }
    };

    const sendUnvote = async (name) => {
        if (isDisabled) return
        try {
            const response = await fetch(ExpressServeur + `/unvote/${name}`);
            if (response.status === 200) {
                const updatedVotedPlanets = await votedPlanets();   
                setVotedPlanets(updatedVotedPlanets.map(planet => planet.name));
            }
        } catch (error) {
            console.error("Error sending vote:", error);
            alert('Erreur lors de la requête fetch : ' + error.message);
        }
    };

    return (
        <>
            <SearchBar search={search} setSearch={setSearch}/>
            <div className="ContainerTri">
            <button onClick={() => toggleDropdown('trier')}>Trier</button>
            {shownDropdown === 'trier' && (
                <div className="dropdown">
                    <div className="Trier">
                        <div onClick={() => {setOrderByCroissant(true); setShownDropdown(null);}}>Nom par ordre croissant</div>
                        <div onClick={() => {setOrderByCroissant(false); setShownDropdown(null);}}>Nom par ordre décroissant</div>
                    </div>
                </div>
            )}
        </div>
            <div className="planetsContainer">
                {planets.filter(pl => pl.type === "En attente")
                        .filter(pl => pl.name.toLowerCase().includes(search.toLowerCase()))
                        .map((pl, index) => (
                            <div className="container" key={index}>
                                <div className="object">
                                    <a href={"planet/" + pl.name.replace(" ","")}><img src={`${ExpressServeur}/planet/image/${pl.name}`} alt={pl.name} /></a>
                                    <label>{pl.name}</label>
                                    {votedPlanetsList.includes(pl.name) ? (
                                        <a onClick={()=> sendUnvote(pl.name)} className={isDisabled?"disabled button":"button"} disabled={isDisabled}>VOTÉE</a>
                                    ) : (
                                        <a onClick={() => sendVote(pl.name)} disabled={isDisabled} className="button">VOTER</a>
                                    )}
                                </div>
                            </div>
                        ))}
            </div>
        </>
    );
}
