const prisma = require("../data/prisma");

const limiteParticipantes = async (usuarioId, eventoId) => {
    const evento = await prisma.eventos.findUnique({
        where: { id : eventoId },
        include: {
            inscricoes: true
        }
    });

    const numeroParticipantes = evento.inscricoes.filter(inscricao => inscricao.status == "CONFIRMADA").length;

    console.log(numeroParticipantes);

    if(numeroParticipantes == evento.capacidade_maxima) {
        return "LISTA_ESPERA";
    }else {
        return "CONFIRMADA";
    }
};

const verificarDuplicidade = async (usuarioId, eventoId) => {
    const cadastro = await prisma.inscricoes.findMany({
        where: {
            eventosId: eventoId,
            usuariosId: usuarioId
        }
    });

    if(cadastro.length > 0) throw new Error("Usuario ja cadastrado.");
};

const validarPrazo = async (inscricaoId) => {
    const inscricao = await prisma.inscricoes.findUnique({
        where: { id: inscricaoId },
        include: { eventos: true }
    });

    if (!inscricao) throw new Error("Inscrição não encontrada");

    let hoje = new Date();
    let dataEvento = new Date(inscricao.eventos.data_evento);

    let intervalo = dataEvento - hoje;

    let horas = intervalo / (1000 * 60 * 60);

    if (horas < 24) {
        throw new Error("Cancelamento não permitido em menos de 24h para o evento");
    }
};

const promoverListaDeEspera = async (eventoId) => {
    const proximo = await prisma.inscricoes.findFirst({
        where: {
            eventosId: eventoId,
            status: "LISTA_ESPERA"
        },
        orderBy: {
            id: "asc"
        }
    });

    if (proximo) {
        await prisma.inscricoes.update({
            where: { id: proximo.id },
            data: { status: "CONFIRMADA" }
        });
    }
};



module.exports = {
    limiteParticipantes,
    verificarDuplicidade,
    validarPrazo,
    promoverListaDeEspera
}