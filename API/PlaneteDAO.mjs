"use strict";
import {HttpsProxyAgent} from 'https-proxy-agent';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fetch from 'node-fetch';



export class Planet {
    name ;
    description;
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


const mongoServer = await MongoMemoryServer.create();
//connexion
const url = mongoServer.getUri()

//Un schema permetant de typer les données dans mongo
const optionsPlanet = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ['name'],
            properties: {
                identifiant: {
                    bsonType: "string",
                    description: "Identifiant de la planete"
                },
                name: {
                    bsonType: "string",
                    description: "Nom de la planete"
                },
                description: {
                    bsonType : "string",
                    description: "Description de la planete"
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

const optionsPlanetAdded =  {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ['name'],
            properties:  {
                
                name: {
                    bsonType: "string",
                    description: "Nom de la planete"
                },
                date: {
                    bsonType: "string",
                    description: "Date du vote"
                }
                             
            }
        }
    }
};




const optionVote= {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ['name', 'token'],
            properties: {
                name: {
                    bsonType: "string",
                    description: "Nom de la planete"
                },
                token: {
                    bsonType: "string",
                    description: "Token unique d'un utilisateur (Adresse ip)"
                }
            }
        }
    }
}



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


        const url = "https://swapi.info/api/planets/";


        try {
            const response = agent != null ? await fetch(url, { headers: { Accept: 'application/json' }, agent: agent }) : await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }
            
            const json = await response.json();
            return json.filter((element) => {
                const { name } = element;
                if (uniformPlanetName(name) != 'unknown'){
                    return true
                }
            });
        
        } catch (error) {
            console.error("Error fetching data:", error);
        }

    },
    //Retourne une planete suivant son nom ou null
    findPlanetByNomSWAPI: async (nom) => {
        nom = nom.toLowerCase()
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
        const url = "https://swapi.info/api/planets/";


        try {
        const response = agent != null ? await fetch(url, { headers: { Accept: 'application/json' }, agent: agent }) : await fetch(url);
        
        if (!response.ok) {
            Promise.reject(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        
        const json = await response.json();
    
        return json.filter((objPlanet) => {
            if (uniformPlanetName(objPlanet.name) == nom) {
                return true; // Garde cet élément dans le nouveau tableau
            }
            return false; // Enlève cet élément du nouveau tableau
        }).map((element) => {
            const { residents, films, created, edited, url, ...planetData } = element;
            if (uniformPlanetName(planetData['name']) != 'unknown'){
                planetData['type'] = 'Original';
                return new Planet(planetData)
            }
        });
        } catch (error) {
            Promise.reject("Error fetching data")

        }

    },
    //Retourne la liste de toutes les planetes de notre DB
    findPlanetsDB: async () => {
        const client = new MongoClient(url);
        try {
            const maBD = client.db("maBD");
            const planetes = maBD.collection("planetes", optionsPlanet);
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
            const planetes = maBD.collection("planetes", optionsPlanet);
            const cursor = planetes.find({name: nom}, { 
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
    //Retourne les planetes qui contienne nom dans leur nom
    findPlanetByNom: async (nom) => {
        let planets = await planeteDao.findPlanetByNomSWAPI(nom)
        let planetsDb = await planeteDao.findPlanetByNomDB(nom)
        return [...planets,...planetsDb]

    },
    addPlanete: async (planete) => {
        if (planete instanceof Planet){
            const client = new MongoClient(url);
            try {
                let lsPlaneteSimilaire = (await planeteDao.findPlanetByNom(planete.name)).filter(pl => pl.name.toLowerCase() === planete.name.toLowerCase());
                if(lsPlaneteSimilaire.length>0 ){
                    return Promise.reject("Une planète du même nom existe déjà !")
                }
                const maBD = client.db("maBD");
                const planets = maBD.collection("planetes", optionsPlanet);
                let maPlanete = {...planete}
                if(maPlanete['type']  != "Votee"){
                    maPlanete['type'] = 'En attente'
                }
                let { acknowledged: ack1, _ } = await planets.insertOne(maPlanete);
                const planetsAdded = maBD.collection("planetesAdded", optionsPlanetAdded);
                let { acknowledged: ack2, _2 } = await planetsAdded.insertOne({ name: maPlanete.name, date: getTodayDate() });

                if(ack1 && ack2){
                    return true
                }
                return false
            } catch(e){
                return Promise.reject("Il y a une erreur dans l'ajout d'une planète")
                
            }finally {
                await client.close();
            }
        }
        Promise.reject("La planète passée en paramètre n'est pas du type Planet")
    },
    //Supprime toutes les données ajouter à la db
    deleteAll: async () => {
        const client = new MongoClient(url);
            try {
                const maBD = client.db("maBD");
                const planets = maBD.collection("planetes", optionsPlanet);
                await planets.deleteMany({});

                const vote = maBD.collection("votePlanete", optionVote);
                await vote.deleteMany({});


                
                
            } finally {
                await client.close();
            }
    },
    //Supprime toutes les données ajouter à la db
    deleteAllWaiting: async () => {
        const client = new MongoClient(url);
            try {
                const maBD = client.db("maBD");
                const planets = maBD.collection("planetes", optionsPlanet);
                await planets.deleteMany({type:"En attente"});

                const vote = maBD.collection("votePlanete", optionVote);
                await vote.deleteMany({});


                
                
            } finally {
                await client.close();
            }
    },
    deletePlanetsByName: async (nom) => {
        const client = new MongoClient(url);
        try {
            const maBD = client.db("maBD");
            const planets = maBD.collection("planetes", optionsPlanet);
            await planets.deleteOne({name: { $regex: new RegExp(nom, 'i') }}); //Supprime les planètes son name contient la valeur de nom en ignorant la casse.
            
            
        } finally {
            await client.close();
        }
    },
    addVotePlanete: async (nomPlanete, token) => {
        const client = new MongoClient(url);
        try {
    
            const maBD = client.db("maBD");
            const planets = maBD.collection("votePlanete", optionVote);
    
    
            const planet = await planets.findOne({ name: nomPlanete, token: token });
            if(planet == null){
                const lsplanet = await planeteDao.findPlanetByNom(nomPlanete)
                if(lsplanet.length > 0){
                    const { acknowledged, _ } = await planets.insertOne({ name: nomPlanete, token: token});
                    if(acknowledged){
                        return true
                    }
                }
            }
            return false


        } finally {
            await client.close();
        }
    },
    /**
     * 
     * @param {String} nomPlanete 
     * @param {String} token 
     * @returns 
     */
    removeVotePlanete: async (nomPlanete, token) => {
        const client = new MongoClient(url);
        try {
    
            const maBD = client.db("maBD");
            const planets = maBD.collection("votePlanete", optionVote);
    
    
            const planet = await planets.findOne({ name: nomPlanete, token: token });
            if(planet != null){
                const { acknowledged, _ } = await planets.deleteOne({ name: nomPlanete, token: token });
                if(acknowledged){
                    return true
                }
                
            }
            return false


        } finally {
            await client.close();
        }
    },
    getNbVote: async (nomPlanete) => {
        const client = new MongoClient(url);
        try {
    
            const maBD = client.db("maBD");
            const planets = maBD.collection("votePlanete", optionVote);
    
    
            const count = await planets.countDocuments({name:nomPlanete});
            return count;

        } finally {
            await client.close();
        }
    },
    getAllUserVotes: async (token) => {
        const client = new MongoClient(url);
        try {
    
            const maBD = client.db("maBD");
            const planets = maBD.collection("votePlanete", optionVote);
    
    
            const list = planets.find( { token: token }, {
                projection: { _id: 0,name:1 }
            });
            return await list.toArray();

        } finally {
            await client.close();
        }
    },
    getMostVotedPlanet : async () =>{

        const client = new MongoClient(url);
        try {
    
            const maBD = client.db("maBD");
            const planets = maBD.collection("votePlanete", optionVote);
    
            const planetMostVoted = await planets.aggregate([
                {
                    $group: {
                        _id: '$name', 
                        totalVotes: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0, 
                        name: '$_id', 
                        totalVotes: 1 
                    }
                },
                {
                    $sort: { totalVotes: -1 }
                },
                {
                    $limit: 1
                }
            ])
            return await planetMostVoted.toArray();

        } catch (e){
            return Promise.reject("La récupération des votes n'as pas pu être effectué")
        } finally {
            await client.close();
        }

    },
    getNbAddedPlanetToday: async () => {
        const client = new MongoClient(url);
        try {
    
            const maBD = client.db("maBD");
            const planets = maBD.collection("planetesAdded", optionVote);
    
    
            const count = await planets.countDocuments({date:getTodayDate()});
            return count;

        } catch(e){
            return 0
            
        }finally {
            await client.close();
        }
    },
    


};

function getTodayDate(){
    const date = new Date();
    const jour = date.getDate();
    const mois = date.getMonth() + 1; 
    const annee = date.getFullYear();
    return jour+'/'+mois+'/'+annee;

}
function uniformPlanetName(name){
    return name.toLowerCase().replace(" ","");
}

export { planeteDao , uniformPlanetName};
