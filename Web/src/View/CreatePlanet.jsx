import { useState } from "react"
import {addPlanet} from "../Controller/App"
import {setStyle} from "../Controller/App"


export function CreatePlanet(){
    setStyle({styles : ["/src/Style/index.css"]}); //Nous permet de définir un style spécial pour chaque page

    let [name,setNom] = useState('')
    let [description,setDescription] = useState('')
    let [waterSurface,setWaterSurface] = useState('')
    let [orbitalePeriod,setOrbitalePeriod] = useState('')
    let [diameter,setDiameter] = useState('')
    let [population,setPopulation] = useState('')
    let [rotationPeriod,setRotationPeriod] = useState('')
    let [terrain,setTerrain] = useState('')
    let [climate,setClimate] = useState('')
    let [gravity,setgravity] = useState('')

    return <>
        <label>Nom</label>
        <input type="text"  value={name} onChange={(e)=> setNom(e.target.value)} />
        <label>Description</label>
        <input type="text" value={description} onChange={(e)=> setDescription(e.target.value)}/>
        <label>Surface D'eau</label>
        <input type="text" value={waterSurface} onChange={(e)=> setWaterSurface(e.target.value)}/>
        <label>Période orbitale</label>
        <input type="text" value={orbitalePeriod} onChange={(e)=> setOrbitalePeriod(e.target.value)}/>
        <label>Diamètre</label>
        <input type="text" value={diameter} onChange={(e)=> setDiameter(e.target.value)}/>
        <label>Population</label>
        <input type="text" value={population} onChange={(e)=> setPopulation(e.target.value)}/>
        <label>Période de rotation</label>
        <input type="text" value={rotationPeriod} onChange={(e)=> setRotationPeriod(e.target.value)}/>
        <label>Terrain</label>
        <input type="text" value={terrain} onChange={(e)=> setTerrain(e.target.value)}/>
        <label>Climat</label>
        <input type="text" value={climate} onChange={(e)=> setClimate(e.target.value)}/>
        <label>Gravité</label>
        <input type="text" value={gravity} onChange={(e)=> setgravity(e.target.value)}/>
        <br/>
        <input type="file" accept="image/png, image/jpeg"  />
        <button type="button" value="" onClick={()=> {
            let newPlanet = {name : name, rotationPeriod: rotationPeriod, orbitalePeriod:orbitalePeriod,diameter:diameter,climate:climate,gravity:gravity,terrain:terrain,surface_water:waterSurface,population:population}
            addPlanet(newPlanet)

        }}>Envoyer</button>
    
    
    
    </>


}


