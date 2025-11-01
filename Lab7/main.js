// --- Inicialização do localStorage ---
if (!localStorage.getItem("produtos-selecionados")) {
  localStorage.setItem("produtos-selecionados", JSON.stringify([]));
}

let todosOsProdutos = [];        // Todos os produtos da API
let categoriaSelecionada = "";   // Categoria atual
let ordemSelecionada = "";       // Ordenação atual
let textoPesquisa = "";          // Texto da pesquisa atual

// --- Função para carregar produtos no DOM ---
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

// --- Cria o HTML de um produto ---
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

  botao.addEventListener("click", () => {
    const lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
    lista.push(produto);
    localStorage.setItem("produtos-selecionados", JSON.stringify(lista));
    atualizaCesto();
  });

  return artigo;
}

// --- Funções do cesto ---
function criaProdutoCesto(produto) {
  const artigo = document.createElement("article");
  artigo.classList.add("produto-cesto");

  // --- Imagem do produto ---
  const img = document.createElement("img");
  img.src = produto.image;
  img.alt = produto.title;
  img.classList.add("img-cesto");
  artigo.appendChild(img);

  // --- Nome do produto ---
  const nome = document.createElement("h3");
  nome.textContent = produto.title;
  artigo.appendChild(nome);

  // --- Preço ---
  const preco = document.createElement("span");
  preco.textContent = ` € ${produto.price.toFixed(2)}`;
  artigo.appendChild(preco);

  // --- Botão remover ---
  const btnRemover = document.createElement("button");
  btnRemover.textContent = "Remover";
  btnRemover.classList.add("remover");
  artigo.appendChild(btnRemover);

  btnRemover.addEventListener("click", () => {
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

  if (!containerCesto){
    return;
  }

  containerCesto.innerHTML = "";
  
  const lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];

  let total = 0;

  lista.forEach(produto => {
    const artigoCesto = criaProdutoCesto(produto);
    containerCesto.appendChild(artigoCesto);
    total += produto.price;

  }
);

  if (totalElemento) {
    totalElemento.textContent = ` Total:  € ${total.toFixed(2)}`;
  }
}

// --- Carregar categorias da API ---
async function carregarCategorias() {
  const select = document.getElementById("categorias");
  try {
    const resposta = await fetch("https://deisishop.pythonanywhere.com/categories/");
    if (!resposta.ok) throw new Error("Erro ao carregar categorias");

    const categorias = await resposta.json();

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

    select.addEventListener("change", () => {
      categoriaSelecionada = select.value;
      atualizarListaFiltrada();
    });
  } catch (erro) {
    console.error("Erro ao obter categorias:", erro);
    select.innerHTML = "<option>Erro ao carregar categorias</option>";
  }
}

// --- Ordenação ---
function aplicarOrdenacao(produtos) {
  if (ordemSelecionada === "asc") {
    return produtos.sort((a, b) => a.price - b.price);
  } else if (ordemSelecionada === "desc") {
    return produtos.sort((a, b) => b.price - a.price);
  }
  return produtos;
}

// --- Filtrar e atualizar lista ---
function atualizarListaFiltrada() {
  let filtrados = todosOsProdutos;

  // Filtro por categoria
  if (categoriaSelecionada) {
    filtrados = filtrados.filter(p => p.category === categoriaSelecionada);
  }

  // Filtro por pesquisa (case insensitive)
  if (textoPesquisa.trim() !== "") {
    const pesquisaLower = textoPesquisa.toLowerCase();
    filtrados = filtrados.filter(p => p.title.toLowerCase().includes(pesquisaLower));
  }

  // Ordenar
  filtrados = aplicarOrdenacao(filtrados);

  // Mostrar no ecrã
  carregarProdutos(filtrados);
}

// --- Quando a página carrega ---
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const resposta = await fetch("https://deisishop.pythonanywhere.com/products/");
    if (!resposta.ok) throw new Error("Erro ao carregar produtos");
    todosOsProdutos = await resposta.json();

    carregarProdutos(todosOsProdutos);
    await carregarCategorias();

    // Ordenação
    const selectOrdenar = document.getElementById("ordenar");
    selectOrdenar.addEventListener("change", () => {
      ordemSelecionada = selectOrdenar.value;
      atualizarListaFiltrada();
    });

    // Pesquisa em tempo real
    const inputPesquisa = document.getElementById("pesquisa");
    inputPesquisa.addEventListener("input", () => {
      textoPesquisa = inputPesquisa.value;
      atualizarListaFiltrada();
    });

  } catch (erro) {
    console.error("Erro ao obter produtos:", erro);
    const container = document.getElementById("produtos");
    container.textContent = "Erro ao carregar produtos da loja.";
  }


const btnComprar = document.getElementById("comprar");
const estudanteCheck = document.getElementById("estudante");
const cupaoInput = document.getElementById("cupao");
const respostaCompra = document.getElementById("resposta-compra");

btnComprar.addEventListener("click", async () => {
  const estudante = estudanteCheck.checked;
  const cupao = cupaoInput.value.trim();

  // Pegar produtos do cesto (podes adaptar se tiver outro array)
  const produtosIds = cesto.map(p => p.id);

  if (produtosIds.length === 0) {
    respostaCompra.textContent = "O cesto está vazio!";
    return;
  }

  try {
    const response = await fetch("https://deisishop.pythonanywhere.com/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        products: produtosIds,
        student: estudante,
        coupon: cupao
      })
    });

    const data = await response.json();

    if (response.ok) {
      respostaCompra.innerHTML = `
        ✅ Compra efetuada com sucesso!<br>
        <strong>Referência de pagamento:</strong> ${data.reference}<br>
        <strong>Total a pagar:</strong> €${data.total.toFixed(2)}
      `;
    } else {
      respostaCompra.textContent = `Erro: ${data.error || 'Não foi possível concluir a compra.'}`;
    }
  } catch (err) {
    respostaCompra.textContent = "Erro de rede. Tenta novamente.";
  }
});

  atualizaCesto();
});
