import express from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import { celebrate, Joi} from 'celebrate';

import PointController from "./controllers/PointsController";
import ItemsController from './controllers/ItemsController';


const routes = express.Router();
const upload = multer(multerConfig);
let err
const pointController = new PointController();
const itemsController = new ItemsController();

routes.get("/items", itemsController.index);
routes.get("/points", pointController.index);
routes.get("/points/:id", pointController.show);
routes.post("/points", 
upload.single('image'),
celebrate({body:Joi
    .object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        uf: Joi.string().required().max(2),
        city: Joi.string().required(),
        items: Joi.string().required(),
    })
}, {abortEarly: false, debug: true}),
pointController.create);

export default routes;
