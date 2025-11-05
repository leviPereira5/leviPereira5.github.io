
if (!localStorage.getItem("produtos-selecionados")) {
  localStorage.setItem("produtos-selecionados", JSON.stringify([]));
}


let todosOsProdutos = [];
let categoriaSelecionada = "";
let ordemSelecionada = "";
let textoPesquisa = "";


document.addEventListener("DOMContentLoaded", function() {
  carregarProdutosIniciais();

  const selectOrdenar = document.getElementById("ordenar");
  const inputPesquisa = document.getElementById("pesquisa");

  if (selectOrdenar) {
    selectOrdenar.addEventListener("change", function() {
      ordemSelecionada = selectOrdenar.value;
      atualizarListaFiltrada();
    });
  }

  if (inputPesquisa) {
    inputPesquisa.addEventListener("input", function() {
      textoPesquisa = inputPesquisa.value;
      atualizarListaFiltrada();
    });
  }

  const btnComprar = document.getElementById("comprar");
  const estudanteCheck = document.getElementById("estudante");
  const cupaoInput = document.getElementById("cupao");
  const respostaCompra = document.getElementById("resposta-compra");

  if (btnComprar) {
    btnComprar.addEventListener("click", function() {
      const estudante = estudanteCheck.checked;
      const cupao = cupaoInput.value.trim();

      const lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
      const produtosIds = lista.map(p => p.id);

      if (produtosIds.length === 0) {
        respostaCompra.textContent = "O cesto está vazio!";
        return;
      }

      fetch("https://deisishop.pythonanywhere.com/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: produtosIds,
          student: estudante,
          coupon: cupao
        })
      })
        .then(response => response.json().then(data => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
          if (ok) {
            respostaCompra.innerHTML = `
              Compra efetuada com sucesso!<br>
              <strong>Referência de pagamento:</strong> ${data.reference}<br>
              <strong>Total a pagar:</strong> €${data.total.toFixed(2)}
            `;
            localStorage.setItem("produtos-selecionados", JSON.stringify([]));
            atualizaCesto();
          } else {
            respostaCompra.textContent = `Erro: ${data.error || "Não foi possível concluir a compra."}`;
          }
        })
        .catch(() => {
          respostaCompra.textContent = "Erro de rede. Tenta novamente.";
        });
    });
  }

  atualizaCesto();
});

function carregarProdutosIniciais() {
  const container = document.getElementById("produtos");
  if (container) container.textContent = "A carregar produtos...";

  fetch("https://deisishop.pythonanywhere.com/products/")
    .then(resposta => {
      if (!resposta.ok) throw new Error("Erro ao carregar produtos");
      return resposta.json();
    })
    .then(produtos => {
      todosOsProdutos = produtos;
      carregarProdutos(todosOsProdutos);
      carregarCategorias();
    })
    .catch(erro => {
      console.error("Erro ao obter produtos:", erro);
      if (container) container.textContent = "Erro ao carregar produtos da loja.";
    });
}

function carregarCategorias() {
  const select = document.getElementById("categorias");

  fetch("https://deisishop.pythonanywhere.com/categories/")
    .then(resposta => {
      if (!resposta.ok) throw new Error("Erro ao carregar categorias");
      return resposta.json();
    })
    .then(categorias => {
      const opcaoTodas = document.createElement("option");
      opcaoTodas.value = "";
      opcaoTodas.textContent = "Todas as categorias";
      select.appendChild(opcaoTodas);

      categorias.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
      });

      select.addEventListener("change", function() {
        categoriaSelecionada = select.value;
        atualizarListaFiltrada();
      });
    })
    .catch(erro => {
      console.error("Erro ao obter categorias:", erro);
      select.innerHTML = "<option>Erro ao carregar categorias</option>";
    });
}



function carregarProdutos(produtos) {
  const container = document.getElementById("produtos");
  container.innerHTML = "";

  if (produtos.length === 0) {
    container.textContent = "Nenhum produto encontrado.";
    return;
  }

  produtos.forEach(produto => {
    const produtoElemento = criarProduto(produto);
    container.appendChild(produtoElemento);
  });
}

function criarProduto(produto) {
  const artigo = document.createElement("article");
  artigo.classList.add("produto");

  const img = document.createElement("img");
  img.src = produto.image;
  img.alt = produto.title;
  artigo.appendChild(img);

  const nome = document.createElement("h2");
  nome.textContent = produto.title;
  artigo.appendChild(nome);

  const descricao = document.createElement("p");
  descricao.textContent = produto.description;
  artigo.appendChild(descricao);

  const preco = document.createElement("span");
  preco.textContent = ` € ${produto.price.toFixed(2)}`;
  artigo.appendChild(preco);

  const botao = document.createElement("button");
  botao.textContent = "+ Adicionar ao cesto";
  artigo.appendChild(botao);

  botao.addEventListener("click", function() {
    const lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
    lista.push(produto);
    localStorage.setItem("produtos-selecionados", JSON.stringify(lista));
    atualizaCesto();
  });

  return artigo;
}

function criaProdutoCesto(produto) {
  const artigo = document.createElement("article");
  artigo.classList.add("produto-cesto");

  const img = document.createElement("img");
  img.src = produto.image;
  img.alt = produto.title;
  img.classList.add("img-cesto");
  artigo.appendChild(img);

  const nome = document.createElement("h3");
  nome.textContent = produto.title;
  artigo.appendChild(nome);

  const preco = document.createElement("span");
  preco.textContent = ` € ${produto.price.toFixed(2)}`;
  artigo.appendChild(preco);

  const btnRemover = document.createElement("button");
  btnRemover.textContent = "Remover";
  btnRemover.classList.add("remover");
  artigo.appendChild(btnRemover);

  btnRemover.addEventListener("click", function() {
    let lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
    const indice = lista.findIndex(p => p.id === produto.id);
    if (indice !== -1) {
      lista.splice(indice, 1);
      localStorage.setItem("produtos-selecionados", JSON.stringify(lista));
      atualizaCesto();
    }
  });

  return artigo;
}

function atualizaCesto() {
  const containerCesto = document.getElementById("produtos-selecionados");
  const totalElemento = document.getElementById("total");

  if (!containerCesto) return;

  containerCesto.innerHTML = "";

  const lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
  let total = 0;

  lista.forEach(produto => {
    const artigoCesto = criaProdutoCesto(produto);
    containerCesto.appendChild(artigoCesto);
    total += produto.price;
  });

  if (totalElemento) {
    totalElemento.textContent = ` Total:  € ${total.toFixed(2)}`;
  }
}


function aplicarOrdenacao(produtos) {
  if (ordemSelecionada === "asc") {
    return produtos.sort((a, b) => a.price - b.price);
  } else if (ordemSelecionada === "desc") {
    return produtos.sort((a, b) => b.price - a.price);
  }
  return produtos;
}

function atualizarListaFiltrada() {
  let filtrados = todosOsProdutos;

  if (categoriaSelecionada) {
    filtrados = filtrados.filter(p => p.category === categoriaSelecionada);
  }

  if (textoPesquisa.trim() !== "") {
    const pesquisaLower = textoPesquisa.toLowerCase();
    filtrados = filtrados.filter(p => p.title.toLowerCase().includes(pesquisaLower));
  }

  filtrados = aplicarOrdenacao(filtrados);
  carregarProdutos(filtrados);
}
