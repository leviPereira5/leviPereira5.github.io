const nodeInputNumero = document.querySelector(".input_numero");
const nodeInputSubmit = document.querySelector(".input_submit");
const nodeUlColecao = document.querySelector(".colecao ul");
const nodeSpanTotal = document.querySelector(".colecao span");


// parte dos repetidos
const nodeUlRepetidos = document.querySelector(".repetidos ul");
const nodeSpanRepetidos= document.querySelector(".repetidos span")

// local Storage
if (!localStorage.getItem('colecao')) {
    localStorage.setItem('colecao', '[]');
}

if (!localStorage.getItem('repetidos')) {
    localStorage.setItem('repetidos', '[]');
}

const colecao = JSON.parse(localStorage.getItem("colecao"));
const repetidos = JSON.parse(localStorage.getItem("repetidos"));

function atualizarLista(lista,ulCromos,spanTotal) {

    ulCromos.innerHTML = ""; // aqui é para limpar o conteudo da lista ("o conteudo atual")

    lista.forEach(function(element, i) { // vou percorrer cada elemento e para cada um crio um li e o add ao dom dentro do ul
        const nodeLi = document.createElement("li"); // crio um elemento li para cada um deles

        if(ulCromos === nodeUlRepetidos){
            nodeLi.innerHTML = `${element} <button>Eliminar</button>`; // criar o botao ao lado do meu numero
            nodeLi.querySelector('button').onclick = function() {
                apagarRepetido(i);
            }
        }else{
            nodeLi.textContent = element; // ou seja para cada li vou ter um elemento

        }
         ulCromos.append(nodeLi); // adiciono o meu novo li ao ul

    });

    spanTotal.textContent = lista.length; // Atualizar o contador
}

function apagarRepetido(i) { // funcao auxiliar para apagar o numero repetido quando crio o botao no meu dom ao lado do numero
    repetidos.splice(i, 1);
    atualizarLista(repetidos, nodeUlRepetidos, nodeSpanRepetidos);
    localStorage.setItem("repetidos", JSON.stringify(repetidos));
}

function guardaCarta() {
    const numero = Number(nodeInputNumero.value);

    if(nodeInputNumero.value !== ""){  // verifico se esta vazio

        if(colecao.includes(numero)){
            repetidos.push(numero);
            repetidos.sort((a, b) => a - b);
            atualizarLista(repetidos,nodeUlRepetidos,nodeSpanRepetidos);
            localStorage.setItem("repetidos", JSON.stringify(repetidos));

        }else{
             colecao.push(numero); // caso n esteja ent guardo o numero na lista
             colecao.sort((a, b) => a - b); // ordenação para organizar do menor para o maior
             atualizarLista(colecao,nodeUlColecao,nodeSpanTotal);
            localStorage.setItem("colecao", JSON.stringify(colecao));
        }

    }
}

atualizarLista(colecao, nodeUlColecao, nodeSpanTotal);
atualizarLista(repetidos, nodeUlRepetidos, nodeSpanRepetidos);

const form = document.querySelector("form");

form.onsubmit = (event) => {
    event.preventDefault(); // serve para evitar que a pagina faça refresh
    guardaCarta();
}
