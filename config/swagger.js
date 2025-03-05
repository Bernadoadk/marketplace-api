const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Marketplace",
            version: "1.0.0",
            description: "Documentation de l'API de gestion de marketplace",
        },
        servers: [
            {
                url: "http://localhost:5000/api",
                description: "Serveur local"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ["./routes/*.js"], // 🔥 Swagger va scanner tous les fichiers de routes
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    console.log("📄 Documentation Swagger disponible sur http://localhost:5000/api-docs");
};

module.exports = swaggerDocs;
