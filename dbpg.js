const { Pool } = require('pg')
require('dotenv').config()


const DB = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}
const db = new Pool(DB)

db.connect();

const query1 = `
SELECT * FROM person 
JOIN car 
ON person.car_id = car.id
`
const query2 = `
SELECT PERSON.FIRST_NAME,
	ARRAY_AGG(distinct concat(JSON_BUILD_OBJECT('id',

												TOOL.ID,
												'name',
												TOOL.NAME))) AS TOOLS
FROM PERSON
JOIN PERSON_TOOL ON PERSON.ID = PERSON_TOOL.PERSON_ID
JOIN TOOL ON TOOL.ID = PERSON_TOOL.TOOL_ID
GROUP BY PERSON.FIRST_NAME
ORDER BY PERSON.FIRST_NAME;
`
const query3 = `
SELECT (
    json_build_object  (
        'first_name',person.first_name,
        'last_name',person.last_name
    )
) FROM person
`

const query4 = `
SELECT json_build_object(
    'id', person.id,
    'name', person.first_name,
    'email', person.email,
    'car', json_build_object(
        'make', car.make,
        'model', car.model
    )
)
FROM  person
JOIN  car ON person.car_id = car.id;
`

const query5 = `
SELECT json_agg(json_build_object(
    'id', person.id,
    'name', person.first_name,
    'email', person.email,
    'car', json_agg(json_build_object(
        'make', car.make,
        'model', car.model
    )
)))
FROM  person
JOIN  car ON person.car_id = car.id
GROUP BY person.id;
`

const query6 = `
SELECT person.id,PERSON.FIRST_NAME "name",
ARRAY_AGG(distinct concat(JSON_BUILD_OBJECT (
												'name',
												TOOL.NAME,
                                                'id',PERSON_TOOL.TOOL_ID )))  AS TOOLS
FROM PERSON
JOIN PERSON_TOOL ON PERSON.ID = PERSON_TOOL.PERSON_ID
JOIN TOOL ON TOOL.ID = PERSON_TOOL.TOOL_ID
GROUP BY PERSON.id
ORDER BY PERSON.id;
`
const query7 = `
WITH cte AS (
    SELECT DISTINCT person_id, tool_id
    FROM person_tool
 )
 SELECT person.id, PERSON.first_name "name",
        ARRAY_AGG(JSON_BUILD_OBJECT (
                     'name',
                     TOOL.name,
                     'id', cte.tool_id 
                    )) AS tools
 FROM person
 JOIN cte ON cte.person_id = person.id
 JOIN tool ON tool.id = cte.tool_id
 GROUP BY person.id
 ORDER BY person.id;
`

const obj = [
    {
        id: 1,
        name: 'sherif',
        email: 'sherif@gmail.com',
        pictures: [1, 23, 45, 34, 67],
        cars: [
            { id: 1, name: 'car1', make: 'ford', color: ['green', 'yellow'] },
            { id: 2, name: 'car2', make: 'ford', color: ['gray', 'red'] },
            { id: 3, name: 'car3', make: 'morris', color: ['green', 'red'] }
        ]
    },
    {
        id: 2,
        name: 'ewa',
        email: 'ewa@gmail.com',
        pictures: [5, 23, 5, 34, 67],
        cars: [
            { id: 4, name: 'car4', make: 'ford', color: ['black', 'red'] },
            { id: 5, name: 'car5', make: 'ford', color: ['green', 'red'] },
            { id: 6, name: 'car6', make: 'morris', color: ['blue', 'red'] }
        ]
    }
]

// db.query(query6, (err, res) => {
//     if (!err) {
//         console.debug(res.rows)
//     } else {
//         console.log(err.message)
//     }
//     db.end;
// })

module.exports = { db, query6, query7 }