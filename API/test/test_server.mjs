"use strict"
import * as chai from "chai";
let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;

import fetch from 'node-fetch'; // Assurez-vous d'avoir installé node-fetch via npm install node-fetch

describe("POST /planet", function () {
    it("should add a new planet", async function () {
        const planet = {
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

        const response = await fetch('http://localhost:8090/planet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
  
            body: JSON.stringify(planet)
        });

        // Vérifiez le code de statut de la réponse
        expect(response.status).to.equal(200);

        // Si vous vous attendez à recevoir une réponse JSON, vous pouvez l'analyser comme ceci :
        //const responseBody = await response.json();

        // Vérifiez la structure ou les données de la réponse
        //expect(responseBody).to.have.property('message').that.equals('Planète ajouté avec succès !');
        // Ajoutez d'autres assertions selon vos besoins
    });
});
