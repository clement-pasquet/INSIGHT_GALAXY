import { useState, useEffect } from "react";
import {ExpressServeur, listPlanets, setStyle} from "../Controller/App"

export function Search(){
    setStyle({styles : ["/src/Style/index.css","/src/Style/Search.css"]}); //Nous permet de définir un style spécial pour chaque page

    const [planets, setPlanets] = useState([]);
    const [search, setSearch] = useState('');
    const [starWarsPlanets, setStarWarsPlanets] = useState(true);
    const [bdPlanets, setBdPlanets] = useState(true);
    const [orderByCroissant, setOrderByCroissant] = useState(true);



    useEffect(() => {
        const getPlanet = async () => {
            let myPlanets = await listPlanets()
            console.log(myPlanets)
            setPlanets(myPlanets)
        };

        getPlanet();
    }, []); 

    
    return (<>
            <input type="text" value={search} onChange={(e)=>{setSearch(e.target.value)}}/>
            <input type="checkbox" checked={starWarsPlanets} onChange={(e)=>{setStarWarsPlanets(e.target.checked)}} name="StarWarsPlanet" id="starWarsPlanet"/>
            <label htmlFor="starWarsPlanet">Star Wars Planets</label>
            <input type="checkbox"  checked={bdPlanets} onChange={(e)=>{setBdPlanets(e.target.checked)}} name="addedPlanet" id="addedPlanet"/>
            <label htmlFor="addedPlanet">Added Planets</label>
            <input type="radio" checked={orderByCroissant} onChange={(e)=>{setOrderByCroissant(true);}} name="orderRadio" id="radioCroissantName"/>
            <label htmlFor="radioCroissantName">Nom par ordre croissant</label>
            <input type="radio" checked={!orderByCroissant} onChange={(e)=>{setOrderByCroissant(false);}} name="orderRadio" id="radioDecroissantName"/>
            <label htmlFor="radioDecroissantName">Nom par ordre décroissant</label>


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