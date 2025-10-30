// --- Logo no início do script ---
if (!localStorage.getItem("produtos-selecionados")) {
  localStorage.setItem("produtos-selecionados", JSON.stringify([]));
}

function carregarProdutos(produtos) {
  let container = document.getElementById("produtos");

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
  preco.textContent = `R$ ${produto.price.toFixed(2)}`;
  artigo.appendChild(preco);

  // --- Botão Adicionar ao cesto ---
  const botao = document.createElement("button");
  botao.textContent = "+ Adicionar ao cesto";
  artigo.appendChild(botao);

  // --- Evento de clique no botão ---
  botao.addEventListener("click", () => {
    const lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
    lista.push(produto);
    localStorage.setItem("produtos-selecionados", JSON.stringify(lista));
    atualizaCesto(); // atualiza automaticamente o cesto
  });

  return artigo;
}


function criaProdutoCesto(produto) {
  const artigo = document.createElement("article");
  artigo.classList.add("produto-cesto");

  const nome = document.createElement("h3");
  nome.textContent = produto.title;
  artigo.appendChild(nome);

  const preco = document.createElement("span");
  preco.textContent = `R$ ${produto.price.toFixed(2)}`;
  artigo.appendChild(preco);

  // --- Botão Remover ---
  const btnRemover = document.createElement("button");
  btnRemover.textContent = "Remover";
  btnRemover.classList.add("remover");
  artigo.appendChild(btnRemover);

  // --- Evento para remover o produto ---
  btnRemover.addEventListener("click", () => {
    let lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];

    const indice = lista.findIndex(p => p.title === produto.title);

    if (indice !== -1) {
      lista.splice(indice, 1);
      localStorage.setItem("produtos-selecionados", JSON.stringify(lista));
      atualizaCesto();
    }
  });

  return artigo;
}

// --- Função que atualiza o DOM com os produtos no cesto ---
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

  // --- Atualiza o preço total ---
  if (totalElemento) {
    totalElemento.textContent = `💵 Total: R$ ${total.toFixed(2)}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarProdutos(produtos);
  atualizaCesto();
});
