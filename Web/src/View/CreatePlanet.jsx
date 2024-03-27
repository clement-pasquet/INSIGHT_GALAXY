import { useState } from "react"
import {addPlanet} from "../Controller/App"
import {setStyle} from "../Controller/App"


export function CreatePlanet(){
    setStyle({styles : ["/src/Style/index.css", "/src/Style/createPlanet.css"]}); //Nous permet de définir un style spécial pour chaque page

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
    const [selectedFile, setSelectedFile] = useState(null);

    return <>
        <div id="grandeBoite">
            <div id="boite2">
                <input type="text"  value={name} onChange={(e)=> setNom(e.target.value)} placeholder="Nom" />
                <input type="text" value={description} onChange={(e)=> setDescription(e.target.value)} placeholder="Description"/>
                
                <input type="text" value={waterSurface} onChange={(e)=> setWaterSurface(e.target.value)} placeholder="Surface D'eau"/>
                
                <input type="text" value={orbitalePeriod} onChange={(e)=> setOrbitalePeriod(e.target.value)} placeholder="Période orbitale"/>
                
                <input type="text" value={diameter} onChange={(e)=> setDiameter(e.target.value)} placeholder="Diamètre"/>
            </div>
            <div id="boite">
                <img id="planete" src="src/assets/planetePlus.png"></img>
                <img id="plus" src="src/assets/plus.png"></img>
            </div>
            <div id="boite3">
                <input type="text" value={population} onChange={(e)=> setPopulation(e.target.value)} placeholder="Population"/>
                
                <input type="text" value={rotationPeriod} onChange={(e)=> setRotationPeriod(e.target.value)} placeholder="Période de rotation"/>
                
                <input type="text" value={terrain} onChange={(e)=> setTerrain(e.target.value)} placeholder="Terrain"/>
                
                <input type="text" value={climate} onChange={(e)=> setClimate(e.target.value)} placeholder="Climat"/>
                
                <input type="text" value={gravity} onChange={(e)=> setgravity(e.target.value)} placeholder="Gravité"/>
                <input type="file" onChange={(event) => {
            const file = event.target.files[0]; setSelectedFile(file);}} accept="image/png, image/jpeg"  />
                <button id="btn" type="button" value="" onClick={()=> {
                    let newPlanet = {name : name, description:description,rotationPeriod: rotationPeriod, orbitalePeriod:orbitalePeriod,diameter:diameter,climate:climate,gravity:gravity,terrain:terrain,surface_water:waterSurface,population:population}
                    addPlanet(newPlanet,selectedFile)

                }}>Envoyer</button>
            </div>
        </div>
    
    
    
    </>


}



