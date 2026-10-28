//A. Estados/Variaveis

if(!localStorage.getItem("produtos-selecionados")){
    localStorage.setItem("produtos-selecionados", JSON.stringify([]));
}

//B. Funcions

function renderizarProdutos(produtos){
    const container = document.querySelector("#produtos");

    container.innerHTML = "<h2>Produtos</h2>";

    produtos.forEach(produto => {
        const meu_article_produto = criarProduto(produto);
        container.appendChild(meu_article_produto);
    });
}

function criarProduto(produto){
    const article_produto = document.createElement("article");

    const titulo = document.createElement("h3");
    titulo.textContent = produto.title;

    const image = document.createElement("img");
    image.src = produto.image;
    image.alt = produto.title;

    const descricao = document.createElement("p");
    descricao.textContent = produto.description;

    const preco = document.createElement("p");
    preco.textContent = produto.price + " €";

    const rating = document.createElement("p");
    rating.textContent = `Avaliação: ${produto.rating.rate} (${produto.rating.count} opiniões)`;

    const botao_adicionar = document.createElement("button");
    botao_adicionar.textContent = "Adicionar ao cesto";

    botao_adicionar.addEventListener("click", () => {
        const cesto_atual = JSON.parse(localStorage.getItem("produtos-selecionados"));
        cesto_atual.push(produto);
        localStorage.setItem("produtos-selecionados", JSON.stringify(cesto_atual));
        atualizaCesto();
    });


    article_produto.appendChild(titulo);
    article_produto.appendChild(image);
    article_produto.appendChild(descricao);
    article_produto.appendChild(preco);
    article_produto.appendChild(rating);
    article_produto.appendChild(botao_adicionar);

    return article_produto;
}

function criarProdutoCesto(produto, i){
    const article = document.createElement("article");

    const titulo = document.createElement("h3");
    titulo.textContent = produto.title;

    const preco = document.createElement("p");
    preco.textContent = produto.price + " €";

    const botao_remover = document.createElement("button");
    botao_remover.textContent = "Remover";

    botao_remover.addEventListener("click", () => {
        let cesto_atual = JSON.parse(localStorage.getItem("produtos-selecionados"));

        cesto_atual.splice(i, 1);

        localStorage.setItem("produtos-selecionados", JSON.stringify(cesto_atual));

        atualizaCesto();
    });

    article.appendChild(titulo);
    article.appendChild(preco);
    article.appendChild(botao_remover);

    return article;
}

function atualizaCesto(){
    const produto_selecionado = JSON.parse(localStorage.getItem("produtos-selecionados"));
    const container_cesto = document.querySelector("#cesto");

    container_cesto.innerHTML = "<h2>Cesto</h2>";

    let preco_total = 0;

    produto_selecionado.forEach((produto, i) => {
        const article_cesto = criarProdutoCesto(produto, i);
        container_cesto.appendChild(article_cesto);

        preco_total += produto.price;
    });

    const elementos_total = document.createElement("div");


    elementos_total.innerHTML = `<h3>Preço Total: ${preco_total} €</h3>`;
    container_cesto.appendChild(elementos_total);
}

//C. Event handlers
//D. Event Listeners

//E. Inicialização
renderizarProdutos(produtos);
atualizaCesto();
