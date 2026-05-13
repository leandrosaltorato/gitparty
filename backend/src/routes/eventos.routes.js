const express = require("express");

const router = express.Router();

const upload = require("../middlewares/imageUpload");

const {
  cadastrar,
  listar,
  buscar,
  atualizar,
  excluir,
  cadastrarImg,
  buscarImg,
} = require("../controllers/eventos.controller");

router.post("/cadastrar", cadastrar);
router.post("/cadastrarimg/:id", upload, cadastrarImg);
router.get("/listar", listar);
router.get("/buscar/:id", buscar);
router.get("/buscar/:id/img", buscarImg);
router.put("/atualizar/:id", atualizar);
router.delete("/excluir/:id", excluir);

module.exports = router;
