import express, { NextFunction, Request, Response } from "express";
import "express-async-errors"; //TEM QUE IMPORTAR O ASYNC ERRORS DEPOIS DE IMPORTAR O EXPRESS PARA PODER FUNCIONAR
import { routes } from "./routes";

const app = express();

app.use(express.json());

app.use(routes);

app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
        if (err instanceof Error) {
            return response.status(400).json({
                message: err.message,
            });
        }

        return response.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
);

app.listen(3000, () => console.log("Server started on port 3000"));
