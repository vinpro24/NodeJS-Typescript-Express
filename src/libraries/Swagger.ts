import { Express, Request, Response } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: `API DOCS`.toUpperCase(),
            version: '1.0.0'
        },
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: [
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ik1QLTdVVzBUIiwibmFtZSI6IkMiLCJhdmF0YXIiOiJodHRwczovL3VpLWF2YXRhcnMuY29tL2FwaS8_YmFja2dyb3VuZD1jZWJlMjImY29sb3I9ZmZmJm5hbWU9dHJhbmJhY2h0cnVvbmdhbjFAZ21haWwuY29tIiwidHlwZSI6Im1lbWJlciIsImxhbmdJZCI6InZpIiwiYmlydGhkYXkiOiIxOTk4LTA3LTA4VDAwOjAwOjAwLjAwMFoiLCJpYXQiOjE2NTY1NTk1MDl9.lbosQEfcnomdIJ86pR1lQ3yaSa5XLZQv9A9PvKLW394'
                ]
            }
        ]
    },
    apis: ['**/*.ts', '/app/routes/**/*.js']
}

const swaggerSpec = swaggerJsdoc(options)

function swagger(app: Express) {
    // Swagger page
    app.use(`/api/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    // Docs in JSON format
    app.get(`/api/docs.json`, (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })

    // console.log(`Docs available at http://localhost:${port}/docs`)
}

export default swagger
