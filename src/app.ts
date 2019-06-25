import express, {Application, NextFunction, Request, Response} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import passport from "./setup/passport.setup";


import route from "./route";
import {IS_DEV_MODE} from "./config"

const app: Application = express();

app.use(cors());
app.use(bodyParser.json({type: "application/json"}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));
app.use(passport.initialize());
route(app);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    let error;
    console.log(err);
    if (err.name === "SequelizeUniqueConstraintError") {
        error = err.errors[0].message.replace("must be unique", "already exist");
        res.statusMessage = error;
        return res.status(400).send({
            message: error
        });
    }

    if (/^Sequelize/.test(err.name) && IS_DEV_MODE) {
        error = err.message;
        res.statusMessage = error;
        return res.status(400).send({message: error});
    }

    if (/^5/.test(err.status) || !err.status) {
        if (IS_DEV_MODE) {
            error = err.message;
        } else {
            error = "An error occurred on our end. Please try again later";
        }
        res.statusMessage = error;
        return res.status(500).send({message: error});
    }

    if (IS_DEV_MODE) {
        res.statusMessage = err.message;
        return res.status(err.status).send({message: err.message, errors: err});
    } else {
        return res.status(500).send({message: "An error occurred on our end. Please try again later"});
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.info(`App running and listening on port ${port}!`);
});

export default app;
