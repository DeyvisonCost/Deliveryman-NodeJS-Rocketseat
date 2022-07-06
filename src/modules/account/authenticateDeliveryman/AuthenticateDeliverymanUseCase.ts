import { prisma } from "../../../database/prismaClient";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

interface IAuthenticateDeliveryman {
    username: string;
    password: string;
}

export class AuthenticateDeliverymanUseCase {
    async execute({ username, password }: IAuthenticateDeliveryman) {
        //Validar se o usuário existe
        const deliveryman = await prisma.deliveryman.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: "insensitive",
                },
            },
        });

        if (!deliveryman) {
            throw new Error("Username or password invalid");
        }

        //Validar se a senha está correta
        const passwordMatch = await compare(password, deliveryman.password);

        if (!passwordMatch) {
            throw new Error("Username or password invalid");
        }

        //Gerar o token
        const token = sign({ username }, "21232f297a83a5a743894a0e4a801fc3", {
            subject: deliveryman.id,
            expiresIn: "1d",
        });

        return token;
    }
}
