const express = require('express');
const app = express();
const { body, validationResult } = require('express-validator');
const port = 3000;

const VALIDATOR_EMPTY = "Value is empty";
const VALIDATOR_NOT_STRING = "Value is not string";
const VALIDATOR_NOT_ARRAY = "Value is not array";
const VALIDATOR_NOT_INT = "Value is not int";

// misal DB
let db = [];

app.use(express.json());

app.get('/song', (req, res) => {
    res.status(200).json({
        data: db
    });
})

app.get('/song/:id', (req, res) => {
    let id = parseInt(req.params.id);
    res.status(200).json(db[id-1]);
})

app.post('/song', 
    body('title').notEmpty().withMessage(VALIDATOR_EMPTY).isString().withMessage(VALIDATOR_NOT_STRING),
    body('artists').isArray().withMessage(VALIDATOR_NOT_ARRAY),
    body('artists.*.name').notEmpty().withMessage(VALIDATOR_EMPTY).isString().withMessage(VALIDATOR_NOT_STRING),
    body('url').notEmpty().isString(), 
    (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).send({
                errors: result.array()
            });
        }
        let song = req.body;
        db.push({id: db.length+1, ...song});
        res.status(201).send("Created!");
});

app.delete('/song',
    body('id').notEmpty().isInt().withMessage(VALIDATOR_NOT_INT),
    (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).send({
                errors: result.array()
            });
        }
        let targetId = req.body.id;
        db.splice(targetId-1, 1);
        res.status(200).send("Successfully deleted!");
});

app.listen(port, () => {
    console.log(`App is listening on ${port}`)
})