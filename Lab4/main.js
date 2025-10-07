
let contador = 0;

function incrementarContador() {
    contador++;
    document.getElementById('contador').textContent = contador;
    mostrarMensagem('Contador incrementado!');
}

function resetContador() {
    contador = 0;
    document.getElementById('contador').textContent = contador;
    mostrarMensagem('Contador reiniciado!');
}

function mostrarMensagem(texto) {
    document.getElementById('mensagem').textContent = texto;
}

function moverRato(event) {
    mostrarMensagem(`Coordenadas do rato: X=${event.offsetX}, Y=${event.offsetY}`);
}