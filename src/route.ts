import {Application, NextFunction, Request, Response, Router} from "express";
import * as path from "path";
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';

const requireAll = require("require-all");
const docsPath = path.resolve(__dirname, '../docs/v1/spec.yaml');

const swaggerDocument = YAML.load(docsPath);
const apiPath = '/api/v1';

const configureRoutes = (app: Application) => {
    const controllers: any = requireAll({
        dirname: path.resolve(__dirname, "./controller/v1"),
        filter: /^(?!base)(.+\.controller)\.(t|j)s$/,
        resolve: (controller: any) => {
            if (typeof controller.default === "function") {
                return new controller.default();
            }
        },
    });
    const apiRouter = Router();

    apiRouter.get("/", (req, res, next) => {
        res.json({message: "Welcome to Turing Backend API!"});
    });
    apiRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    apiRouter.use((req, res, next) => {
        console.log(`Request (${req.method}) to ${req.url}`);
        next()
    });

    Object.keys(controllers).forEach((key) => {
        const controller = controllers[key];
        for (const routeConfig of controller.routesConfig) {
            const {method, middlewares, relPath, fnName} = routeConfig;
            const routeSlug = controller.routeSlug || key.replace(/.controller(.*)$/, '');
            const routePath = `/${routeSlug}${relPath || '/'}`;
            console.log(`${method}: ${apiPath}${routePath} -> ${controller.constructor.name}.${fnName}`);
            apiRouter[method](routePath, ...middlewares, (req: Request, res: Response, next: NextFunction) => {
                controller[fnName](req, res, next);
            });
        }
    });

    app.get("/", (req: Request, res: Response) => {
        res.json({message: "Server is running!"});
    });
    app.use(apiPath, apiRouter);
};

export default configureRoutes;
