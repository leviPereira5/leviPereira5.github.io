if (!localStorage.getItem("produtos-selecionados")) {
    localStorage.setItem("produtos-selecionados", JSON.stringify([]));
}

let todosOsProdutos = [];

const urlBase = "https://deisishop.pw.deisi.ulusofona.pt";
const urlProdutos = `${urlBase}/products`;
const urlCategorias = `${urlBase}/categories`;
const urlCompra = `${urlBase}/buy`;

fetch(urlProdutos)
    .then(response => response.json())
    .then(produtos => {
        todosOsProdutos = produtos;
        ordenar();
        pesquisa();
        renderizarProdutos(produtos);
        atualizaCesto();
    })
    .catch(error => console.log(error));

fetch(urlCategorias)
    .then(response => response.json())
    .then(categorias => criarFiltroCategorias(categorias))
    .catch(error => console.log(error));

function criarFiltroCategorias(categorias) {
    const select = document.querySelector("#filtrar");

    select.innerHTML = `<option value="">Todas as categorias</option>`;

    categorias.forEach(categoria => {
        const option = document.createElement("option");
        option.value = categoria.name;
        option.textContent = categoria.name;
        select.appendChild(option);
    });

    select.addEventListener("change", evento => {
        const categoriaEscolhida = evento.target.value;

        if (categoriaEscolhida === "") {
            renderizarProdutos(todosOsProdutos);
        } else {
            const produtosFiltrados = [];

            for (let i = 0; i < todosOsProdutos.length; i++) {
                if (todosOsProdutos[i].category === categoriaEscolhida) {
                    produtosFiltrados.push(todosOsProdutos[i]);
                }
            }

            renderizarProdutos(produtosFiltrados);
        }
    });
}

function ordenar() {
    const select = document.querySelector("#ordenar");

    select.addEventListener("change", evento => {
        const criterio = evento.target.value;

        const produtosOrdenados = todosOsProdutos.slice();

        if (criterio === "crescente") {
            produtosOrdenados.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (criterio === "decrescente") {
            produtosOrdenados.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }

        renderizarProdutos(produtosOrdenados);
    });
}

function pesquisa() {
    const inputProcurar = document.querySelector("#procurar");

    inputProcurar.addEventListener("input", evento => {
        const textoPesquisado = evento.target.value.toLowerCase();

        const produtosFiltrados = [];

        for (let i = 0; i < todosOsProdutos.length; i++) {
            const tituloProduto = todosOsProdutos[i].title.toLowerCase();

            if (tituloProduto.includes(textoPesquisado)) {
                produtosFiltrados.push(todosOsProdutos[i]);
            }
        }

        renderizarProdutos(produtosFiltrados);
    });
}

function renderizarProdutos(produtos) {
    const container = document.querySelector("#produtos");

    container.innerHTML = "<h2>Produtos</h2>";

    produtos.forEach(produto => {
        container.appendChild(criarProduto(produto));
    });
}

function criarProduto(produto) {
    const article_produto = document.createElement("article");

    const titulo = document.createElement("h3");
    titulo.textContent = produto.title;

    const image = document.createElement("img");
    image.src = `${urlBase}${produto.image}`;
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

function criarProdutoCesto(produto, i) {
    const article = document.createElement("article");

    const titulo = document.createElement("h3");
    titulo.textContent = produto.title;

    const preco = document.createElement("p");
    preco.textContent = produto.price + " €";

    const image = document.createElement("img");
    image.src = `${urlBase}${produto.image}`;
    image.alt = produto.title;

    const botao_remover = document.createElement("button");
    botao_remover.textContent = "Remover";

    botao_remover.addEventListener("click", () => {
        const cesto_atual = JSON.parse(localStorage.getItem("produtos-selecionados"));
        cesto_atual.splice(i, 1);
        localStorage.setItem("produtos-selecionados", JSON.stringify(cesto_atual));
        atualizaCesto();
    });

    article.appendChild(image);
    article.appendChild(titulo);
    article.appendChild(preco);
    article.appendChild(botao_remover);

    return article;
}

function atualizaCesto() {
    const produtos_selecionados = JSON.parse(localStorage.getItem("produtos-selecionados"));
    const container_cesto = document.querySelector("#cesto");

    container_cesto.innerHTML = "<h2>Cesto</h2>";

    const lista = document.createElement("div");
    lista.classList.add("itens-cesto");

    let preco_total = 0;

    produtos_selecionados.forEach((produto, i) => {
        lista.appendChild(criarProdutoCesto(produto, i));
        preco_total += parseFloat(produto.price) || 0;
    });

    container_cesto.appendChild(lista);

    const elementos_total = document.createElement("div");
    elementos_total.innerHTML = `<h3>Preço Total: ${preco_total.toFixed(2)} €</h3>`;
    container_cesto.appendChild(elementos_total);
}

function configurarCheckout() {
    const botao_comprar = document.querySelector("#btn-comprar");

    if (!botao_comprar) {
        return;
    }

    botao_comprar.addEventListener("click", () => {
        const produtos_no_cesto = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
        const containerResultado = document.querySelector("#resultado-compra");

        if (produtos_no_cesto.length === 0) {
            containerResultado.innerHTML = `<h3>O cesto está vazio</h3>`;
            return;
        }

        const id_produtos = [];
        for (let i = 0; i < produtos_no_cesto.length; i++) {
            id_produtos.push(produtos_no_cesto[i].id);
        }

        const dadosCompra = {
            products: id_produtos,
            student: document.querySelector("#estudante").checked,
            coupon: document.querySelector("#cupao").value,
            name: document.querySelector("#nome").value
        };

        fetch(urlCompra, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosCompra)
        })
            .then(response => {
                return response.json().then(dados => ({ ok: response.ok, dados: dados }));
            })
            .then(({ ok, dados }) => {
                if (!ok) {
                    containerResultado.innerHTML = `<h3>${dados.error || dados.message || "Erro ao realizar a compra."}</h3>`;
                    return;
                }

                containerResultado.innerHTML = `
                    <h3>${dados.message || "Compra efetuada com sucesso!"}</h3>
                    <p>Total a pagar: ${dados.totalCost} €</p>
                    <p>Referência de pagamento: ${dados.reference}</p>
                `;

                localStorage.setItem("produtos-selecionados", JSON.stringify([]));
                atualizaCesto();
            })
            .catch(error => {
                console.log("Erro:", error);
                containerResultado.innerHTML = `<h3>Erro ao realizar a compra.</h3>`;
            });
    });
}

configurarCheckout();
