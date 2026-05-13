const multer = require("multer");

const validarNomeArquivo = (req, file, callback) => {
  const nomePublicacao = req.body.nome || "arquivo";

  const nomeFormatado = nomePublicacao.toLowerCase().replaceAll(" ", "-");

  const nomeFinal = Date.now() + "-" + nomeFormatado + ".jpg";

  callback(null, nomeFinal);
};

const definirDestino = (req, file, callback) => {
  callback(null,"uploads/temp");
};

const filtrarExtensao = (req, file, callback) => {
  if (file.mimetype === "image/jpeg") {
    callback(null, true);
  } else {
    callback(new Error("Apenas imagens JPEG são permitidas"));
  }
};

const armazenamento = multer.diskStorage({
  destination: definirDestino,
  filename: validarNomeArquivo,
});

const upload = (req, res, next) => {
  const filemulter = multer({
    storage: armazenamento,
    fileFilter: filtrarExtensao,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });

  filemulter.single("imagem")(req, res, function (erro) {
    if (erro) {
      return res.status(400).json({ erro: erro.message });
    }

    if (!req.file) {
      return res.status(400).json({ erro: "Arquivo não enviado" });
    }

    next();
  });
};

module.exports = upload;
