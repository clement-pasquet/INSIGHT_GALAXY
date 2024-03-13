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

const createdPlaneteDao = {
    //Retourne la liste de toutes les planetes
    findPlanets: async () => {
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
    //Retourne une planete suivant son nom ou null
    findPlanetByNom: async (nom) => {
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

                const {acknowledged,_} = await planets.insertOne({...planete});
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

export { createdPlaneteDao,Planet };
