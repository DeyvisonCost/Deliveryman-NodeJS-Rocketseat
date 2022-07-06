import { prisma } from "../../../../database/prismaClient";
import { hash } from "bcrypt";

interface ICreateClient {
    username: string;
    password: string;
}

export class CreateClientUseCase {
    async execute({ username, password }: ICreateClient) {
        //Validar se o usuário existe
        const ClientExist = await prisma.clients.findFirst({
            where: {
                name: {
                    equals: username,
                    mode: "insensitive",
                },
            },
        });

        //Se existir retornar erro
        if (ClientExist) {
            throw new Error("Client already exists");
        }

        //Criptografar a senha
        const hashedPassword = await hash(password, 10);

        //Salvar o usuário
        const client = await prisma.clients.create({
            data: {
                name: username,
                password: hashedPassword,
            },
        });

        return client;
    }
}
