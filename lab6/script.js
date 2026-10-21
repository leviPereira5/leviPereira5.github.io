const nodeInputNumero = document.querySelector(".input_numero");
const nodeInputSubmit = document.querySelector(".input_submit");
const nodeUlColecao = document.querySelector(".colecao ul");
const nodeSpanTotal = document.querySelector(".colecao span");


// parte dos repetidos
const nodeUlRepetidos = document.querySelector(".repetidos ul");
const nodeSpanRepetidos= document.querySelector(".repetidos span")

const colecao = [];
const repetidos = [];

const atualizarLista = (lista,ulCromos,spanTotal) => {

    ulCromos.innerHTML = ""; // aqui é para limpar o conteudo da lista ("o conteudo atual")

    lista.forEach(element => { // vou percorrer cada elemento e para cada um crio um li e o add ao dom dentro do ul
        const nodeLi = document.createElement("li");
        nodeLi.textContent = element; // ou seja para cada li vou ter um elemento
        ulCromos.append(nodeLi); // adiciono o meu novo li ao ul

    });

    spanTotal.textContent = lista.length; // Atualizar o contador
}

const guardaCarta = () => {
    const numero = Number(nodeInputNumero.value);

    if(nodeInputNumero.value !== ""){  // verifico se esta vazio

        if(colecao.includes(numero)){
            repetidos.push(numero);
            repetidos.sort((a, b) => a - b);
            atualizarLista(repetidos,nodeUlColecao,nodeSpanRepetidos);

        }else{
             colecao.push(numero); // caso n esteja ent guardo o numero na lista
             colecao.sort((a, b) => a - b); // ordenação para organizar do menor para o maior
             atualizarLista(colecao,nodeUlColecao,nodeSpanTotal);
        }

    }
}

const form = document.querySelector("form");

form.onsubmit = (event) => {
    event.preventDefault(); // serve para evitar que a pagina faça refresh
    guardaCarta();
}
