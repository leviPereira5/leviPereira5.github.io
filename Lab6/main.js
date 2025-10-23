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

  return artigo;
}

document.addEventListener("DOMContentLoaded", () => {
  carregarProdutos(produtos);
});
