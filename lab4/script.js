
const p_saudar = document.querySelector(".saudar p");

const p_pintar = document.querySelector(".pintar p")
const botaoRed = document.querySelector('.btn-red');
const botaoGreen = document.querySelector('.btn-green');
const botaoBlue = document.querySelector('.btn-blue');


const input_escrever = document.querySelector(".escrever input")
const cores = ["white", "red", "green", "blue", "yellow", "purple", "orange", "pink"];
const tamanhoTexto = input_escrever.value.length;
const corEscolhida = cores[tamanhoTexto % cores.length];

const input_cor = document.querySelector(".escolher-cor input");
const botao_cor = document.querySelector(".escolher-cor button");

let count = 0
const p_contar = document.querySelector(".contador p");
const botao_Contar = document.querySelector(".contar");

// parte de passar com o rato por cima
p_saudar.addEventListener("mouseover", function saudar(){
    p_saudar.textContent = "Obrigado por passar o rato";
})

p_saudar.addEventListener("mouseout", function saudar_tira(){
    p_saudar.textContent = "1. Passa por aqui!";
})



// parte de pintar o nome
botaoRed.addEventListener("click", function pintarVermelho(){
    p_pintar.style.color = "red"
})

botaoBlue.addEventListener("click", function pintarAzul(){
    p_pintar.style.color = "blue"
})

botaoGreen.addEventListener("click", function pintarAzul(){
    p_pintar.style.color = "green"
})



//parte de ir escrevendo
input_escrever.addEventListener("input", function escrever_input(){
    const tamanhoTexto = input_escrever.value.length;
    const corEscolhida = cores[tamanhoTexto % cores.length];
    input_escrever.style.backgroundColor = corEscolhida;
})


//parte de mudar o background de acordo com a cor
botao_cor.addEventListener("click", function mudarCorInput(){
    document.body.style.backgroundColor = input_cor.value;
})


//parte do contador
botao_Contar.addEventListener("click" , function contar(){
    count++
    p_contar.textContent = count;
})



