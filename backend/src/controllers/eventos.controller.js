const prisma = require("../data/prisma");
const path = require("path");

const fs = require("fs");

const cadastrar = async (req, res) => {
  const data = req.body;

  data.data_evento = new Date(data.data_evento);

  const item = await prisma.eventos.create({
    data,
  });

  res.json(item).status(201).end();
};

const cadastrarImg = async (req, res) => {
  try {
    const idEvento = parseInt(req.params.id);
    const arquivo = req.file;

    if (!arquivo) {
      return res.status(400).json({ erro: "Nenhum arquivo enviado" });
    }

    const evento = await prisma.eventos.findUnique({
      where: { id: idEvento },
    });

    if (!evento) {
      return res.status(404).json({ erro: "Evento não encontrado" });
    }

    const pastaFinal = `uploads/eventos/${idEvento}`;
    const caminhoFinal = `${pastaFinal}/${arquivo.filename}`;

    if (!fs.existsSync(pastaFinal)) {
      fs.mkdirSync(pastaFinal, { recursive: true });
    }

    fs.renameSync(arquivo.path, caminhoFinal);

    const imagem = await prisma.imagem.create({
      data: {
        nomeOriginal: arquivo.originalname,
        nomeArquivo: arquivo.filename,
        mimeType: arquivo.mimetype,
        path: caminhoFinal,
        eventosId: idEvento,
      },
    });

    res.status(201).json(imagem);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ erro: error.message });
  }
};

const listar = async (req, res) => {
  const lista = await prisma.eventos.findMany();

  res.json(lista).status(200).end();
};

const buscar = async (req, res) => {
  const { id } = req.params;

  const item = await prisma.eventos.findUnique({
    where: { id: Number(id) },
    include: {
      imagens: true,
    }
  });

  if (!item) {
    return res.status(404).json({
      erro: "evento não encontrado",
    });
  }

  return res.status(200).json(item);
};

const buscarImg = async (req, res) => {
  try {
    const idImagem = parseInt(req.params.id);

    const imagem = await prisma.imagem.findFirst({
      where: {
        id: idImagem,
      },
    });

    if (!imagem) {
      return res.status(404).json({ erro: "Imagem não encontrada" });
    }

    const caminho = path.resolve(imagem.path);

    return res.sendFile(caminho);
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao buscar imagem" });
  }
};


const atualizar = async (req, res) => {
  const { id } = req.params;
  const dados = req.body;

  const item = await prisma.eventos.update({
    where: { id: Number(id) },
    data: dados,
  });

  res.json(item).status(200).end();
};

const excluir = async (req, res) => {
  const { id } = req.params;

  const item = await prisma.eventos.delete({
    where: { id: Number(id) },
  });

  res.json(item).status(200).end();
};

module.exports = {
  cadastrar,
  cadastrarImg,
  listar,
  buscar,
  buscarImg,
  atualizar,
  excluir,
};
