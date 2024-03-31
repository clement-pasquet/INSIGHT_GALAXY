import { useEffect, useState } from "react";
import { ExpressServeur, listPlanets, setStyle, votedPlanets } from "../Controller/App";

export function Vote(){
    setStyle({styles : ["/src/Style/index.css","/src/Style/Vote.css","/src/Style/searchBar.css"]}); //Nous permet de définir un style spécial pour chaque page

    const [planets, setPlanets] = useState([]);
    const [votedPlanetsList, setVotedPlanets] = useState([]);
    const [search, setSearch] = useState('');

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
        try {
            const response = await fetch(ExpressServeur + `/vote/${name}`);
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
            <div className="searchBarContainer">
                <a className="aSearchBar filtre">
                    <img src="/src/assets/filtre.svg" alt="filtre"/>
                </a>
                <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)}/>
                <a className="aSearchBar loupe">
                    <img src="/src/assets/loupe.svg" alt="loupe"/>
                </a>
            </div>
            <div className="planetsContainer">
                {planets.filter(pl => pl.type === "En attente")
                        .filter(pl => pl.name.toLowerCase().includes(search.toLowerCase()))
                        .map((pl, index) => (
                            <div className="container" key={index}>
                                <div className="object">
                                    <img src={`${ExpressServeur}/planet/image/${pl.name}`} alt={pl.name} />
                                    <label>{pl.name}</label>
                                    {votedPlanetsList.includes(pl.name) ? (
                                        <a>VOTÉE</a>
                                    ) : (
                                        <a onClick={() => sendVote(pl.name)}>VOTER</a>
                                    )}
                                </div>
                            </div>
                        ))}
            </div>
        </>
    );
}
