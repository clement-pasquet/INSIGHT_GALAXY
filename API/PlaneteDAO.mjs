"use strict";


class Planet {
    identifiant;
    name ;
    mass;
    radius;
    period;
    semi_major_axis;
    temperature; //Kelvin
    distance_light_year;
    host_star_mass;
    host_star_temperature;

    get_temperature(){
        return this.temperature -273,15;
    }

    constructor(obj) {
        //declare et instancie les attribut en recopiant ceux de obj
        Object.assign(this, obj);
    }    
}
class PlanetOfTheDay {
    identifiant;
    date;
    planete

    constructor(obj) {
        //declare et instancie les attribut en recopiant ceux de obj
        Object.assign(this, obj);
    }    
}

import { MongoClient } from 'mongodb';

//connexion
const url = "mongodb://localhost:27017";

//Un schema permetant de typer les données dans mongo
const options = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ['identifiant', 'date', 'planete'],
            properties: {
                identifiant: {
                    bsonType: "string",
                    description: "Identifiant de la planete"
                },
                date: {
                    bsonType: "date",
                    description: "date"
                },
                planete: {
                    bsonType: "object",
                    description: "planete"
                }

                
            }
        }
    }
};

const planeteDao = {
    //Retourne la liste de toutes les planetes
    findPlanets: async (offset=0) => {
        const client = new MongoClient(url);
        try {
            const maBD = client.db("maBD");
            const parkings = maBD.collection("planet", options);
            const cursor = parkings.find({}, {
                projection: { _id: 0 }
            });
            return (await cursor.toArray()).map((e) => new Parking(e));
        } finally {
            await client.close();
        }
    },
    //Retourne une planete suivant son nom ou null
    findPlanetByNom: async (nom) => {
        const client = new MongoClient(url);
        try {
            const proxy = process.env.https_proxy
            let url = "https://api.api-ninjas.com/v1/planets?name="+nom+""
            let agent = null
            if (proxy != undefined) { 
                console.log(`Le proxy est ${proxy}`) 
                agent = new HttpsProxyAgent(proxy); 
            } else { //pour pouvoir consulter un site avec un certificat invalide
                process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
                console.log("Pas de proxy trouvé") 
            }
            fetch(url, {
                headers: {
                    'X-Api-Key': apiKey
                },
                agent: agent

            })
            .then(response => {
            if (!response.ok) {
                throw new Error('La réponse réseau n est pas bonne');
            }
            return response.json();
            })
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error('Il y a eu une erreur avec la requète:', error);
            });

        }catch(e){
            return null
        }
    }
};

export { PlanetOfTheDay, planeteDao };
