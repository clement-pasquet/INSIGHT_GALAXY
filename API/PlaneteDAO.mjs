"use strict";
import {HttpsProxyAgent} from 'https-proxy-agent';


class Planet {
    name ;
    rotation_period;
    orbital_period;
    diameter;
    climate;
    gravity;
    terrain;
    surface_water;
    population;

    constructor(obj) {
        //declare et instancie les attribut en recopiant ceux de obj
        Object.assign(this, obj);
    }    
}


import { MongoClient } from 'mongodb';

//connexion
const url = "mongodb://localhost:27017";

//Un schema permetant de typer les données dans mongo
// const options = {
//     validator: {
//         $jsonSchema: {
//             bsonType: "object",
//             required: ['identifiant', 'date', 'planete'],
//             properties: {
//                 identifiant: {
//                     bsonType: "string",
//                     description: "Identifiant de la planete"
//                 },
//                 date: {
//                     bsonType: "date",
//                     description: "date"
//                 },
//                 planete: {
//                     bsonType: "object",
//                     description: "planete"
//                 }

                
//             }
//         }
//     }
// };

const planeteDao = {
    //Retourne la liste de toutes les planetes
    findPlanets: async (offset=0) => {
        const proxy = process.env.https_proxy
        let agent = null
        if (proxy != undefined) {
            console.log(`Le proxy est ${proxy}`)
            agent = new HttpsProxyAgent(proxy);
        }
        else {
            //pour pouvoir consulter un site avec un certificat invalide
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
            console.log("Pas de proxy trouvé")
        }


        try {
            let next = "https://swapi.dev/api/planets/?page=1";
            let findPlanets = []
            while(next!=null){
                const response = agent != null ? await fetch(next, { headers: { Accept: 'application/json' }, agent: agent }) : await fetch(next);
        
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
                }
                
                const json = await response.json();
                next = json.next
                
                findPlanets = findPlanets.concat(json.results.map((element) => {
                    const { residents, films, created, edited, url, ...planetData } = element;
                    return new Planet(planetData)
                }))
            }
            return findPlanets
        
        } catch (error) {
            console.error("Error fetching data:", error);
        }

    },
    //Retourne une planete suivant son nom ou null
    findPlanetByNom: async (nom) => {
        const proxy = process.env.https_proxy
        let agent = null
        if (proxy != undefined) {
            console.log(`Le proxy est ${proxy}`)
            agent = new HttpsProxyAgent(proxy);
        }
        else {
            //pour pouvoir consulter un site avec un certificat invalide
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
            console.log("Pas de proxy trouvé")
        }
        const url = "https://swapi.dev/api/planets/?search="+nom;


        try {
        const response = agent != null ? await fetch(url, { headers: { Accept: 'application/json' }, agent: agent }) : await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        
        const json = await response.json();
        return json.results.map((element) => {
            const { residents, films, created, edited, url, ...planetData } = element;
            return new Planet(planetData)
        });
        } catch (error) {
            console.error("Error fetching data:", error);
        }

    }
};

export { planeteDao };
