"use strict"
import * as chai from "chai";
let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;
import { Planet, planeteDao } from "../PlaneteDAO.mjs";
import fetch from 'node-fetch'; // Assurez-vous d'avoir installé node-fetch via npm install node-fetch
import { describe } from "node:test";
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe("Route tests", function () {
    let mongoServer;

    before(async ()=> {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri()
    })

    afterEach(async () => {
        await planeteDao.deleteAll();
    });

    after(async ()=>{
        await mongoose.connection.close()
    })

    it("GET /planet should get all planets", async function () {
        const response = await fetch('http://localhost:8090/planet', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        expect(response.status).to.equal(200); // Vérifie le code de statut de la réponse

        const responseBody = await response.json(); // Analyse le corps de la réponse comme JSON

        expect(responseBody).to.be.an('array'); // Vérifie que la réponse est un tableau

        responseBody.forEach(planet => {
            expect(planet).to.have.property('name');
        });
    });

    it("GET /planet/:name should get the planet with name 'Ex'", async function () {
        
        const planete = {
            name: 'Ex',
            description: 'simpa',
            rotation_period: '15',
            orbital_period: '42',
            diameter: '45',
            climate: '',
            gravity: '1G', // Ajout de gravity dans les données de planète
            terrain: 'Mountain', // Ajout de terrain dans les données de planète
            surface_water: '20%', // Ajout de surface_water dans les données de planète
            population: '100000', // Ajout de population dans les données de planète
            type: 'Original'
        };
        const newPlanet = new Planet(planete);
        await planeteDao.addPlanete(newPlanet);
    
        const name = 'Ex'; // Utilisez le même nom que celui de la planète ajoutée
    
        let responseBody =await fetch('http://localhost:8090/planet/').then(response=>{
                expect(response.status).to.equal(200); // Vérifie le code de statut de la réponse
                return response.json(); // Analyse le corps de la réponse comme JSON
                
            });
            console.log("fejhgirhgjgsdjgchvxeghvzefgy"+responseBody)
            expect(responseBody).to.be.an('array'); // Vérifie que la réponse est un tableau
        
            const firstPlanet = responseBody;
            console.log(firstPlanet)
            expect(firstPlanet.name).to.equal('Ex'); // Vérifie le nom de la planète
            expect(firstPlanet.description).to.equal('simpa');
            expect(firstPlanet.rotation_period).to.equal('15');
            expect(firstPlanet.orbital_period).to.equal('42');
            expect(firstPlanet.diameter).to.equal('45');
            expect(firstPlanet.climate).to.equal('');
            expect(firstPlanet.gravity).to.equal('1G');
            expect(firstPlanet.terrain).to.equal('Mountain');
            expect(firstPlanet.surface_water).to.equal('20%');
            expect(firstPlanet.population).to.equal('100000');
            expect(firstPlanet.type).to.equal('Original');
    });

    it("GET /planet/:name should return empty list for get inexistant name planet", async function () {
        const name=""
        const response = await fetch('http://localhost:8090/planet/'+name);

        expect(response.status).to.equal(200); // Vérifie le code de statut de la réponse
        const responseBody = await response.json(); // Analyse le corps de la réponse comme JSON
        expect(responseBody).to.be.an('array').that.is.empty; // Vérifie que la réponse est un tableau non vide
    });

    it("GET /info/vote should get the current vote count for each planet", async function () {
        const response = await fetch('http://localhost:8090/info/vote', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        expect(response.status).to.equal(200); // Vérifie le code de statut de la réponse

        const responseBody = await response.json(); // Analyse le corps de la réponse comme JSON

        expect(responseBody).to.be.an('array').that.is.not.empty; // Vérifie que la réponse est un tableau non vide

        // Vérifie que chaque élément du tableau a les propriétés attendues pour le vote
        responseBody.forEach(planet => {
            expect(planet).to.have.property('name');
            expect(planet).to.have.property('vote_count');
        });
    });

    it("GET /info/vote should return an error message if there is an error fetching votes", async function () {
        const response = await fetch('http://localhost:8090/info/vote/1', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        expect(response.status).to.equal(500); // Vérifie le code de statut de la réponse

        const responseBody = await response.text(); // Récupère le corps de la réponse comme texte
        expect(responseBody).to.equal('Erreur lors de la récupération des votes');
    });

    it("POST /planet should add a new planet", async function () {
        const planet = {
            name: 'HelloDadada',
            description: 'simpa',
            rotation_period: '15',
            orbital_period: '42',
            diameter: '45',
            climate: '',
            gravity: '1G', // Ajout de gravity dans les données de planète
            terrain: 'Mountain', // Ajout de terrain dans les données de planète
            surface_water: '20%', // Ajout de surface_water dans les données de planète
            population: '100000', // Ajout de population dans les données de planète
            type: 'Original' // Ajout de type dans les données de planète
        };

        const response = await fetch('http://localhost:8090/planet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
  
            body: JSON.stringify(planet)
        });

        // Vérifiez le code de statut de la réponse
        expect(response.status).to.equal(200);
    });

    it("POST /planet should not add two times the same planet by name", async function () {
        const planet = {
            name: 'HelloDadada',
            description: 'simpa',
            rotation_period: '15',
            orbital_period: '42',
            diameter: '45',
            climate: '',
            gravity: '1G', // Ajout de gravity dans les données de planète
            terrain: 'Mountain', // Ajout de terrain dans les données de planète
            surface_water: '20%', // Ajout de surface_water dans les données de planète
            population: '100000', // Ajout de population dans les données de planète
            type: 'Original' // Ajout de type dans les données de planète
        };

        const response = await fetch('http://localhost:8090/planet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
  
            body: JSON.stringify(planet)
        });

        expect(response.status).to.equal(200);

        const response2 = await fetch('http://localhost:8090/planet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
  
            body: JSON.stringify(planet)
        });

        // Vérifiez le code de statut de la réponse
        expect(response2.status).to.equal(500);
        const responseBody = await response.json(); // Analyse le corps de la réponse comme JSON

        expect(responseBody).to.have.property('error').that.equals('Erreur lors de la récupération des votes');
    });
})