const prisma = require("../data/prisma");
const { limiteInscricoes, verificarDuplicidade, promoverListaDeEspera, validarPrazo } = require("../services/inscricoes.services");

const cadastrar = async (req, res) => {
    try {
        const data = req.body;

        await verificarDuplicidade(data.usuariosId, data.eventosId);

        const status = await limiteInscricoes(data.eventosId);

        if (status != "") data.status = status;

        const item = await prisma.inscricoes.create({
            data
        });

        res.status(201).json(item).end();
    }
    catch (error) {
        res.status(500).json(error.toString()).end();
    }
};

const listar = async (req, res) => {
    const lista = await prisma.inscricoes.findMany();
    res.status(200).json(lista).end();
};

const buscar = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.inscricoes.findUnique({
        where: { id: Number(id) }
    });

    res.status(200).json(item).end();
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;

    try {
        const antes = await prisma.inscricoes.findUnique({
            where: { id: Number(id) }
        });

        if (dados.status === "CANCELADA") {
            await validarPrazoCancelamento(Number(id));
        }

        const item = await prisma.inscricoes.update({
            where: { id: Number(id) },
            data: dados
        });

        if (antes.status === "CONFIRMADA" && item.status === "CANCELADA") {
            await promoverListaEspera(item.eventosId);
        }

        res.status(200).json(item).end();

    } catch (error) {
        res.status(500).json(error.toString()).end();
    }
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.inscricoes.delete({
        where: { id: Number(id) }
    });

    res.status(200).json(item).end();
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};