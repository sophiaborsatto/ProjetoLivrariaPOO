// --- 1. DEFINIÇÃO DAS URLs DA API ---
// Definimos as URLs base para cada "parte" da nossa API
const API = {
  itens: "http://localhost:8090/itens",
  usuarios: "http://localhost:8090/usuarios",
  emprestimos: "http://localhost:8090/emprestimos",
};

// --- 2. "PEGANDO" OS ELEMENTOS DO HTML ---
// Formulários
const formItem = document.getElementById("form-item");
const formUsuario = document.getElementById("form-usuario");
const formEmprestimo = document.getElementById("form-emprestimo");

// Campos do Form de Itens
const itemTipoSelect = document.getElementById("item-tipo");
const itemTituloInput = document.getElementById("item-titulo");
const itemAnoInput = document.getElementById("item-ano");
const campoLivro = document.getElementById("campo-livro");
const itemAutorInput = document.getElementById("item-autor");
const campoPeriodico = document.getElementById("campo-periodico");
const itemTipoPeriodicoSelect = document.getElementById("item-tipo-periodico");

// Campos do Form de Usuário
const usuarioNomeInput = document.getElementById("usuario-nome");

// Campos do Form de Empréstimo
const selectUsuario = document.getElementById("select-usuario");
const selectItem = document.getElementById("select-item");

// Tabelas (onde os dados são mostrados)
const tabelaItens = document.getElementById("tabela-itens");
const tabelaUsuarios = document.getElementById("tabela-usuarios");
const tabelaEmprestimos = document.getElementById("tabela-emprestimos");

// --- 3. LÓGICA DE CARREGAMENTO DE DADOS (GET) ---

/** Carrega TODOS os dados da API quando a página abre
 * e atualiza tudo.
 */
async function carregarTudo() {
  await carregarItens();
  await carregarUsuarios();
  await carregarEmprestimosAtivos();
}

/** Busca e mostra os ITENS na tabela */
async function carregarItens() {
  try {
    const resp = await fetch(API.itens);
    const itens = await resp.json();

    tabelaItens.innerHTML = ""; // Limpa a tabela
    selectItem.innerHTML = '<option value="">--Selecione um item--</option>'; // Limpa o dropdown

    itens.forEach(item => {
      // Adiciona na Tabela
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.id}</td>
        <td>${item.titulo}</td>
        <td>${item.anoPublicacao}</td>
        <td>${item.tipo_item}</td>
        <td>${item.autor || item.tipo || 'N/A'}</td>
        <td>${item.disponivel ? '✅ Sim' : '❌ Não'}</td>
        <td>
          <button class="danger" onclick="deletarItem(${item.id})">🗑️ Excluir</button>
        </td>
      `;
      tabelaItens.appendChild(tr);

      // Adiciona no Dropdown de Empréstimo (SÓ SE ESTIVER DISPONÍVEL)
      if (item.disponivel) {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = `(ID ${item.id}) ${item.titulo}`;
        selectItem.appendChild(option);
      }
    });
  } catch (err) {
    console.error("Erro ao carregar itens:", err);
    alert("Não foi possível carregar os itens do acervo.");
  }
}

/** Busca e mostra os USUÁRIOS na tabela */
async function carregarUsuarios() {
  try {
    const resp = await fetch(API.usuarios);
    const usuarios = await resp.json();

    tabelaUsuarios.innerHTML = ""; // Limpa a tabela
    selectUsuario.innerHTML = '<option value="">--Selecione um usuário--</option>'; // Limpa o dropdown

   usuarios.forEach(user => {
     const tr = document.createElement("tr");
     tr.innerHTML = `
       <td>${user.id}</td>
       <td>${user.nome}</td>
       <td>${user.multaPendente.toFixed(2)}</td>
      <td>
        <button class="warning" onclick="aplicarMulta(${user.id})">⚠️ Aplicar Multa</button>
        <button class="success" onclick="retirarMulta(${user.id})">✅ Retirar Multa</button>
      </td>
     `;
     tabelaUsuarios.appendChild(tr);

      // Adiciona no Dropdown de Empréstimo
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = `(ID ${user.id}) ${user.nome}`;
      selectUsuario.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar usuários:", err);
    alert("Não foi possível carregar os usuários.");
  }
}

/** Busca e mostra TODOS os EMPRÉSTIMOS ATIVOS na tabela */
async function carregarEmprestimosAtivos() {
  try {
    const resp = await fetch(`${API.emprestimos}/ativos`);
    if (!resp.ok) throw new Error("Erro ao buscar empréstimos.");

    const emprestimos = await resp.json();

    tabelaEmprestimos.innerHTML = ""; // Limpa a tabela antes de repopular

    emprestimos.forEach(emprestimo => {
      const tr = document.createElement("tr");
      tr.id = `emprestimo-${emprestimo.id}`;
      tr.innerHTML = `
        <td>${emprestimo.id}</td>
        <td>${emprestimo.item.id} (${emprestimo.item.titulo})</td>
        <td>${emprestimo.usuario.id} (${emprestimo.usuario.nome})</td>
        <td>${emprestimo.dataEmprestimo || '-'}</td>
        <td>${emprestimo.dataPrevistaDevolucao || '-'}</td>
        <td>
          <button class="danger" onclick="devolverItem(${emprestimo.id})">↩️ Devolver</button>
        </td>
      `;
      tabelaEmprestimos.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar empréstimos ativos:", err);
    alert("Não foi possível carregar os empréstimos ativos.");
  }
}


// --- 4. LÓGICA DE CRIAÇÃO (POST) ---

/** Ouve o 'submit' do formulário de ITENS */
formItem.addEventListener("submit", async (e) => {
  e.preventDefault(); // Impede o recarregamento da página

  // Monta o objeto JSON baseado no que foi selecionado
  const itemJSON = {
    titulo: itemTituloInput.value,
    anoPublicacao: parseInt(itemAnoInput.value),
    tipo_item: itemTipoSelect.value, // "LIVRO" ou "PERIODICO"
  };

  if (itemJSON.tipo_item === "LIVRO") {
    itemJSON.autor = itemAutorInput.value;
  } else if (itemJSON.tipo_item === "PERIODICO") {
    itemJSON.tipo = itemTipoPeriodicoSelect.value; // "REVISTA" ou "JORNAL"
  }

  try {
    const resp = await fetch(API.itens, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemJSON),
    });

    if (!resp.ok) {
      // Se der erro (ex: 400 Bad Request, 500 Erro), o 'fetch' não dá 'catch'
      // Nós temos que forçar o erro
      const erro = await resp.json();
      throw new Error(erro.message || "Erro ao salvar item.");
    }

    formItem.reset(); // Limpa o formulário
    campoLivro.classList.add("hidden"); // Esconde os campos condicionais
    campoPeriodico.classList.add("hidden");
    
    carregarTudo(); // Recarrega todas as tabelas
    alert("Item salvo com sucesso!");

  } catch (err) {
    console.error("Erro ao salvar item:", err);
    alert(`Erro: ${err.message}`);
  }
});

/** Ouve o 'submit' do formulário de USUÁRIO */
formUsuario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuarioJSON = {
    nome: usuarioNomeInput.value
  };

  try {
    const resp = await fetch(API.usuarios, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuarioJSON),
    });
    
    if (!resp.ok) throw new Error("Erro ao salvar usuário.");

    formUsuario.reset();
    carregarTudo(); // Recarrega tudo
    alert("Usuário salvo com sucesso!");

  } catch (err) {
    console.error("Erro ao salvar usuário:", err);
    alert("Erro ao salvar usuário.");
  }
});

/** Ouve o 'submit' do formulário de EMPRÉSTIMO */
formEmprestimo.addEventListener("submit", async (e) => {
  e.preventDefault();

  const emprestimoJSON = {
    usuarioId: parseInt(selectUsuario.value),
    itemId: parseInt(selectItem.value)
  };

  if (!emprestimoJSON.usuarioId || !emprestimoJSON.itemId) {
    alert("Por favor, selecione um usuário e um item.");
    return;
  }

  try {
    const resp = await fetch(API.emprestimos, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emprestimoJSON),
    });

    if (!resp.ok) {
      // Pega a mensagem de erro da nossa API (ex: "Usuário atingiu o limite")
      const erroTexto = await resp.text(); // RuntimeException joga texto, não JSON
      // Tenta extrair a mensagem do erro 500 do Spring
      let mensagem = erroTexto;
      try {
        const erroJson = JSON.parse(erroTexto);
        mensagem = erroJson.message;
      } catch(e) {
        // Se não for JSON, usa o texto puro (que deve ser a msg da RuntimeException)
        // Isso é uma gambiarra, mas funciona pra pegar nossa RuntimeException
        if (erroTexto.includes("java.lang.RuntimeException:")) {
            mensagem = erroTexto.split("java.lang.RuntimeException:")[1].split("\n")[0];
        }
      }
      throw new Error(mensagem);
    }
    
    const emprestimoFeito = await resp.json();
    
    // Adiciona o novo empréstimo na tabela de ativos (manualmente)
    const tr = document.createElement("tr");
    tr.id = `emprestimo-${emprestimoFeito.id}`; // Dá um ID para a linha
    tr.innerHTML = `
      <td>${emprestimoFeito.id}</td>
      <td>${emprestimoFeito.item.id} (${emprestimoFeito.item.titulo})</td>
      <td>${emprestimoFeito.usuario.id} (${emprestimoFeito.usuario.nome})</td>
      <td>${emprestimoFeito.dataEmprestimo}</td>
      <td>${emprestimoFeito.dataPrevistaDevolucao}</td>
      <td>
        <button class="danger" onclick="devolverItem(${emprestimoFeito.id})">↩️ Devolver</button>
      </td>
    `;
    tabelaEmprestimos.appendChild(tr);

    formEmprestimo.reset();
    carregarItens(); // Recarrega os itens (para atualizar o dropdown e a tabela de disponíveis)
    carregarUsuarios(); // Recarrega usuários (para atualizar multas, se houver)
    alert("Empréstimo realizado com sucesso!");

  } catch (err) {
      console.error("Erro ao realizar empréstimo:", err);
      alert(`Falha no Empréstimo: ${err.message}`);
      carregarEmprestimosAtivos(); // <-- adiciona aqui
    }
});


// --- 5. LÓGICA DE AÇÕES (DELETE / PUT / POST de Ação) ---

/** Deleta um ITEM do acervo */
async function deletarItem(id) {
  if (!confirm(`Deseja realmente excluir o item ${id} do acervo?`)) return;

  try {
    const resp = await fetch(`${API.itens}/${id}`, { method: "DELETE" });
    if (!resp.ok) throw new Error("Erro ao deletar item.");

    carregarTudo(); // Recarrega tudo
    alert("Item excluído com sucesso.");
  } catch (err) {
    console.error("Erro ao deletar item:", err);
    alert("Erro ao deletar item.");
  }
}

/** Devolve um item emprestado */
async function devolverItem(idEmprestimo) {
  if (!confirm(`Deseja confirmar a devolução deste item?`)) return;
  
  try {
    const resp = await fetch(`${API.emprestimos}/${idEmprestimo}/devolver`, {
      method: "POST"
    });

    if (!resp.ok) {
       const erro = await resp.json();
       throw new Error(erro.message || "Erro ao devolver item.");
    }
    
    const emprestimoFechado = await resp.json();
    
    // Remove a linha da tabela de "Empréstimos Ativos"
    const linhaDoEmprestimo = document.getElementById(`emprestimo-${idEmprestimo}`);
    if (linhaDoEmprestimo) {
      linhaDoEmprestimo.remove();
    }
    
    carregarItens(); // Recarrega os itens (agora ele está disponível)
    carregarUsuarios(); // Recarrega usuários (para atualizar saldo de multa)
    
    // Verifica se gerou multa
    const multaGerada = emprestimoFechado.usuario.multaPendente;
    alert("Item devolvido! Saldo de multa atualizado.");

  } catch (err) {
     console.error("Erro ao devolver item:", err);
     alert(`Erro: ${err.message}`);
  }
}

/** Aplica multa manualmente a um usuário */
async function aplicarMulta(usuarioId) {
  if (!confirm(`Deseja aplicar uma multa de R$ 10,00 ao usuário ${usuarioId}?`)) return;

  try {
    const resp = await fetch(`${API.usuarios}/${usuarioId}/multa`, {
      method: "POST"
    });

    if (!resp.ok) {
      const erro = await resp.text();
      throw new Error(erro || "Erro ao aplicar multa.");
    }

    alert("Multa aplicada com sucesso!");
    carregarUsuarios(); // Atualiza a tabela

  } catch (err) {
    console.error("Erro ao aplicar multa:", err);
    alert(`Erro: ${err.message}`);
  }
}

/** Retira multa manualmente de um usuário */
async function retirarMulta(usuarioId) {
  if (!confirm(`Deseja remover todas as multas do usuário ${usuarioId}?`)) return;

  try {
    const resp = await fetch(`${API.usuarios}/${usuarioId}/retirar-multa`, {
      method: "POST"
    });

    if (!resp.ok) {
      const erro = await resp.text();
      throw new Error(erro || "Erro ao retirar multa.");
    }

    alert("Multa removida com sucesso!");
    carregarUsuarios(); // Atualiza a tabela

  } catch (err) {
    console.error("Erro ao retirar multa:", err);
    alert(`Erro: ${err.message}`);
  }
}

// --- 6. LÓGICA DE UI (Interface do Usuário) ---

/** Ouve a mudança no dropdown de tipo de item */
itemTipoSelect.addEventListener("change", () => {
  const tipo = itemTipoSelect.value;

  if (tipo === "LIVRO") {
    campoLivro.classList.remove("hidden");
    campoPeriodico.classList.add("hidden");
  } else if (tipo === "PERIODICO") {
    campoLivro.classList.add("hidden");
    campoPeriodico.classList.remove("hidden");
  } else {
    campoLivro.classList.add("hidden");
    campoPeriodico.classList.add("hidden");
  }
});


// --- 7. INICIALIZAÇÃO ---
// Carrega todos os dados do backend assim que a página é aberta.
document.addEventListener("DOMContentLoaded", carregarTudo);