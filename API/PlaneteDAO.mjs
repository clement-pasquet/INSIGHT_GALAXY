"use strict";
import {HttpsProxyAgent} from 'https-proxy-agent';
import { MongoClient } from 'mongodb';


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
    type;

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
            required: ['identifiant', 'name', 'rotation_period','orbital_period','diameter','climate','gravity','terrain','surface_water','population','type'],
            properties: {
                identifiant: {
                    bsonType: "string",
                    description: "Identifiant de la planete"
                },
                name: {
                    bsonType: "string",
                    description: "Nom de la planete"
                },
                planete: {
                    bsonType: "object",
                    description: "planete"
                },
                rotation_period:{
                    bsonType: "string",
                    description: "Periode de rotation de la planete en heure"
                },
                orbital_period: {
                    bsonType:"string",
                    description: "Nombre de jour d'un orbite autour de son étoile local"
                },
                diameter:{
                    bsonType:"string",
                    description: "Diametre de la planete en kilometre"
                },
                climate : {
                    bsonType:"string",
                    description:"Les climats de la planète. Elle est séparée par des virgules si elle en possède plusieurs. Ex:Arid"
                },
                gravity:{
                    bsonType:"string",
                    description:"La force de gravité de la planète. Basé sur la gravité terrestre.  1=1G , 2=2G"
                },
                terrain:{
                    bsonType:"string",
                    description:"Les types de terrain que possède la planete. Si il y en a plusieurs ils sont séparé par des virgules. Ex:Dessert"
                },
                surface_water:{
                    bsonType:"string",
                    description:"Pourcentage de la planète qui est recouverte d'eau (Ou de corps fait en eau)"
                },
                population:{
                    bsonType:"string",
                    description:"La population moyenne des êtres sensibles habitant cette planète."
                },
                type: {
                    bsonType: "string",
                    description: "Original / En attente / Votee" //Original (provient de l'api SWAPI) , En attente (Une des planètes proposées par un utilisateur) / Votee (Planète qui a été élu pour apparaître dans l'application)
                }

                
            }
        }
    }
};


const planeteDao = {
    //Retourne la liste de toutes les planetes
    findPlanetsSWAPI: async () => {
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
                    planetData['type'] = "Original"
                    return new Planet(planetData)
                }))
            }
            return findPlanets
        
        } catch (error) {
            console.error("Error fetching data:", error);
        }

    },
    //Retourne une planete suivant son nom ou null
    findPlanetByNomSWAPI: async (nom) => {
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
            planetData['type'] = "Original"
            return new Planet(planetData)
        });
        } catch (error) {
            console.error("Error fetching data:", error);
        }

    },
    //Retourne la liste de toutes les planetes de notre DB
    findPlanetsDB: async () => {
        const client = new MongoClient(url);
        try {
            const maBD = client.db("maBD");
            const planetes = maBD.collection("planetes", options);
            const cursor = planetes.find({}, {
                projection: { _id: 0 }
            });
            return (await cursor.toArray()).map((e) => new Planet(e));
        } finally {
            await client.close();
        }

    },
    //Retourne une planete suivant son nom ou null de notre DB
    findPlanetByNomDB: async (nom) => {
        const client = new MongoClient(url);
        try {
            const maBD = client.db("maBD");
            const planetes = maBD.collection("planetes", options);
            const cursor = planetes.find({name:nom}, {
                projection: { _id: 0 }
            });
            return (await cursor.toArray()).map((e) => new Planet(e));
        } finally {
            await client.close();
        }

    },
    //Retourne la liste de toutes les planetes
    findPlanets: async () => {
        let planetsSWAPI = await planeteDao.findPlanetsSWAPI()
        let planetDB = await planeteDao.findPlanetsDB()
        return planetsSWAPI.concat(planetDB)
    },
    //Retourne une planete suivant son nom ou null 
    findPlanetByNom: async (nom) => {
        let planets = await planeteDao.findPlanetByNomSWAPI(nom)
        if (planets.length>0){
            return planets[0]
        }else{
            planets = await findPlanetByNomDB(nom)
            if (planets.length>0){
                return planets[0]
            }
            return null
        }

    },
    addPlanete: async (planete) => {
        if (planete instanceof Planet){
            const client = new MongoClient(url);
            try {
                let lsPlaneteSimilaire = await createdPlaneteDao.findPlanetByNom(planete.name)
                if(lsPlaneteSimilaire.length>0 ){
                    return Promise.reject("Une planète du même nom existe déjà !")
                }
                const maBD = client.db("maBD");
                const planets = maBD.collection("planetes", options);
                let maPlanete = {...planete}
                maPlanete['type'] = 'En attente'
                const {acknowledged,_} = await planets.insertOne(maPlanete);
                if(acknowledged){
                    return true
                }
                return false
            } finally {
                await client.close();
            }
        }
        Promise.reject("La planète passée en paramètre n'est pas du type Planet")
    },
    //Supprime
    delete: async () => {
        const client = new MongoClient(url);
            try {
                const maBD = client.db("maBD");
                const planets = maBD.collection("planetes", options);
                await planets.deleteMany({});
                
                
            } finally {
                await client.close();
            }
    }
};

export { planeteDao };
