import swaggerAutogen from 'swagger-autogen';

const serverPort =  8090

const outputFile = './swagger.json';
const endpointsFiles = ['server.mjs'];

const config = {
    info: {
        title: 'Star Wars API Documentation',
        description: '',
    },
    tags: [ ],
    host: 'localhost:'+serverPort,
    schemes: ['http'],
};

swaggerAutogen(outputFile, endpointsFiles, config);
