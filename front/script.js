const API_URL = "http://localhost:8090/livros";

const tabela = document.getElementById("tabela-livros");
const form = document.getElementById("livro-form");
const idInput = document.getElementById("livro-id");
const tituloInput = document.getElementById("titulo");
const autorInput = document.getElementById("autor");
const anoInput = document.getElementById("ano");
const formTitle = document.getElementById("form-title");
const cancelarBtn = document.getElementById("cancelar");

async function carregarLivros() {
  try {
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error("Erro ao carregar livros");

    const livros = await resp.json();
    tabela.innerHTML = "";

    livros.forEach(livro => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${livro.id}</td>
        <td>${livro.titulo}</td>
        <td>${livro.autor}</td>
        <td>${livro.ano}</td>
        <td>
          <button onclick="editarLivro(${livro.id})">✏️</button>
          <button onclick="deletarLivro(${livro.id})" style="background:#dc3545">🗑️</button>
        </td>
      `;
      tabela.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    alert("Erro ao buscar livros do servidor.");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const livro = {
    titulo: tituloInput.value.trim(),
    autor: autorInput.value.trim(),
    ano: parseInt(anoInput.value)
  };

  try {
    let resp;
    if (idInput.value) {
      // Atualizar
      resp = await fetch(`${API_URL}/${idInput.value}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(livro)
      });
    } else {
      // Criar novo
      resp = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(livro)
      });
    }

    if (!resp.ok) throw new Error("Erro ao salvar livro");

    form.reset();
    idInput.value = "";
    formTitle.textContent = "Adicionar Livro";
    cancelarBtn.classList.add("hidden");

    carregarLivros();
  } catch (err) {
    console.error(err);
    alert("Falha ao salvar o livro.");
  }
});

async function editarLivro(id) {
  try {
    const resp = await fetch(`${API_URL}/${id}`);
    if (!resp.ok) throw new Error("Erro ao buscar livro");

    const livro = await resp.json();
    idInput.value = livro.id;
    tituloInput.value = livro.titulo;
    autorInput.value = livro.autor;
    anoInput.value = livro.ano;

    formTitle.textContent = "Editar Livro";
    cancelarBtn.classList.remove("hidden");
  } catch (err) {
    console.error(err);
    alert("Erro ao buscar dados do livro.");
  }
}

async function deletarLivro(id) {
  if (!confirm("Deseja realmente excluir este livro?")) return;
  try {
    const resp = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (resp.ok) {
      carregarLivros();
    } else {
      alert("Erro ao deletar livro.");
    }
  } catch (err) {
    console.error(err);
    alert("Erro de conexão com o servidor.");
  }
}

cancelarBtn.addEventListener("click", () => {
  form.reset();
  idInput.value = "";
  formTitle.textContent = "Adicionar Livro";
  cancelarBtn.classList.add("hidden");
});

carregarLivros();
