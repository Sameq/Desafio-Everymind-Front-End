document.addEventListener("DOMContentLoaded", function () {
  const button = document.querySelector("#botao");
  const editButton = document.querySelector("#botoes");
  const buttonOk = document.querySelector("#ok")
  const modal = document.querySelector("dialog");

  const botaoCancela = document.querySelector("#cancela");

  button.onclick = function () {
    modal.showModal();
  };

  botaoCancela.onclick = function () {
    modal.close();
  };

  buttonOk.onclick = function (){
    adicionarItem();
    modal.close();
  };

  });
  async function adicionarItem() {
    const nameInput = document.getElementById("nome_input").value;
    const codigoInput = document.getElementById("codigo_input").value;
    const descricaoInput = document.getElementById("descricao_input").value;
    const precoInput = document.getElementById("preco_input").value;

    const data = {
        name: nameInput,
        code: codigoInput,
        description: descricaoInput,
        price: precoInput
    };

    const response = await fetch("http://localhost:8080/product", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        mode: 'cors'
    });
    if (response.ok) {

      const novoProduto = await response.json();
      adicionarProdutoATabela(novoProduto);
    } else {
        console.error("Erro ao adicionar produto:", response.statusText);
    }
  }

  async function atualizarTabela(){
    console.log("entrou");
    const response = await fetch("http://localhost:8080/listProduct", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        mode: 'cors'
    });
    if (response.ok) {
      const produto = await response.json();
      console.log("produto", produto);

      produto.forEach(produto => {

        adicionarProdutoATabela(produto);
      });
    } else {
        console.error("Erro ao adicionar produto:", response.statusText);
    }
  }

  function adicionarProdutoATabela(novoProduto) {
    const tabelaBody = document.querySelector("#tabelaItens");
    const modalEdit = document.getElementById("dialogEdit");

    const row = tabelaBody.insertRow();

    const cellId = row.insertCell(0);
    const cellCodigo = row.insertCell(1);
    const cellDescricao = row.insertCell(2);
    const cellNome = row.insertCell(3);
    const cellPreco = row.insertCell(4);

    cellId.textContent = novoProduto.id;
    cellCodigo.textContent = novoProduto.code;
    cellDescricao.textContent = novoProduto.description;
    cellNome.textContent = novoProduto.name;
    cellPreco.textContent = novoProduto.price;

    const cellAcao = row.insertCell(5); 

    const btnEditar = document.createElement('button');
    btnEditar.className = 'botaoEditar';
    const imgEditar = document.createElement('img');
    imgEditar.src = '../public/imagem/editar.png';
    imgEditar.alt = 'Editar';

    btnEditar.addEventListener('click', () => {
      modalEdit.showModal();
      const btnCancelar = document.getElementById('cancelar');
      btnCancelar.addEventListener('click', () => {
          modalEdit.close();
      });
      const btnSalvar = document.getElementById('salvar');
      btnSalvar.addEventListener('click', () => {
        salvarAlteracoes(novoProduto.id);
        // removerLinhaTabela(novoProduto.id);
        // console.log(atualizarTabela());
        modalEdit.close();
      })
    });
    const btnExcluir = document.createElement('button');
    btnExcluir.className = 'botaoExcluir';
    const imgExcluir = document.createElement('img');
    imgExcluir.src = '../public/imagem/excluir.png';
    imgExcluir.alt = 'Excluir';

    btnExcluir.addEventListener('click', () => {
      excluirItem(novoProduto.id);
      removerLinhaTabela(novoProduto.id);
    });

    btnExcluir.appendChild(imgExcluir);
    btnEditar.appendChild(imgEditar);

    cellAcao.appendChild(btnEditar);
    cellAcao.appendChild(btnExcluir);

}
async function excluirItem(id) {
  try {
      const response = await fetch(`http://localhost:8080/${id}`, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
          },
          mode: 'cors'
      });

      if (response.ok) {
        console.log("Item excluído")
      } else {
          console.error("Erro ao excluir produto:", response.statusText);
      }
  } catch (error) {
      console.error("Erro durante a exclusão do produto:", error);
  }
}

function removerLinhaTabela(idproduto){
  const tabela = document.getElementById('tabelaItens'); 
  var idelemento = tabela.id;

  for (let i = 1; i < tabela.rows.length; i++) {
    var idDaLinha = tabela.rows[i].cells[0].innerHTML;
    if(idDaLinha == idproduto){
      var linhaExcluir = tabela.rows[i];
      tabela.deleteRow(linhaExcluir.rowIndex);
    }
  }
}

async function salvarAlteracoes(id){
  const nameInput = document.getElementById("nome_editar").value;
  const codigoInput = document.getElementById("codigo_editar").value;
  const descricaoInput = document.getElementById("descricao_editar").value;
  const precoInput = document.getElementById("preco_editar").value;

  const data = {
      name: nameInput,
      code: codigoInput,
      description: descricaoInput,
      price: precoInput
  };

  const response = await fetch(`http://localhost:8080/updateProduct/${id}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      mode: 'cors'
  });
  if(response.ok){
    removerLinhaTabela(id);
    atualizarTabela();
    console.log("200")
  } else {
    console.log("400")
  }

}
function adicionarUmProduto(novoProduto){
  const tabelaBody = document.querySelector("#tabelaItens");
  const row = tabelaBody.insertRow();

    const cellId = row.insertCell(0);
    const cellCodigo = row.insertCell(1);
    const cellDescricao = row.insertCell(2);
    const cellNome = row.insertCell(3);
    const cellPreco = row.insertCell(4);

    cellId.textContent = novoProduto.id;
    cellCodigo.textContent = novoProduto.code;
    cellDescricao.textContent = novoProduto.description;
    cellNome.textContent = novoProduto.name;
    cellPreco.textContent = novoProduto.price;
}
function limparTabela() {
  var tableBody = document.querySelector('#tabelaItens');
  if (tableBody && tableBody.rows.length > 0) {
    for (var i = tableBody.rows.length - 1; i >= 1; i--) {
      console.log("tabela:", tableBody);
        tableBody.deleteRow(i);
    }
  }
}

async function pesquisarItem(){
  const termoInput = document.getElementById("termo").value;
  console.log("termo:", termoInput);
  const response = await fetch(`http://localhost:8080/${termoInput}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    mode: 'cors'
  });
  if(response.ok){
    const data = await response.json();
    console.log("chegou: ", data.name);
    limparTabela();
    adicionarProdutoATabela(data);
  }
}
  