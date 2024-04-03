"use strict"
import * as chai from "chai";
import { Planet, planeteDao } from "../PlaneteDAO.mjs";

import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Test Model
let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;

describe("Test du modèle Planet", function () {
    it("Création d'une planète", async () => {
        const planetData = {
            name: 'HelloWorld',
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

        const planet = new Planet(planetData);

        // Vérifie que les propriétés de la planète ont été correctement initialisées
        expect(planet).to.have.property('name', 'HelloWorld');
        expect(planet).to.have.property('description', 'simpa');
        expect(planet).to.have.property('rotation_period', '15');
        expect(planet).to.have.property('orbital_period', '42');
        expect(planet).to.have.property('diameter', '45');
        expect(planet).to.have.property('climate', '');
        expect(planet).to.have.property('gravity', '1G'); // Vérifie la gravité de la planète
        expect(planet).to.have.property('terrain', 'Mountain'); // Vérifie le terrain de la planète
        expect(planet).to.have.property('surface_water', '20%'); // Vérifie la surface d'eau de la planète
        expect(planet).to.have.property('population', '100000'); // Vérifie la population de la planète
        expect(planet).to.have.property('type', 'Original'); // Vérifie le type de la planète

        expect(planet).to.have.all.keys('name', 'description', 'rotation_period', 'orbital_period', 'diameter', 'climate', 'gravity', 'terrain', 'surface_water', 'population', 'type');
    });
});

/*
describe("planeteDAO", function () {
    let mongoServer;

    before(async ()=> {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri()
    })
    beforeEach(async ()=> {
        await planeteDao.deleteAll()
    })

    it("findAll test 1", async ()=>{
        const planet = await planeteDao.findAll()
        expect(planet).to.be.an("array").that.is.empty 
    })
})*/

