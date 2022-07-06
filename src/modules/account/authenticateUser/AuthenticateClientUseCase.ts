import { prisma } from "../../../database/prismaClient";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

interface IAuthenticateClient {
    username: string;
    password: string;
}

export class AuthenticateClientUseCase {
    async execute({ username, password }: IAuthenticateClient) {
        //Validar se o usuário existe
        const client = await prisma.clients.findFirst({
            where: {
                name: {
                    equals: username,
                    mode: "insensitive",
                },
            },
        });

        if (!client) {
            throw new Error("Username or password invalid");
        }

        //Validar se a senha está correta
        const passwordMatch = await compare(password, client.password);

        if (!passwordMatch) {
            throw new Error("Username or password invalid");
        }

        //Gerar o token
        const token = sign({ username }, "21232f297a57a5a743894a0e4a801fc3", {
            subject: client.id,
            expiresIn: "1d",
        });

        return token;
    }
}
