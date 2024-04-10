"use strict"
import * as chai from "chai";
import {Planet, planeteDao, uniformPlanetName} from "../PlaneteDAO.mjs";
import { MongoMemoryServer } from 'mongodb-memory-server';
import {HttpsProxyAgent} from "https-proxy-agent";
import fetch from "node-fetch";

// Test Model
let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;

async function findPlanetByNom_STUB(nom) {
    let planets = await findPlanetByNomSWAPI_STUB(nom)
    let planetsDb = await findPlanetByNomDB_STUB(nom)
    return [...planets,...planetsDb]
}

async function findPlanetByNom_STUB_2(nom){
    let planets = await findPlanetsSWAPIUniformPlanetName_STUB(nom)
    let planetsDb = await findPlanetByNomDB_STUB(nom)
    return [...planets,...planetsDb]
}

async function findPlanetByNom_STUB_3(nom){
    let planets = await findPlanetsSWAPIUniformPlanetName_STUB(nom)
    let planetsDb = await planeteDao.findPlanetByNomDB(nom)
    return [...planets,...planetsDb]
}
function findPlanetByNomSWAPI_STUB(nom) {
    return [new Planet({
        name : nom.toLowerCase(),
        description :"SWAPI_STUB",
        rotation_period : "0",
        orbital_period : "0",
        diameter : "0",
        climate : "climate_STUB",
        gravity : "gravity_STUB",
        terrain : "terrain_STUB",
        surface_water : "surface_water_STUB",
        population : "population_STUB",
        type : "type_STUB",
    })]
}

function findPlanetByNomDB_STUB(nom) {
    return [new Planet({
        name : nom.toLowerCase(),
        description :"DB_STUB",
        rotation_period : "0",
        orbital_period : "0",
        diameter : "0",
        climate : "climate_STUB",
        gravity : "gravity_STUB",
        terrain : "terrain_STUB",
        surface_water : "surface_water_STUB",
        population : "population_STUB",
        type : "type_STUB",
    })]
}

async function findPlanetsSWAPIUniformPlanetName_STUB(nom) {
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
            if (uniformPlanetName_STUB(objPlanet.name) == nom) {
                return true; // Garde cet élément dans le nouveau tableau
            }
            return false; // Enlève cet élément du nouveau tableau
        }).map((element) => {
            const { residents, films, created, edited, url, ...planetData } = element;
            if (uniformPlanetName_STUB(planetData['name']) != 'unknown'){
                planetData['type'] = 'Original';
                return new Planet(planetData)
            }
        });
    } catch (error) {
        Promise.reject("Error fetching data")

    }

}

function uniformPlanetName_STUB(name) {
    return name.toLowerCase().replace(" ", "");
}

describe("findPlanetByNomIntegration", function() {

    it("test avec un stub de findPlanetByNomSWAPI(nom) et findPlanetByNomDB(nom)", async function() {
        const p1 = new Planet({
            name : "tatooine",
            description :"DB_STUB",
            rotation_period : "0",
            orbital_period : "0",
            diameter : "0",
            climate : "climate_STUB",
            gravity : "gravity_STUB",
            terrain : "terrain_STUB",
            surface_water : "surface_water_STUB",
            population : "population_STUB",
            type : "type_STUB",
        })

        const p2 = new Planet({
            name : "tatooine",
            description :"SWAPI_STUB",
            rotation_period : "0",
            orbital_period : "0",
            diameter : "0",
            climate : "climate_STUB",
            gravity : "gravity_STUB",
            terrain : "terrain_STUB",
            surface_water : "surface_water_STUB",
            population : "population_STUB",
            type : "type_STUB",
        })
        expect(await findPlanetByNom_STUB("Tatooine")).to.deep.include.members([p1,p2])
    });

    it("test avec un stub de uniformPlanetName(name) et findPlanetByNom(nom)", async function() {
        const planets = await findPlanetByNom_STUB_2("Tatooine")

        for (let i of planets){
            expect(uniformPlanetName_STUB(i.name)).to.equal("tatooine")
        }
    });

    it("test avec un stub de uniformPlanetName(name)", async function() {
        const planets = await findPlanetByNom_STUB_3("Tatooine")

        for (let i of planets){
            expect(uniformPlanetName_STUB(i.name)).to.equal("tatooine")
        }
    });

    it("test sans stub", async function() {
       const planets = await planeteDao.findPlanetByNom("Tatooine")

        for (let i of planets){
            expect(uniformPlanetName(i.name)).to.equal("tatooine")
        }
    });
})