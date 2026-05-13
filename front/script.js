const API_EVENTOS = "http://localhost:3000/eventos";


function abrirModal() {
  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
  limparModal();
}

function limparModal() {
  document.getElementById("nome").value = "";
  document.getElementById("data").value = "";
  document.getElementById("local").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("capacidade").value = "";
  document.getElementById("imagem").value = "";


  document.querySelector(".modal h2").innerText = "Novo Evento";
  document.querySelector(".modal button.btn").innerText = "Salvar";
}

