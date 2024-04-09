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

