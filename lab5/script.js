
const p_saudar = document.querySelector(".saudar p");

const p_pintar = document.querySelector(".pintar p");
const botao_cores = document.querySelectorAll(".pintar button");

const input_escrever = document.querySelector(".escrever input")
const cores = ["white", "red", "green", "blue", "yellow", "purple", "orange", "pink"];
const tamanhoTexto = input_escrever.value.length;
const corEscolhida = cores[tamanhoTexto % cores.length];

const select_cor = document.querySelector(".escolher-cor select");

const formulario = document.querySelector('#meu-formulario');
const p_resultado = document.querySelector('#mensagem-resultado');

const select_flex = document.querySelector("#select-flex");
const container_bolas = document.querySelector(".container-bolas");

const p_contar = document.querySelector(".contador p");
const botao_incrementa = document.querySelector(".incrementa");
const botao_decrementa = document.querySelector(".decrementa");
const botao_reseta = document.querySelector(".reset");

let temporizador = 0;
const p_temporizador = document.querySelector("#valor-tempo");


if(!localStorage.getItem("counter")){
    localStorage.setItem("counter",0);
}

let count = parseInt(localStorage.getItem("counter"));

p_contar.textContent = count;

p_saudar.addEventListener("mouseover", function saudar(){
    p_saudar.textContent = "Obrigado por passar o rato";
})

p_saudar.addEventListener("mouseout", function saudar_tira(){
    p_saudar.textContent = "1. Passa por aqui!";
})


botao_cores.forEach((botao) => {
    botao.addEventListener("click", function pintar(){
        p_pintar.style.color = botao.dataset.color;
    });
});



input_escrever.addEventListener("input", function escrever_input(){
    const tamanhoTexto = input_escrever.value.length;
    const corEscolhida = cores[tamanhoTexto % cores.length];
    input_escrever.style.backgroundColor = corEscolhida;
});


select_cor.addEventListener("change", function mudarCorInput(){
    document.body.style.backgroundColor = select_cor.value;
})




select_flex.addEventListener("change", function mudar() {
    container_bolas.style.flexDirection = this.value;
});


formulario.onsubmit = (e) => {
    e.preventDefault()

   const nome = formulario.nome.value;
   const idade = formulario.idade.value;

   p_resultado.textContent = `Olá, o ${nome} tem ${idade}!`;
};



botao_incrementa.addEventListener("click" , function contar(){
    count++;
    p_contar.textContent = count;
    localStorage.setItem('counter', count);
})

botao_decrementa.addEventListener("click", function decrementa(){
    count--;
    p_contar.textContent = count;
    localStorage.setItem('counter', count);
})

botao_reseta.addEventListener("click", function reset(){
    count = 0;
    p_contar.textContent = count;
    localStorage.setItem('counter',count);
})

function contarAutomaticamente() {
    temporizador++;
    p_temporizador.textContent = temporizador;
}
setInterval(contarAutomaticamente, 1000);

