function barraProgressoCircular(canvasSelector, r, niveis, cores) {
    let canvas = document.querySelector(canvasSelector);
    let c = canvas.getContext('2d');

    c.beginPath();
    c.lineWidth = 20;
    c.strokeStyle = '#999';
    c.textAlign = 'center';
    c.font = 'bold 80px monospace';
    c.fillStyle = 'rgb(34, 34, 34)'
    c.arc(r, r, r-c.lineWidth, 1.5*Math.PI, 3.5*Math.PI);
    c.stroke();

    this.atualizar = (n) => {
        this.n = n;
        c.clearRect(0, 0, r*2, r*2);
        c.beginPath();
        c.strokeStyle = '#999';
        c.arc(r, r, r-c.lineWidth, 1.5*Math.PI, 3.5*Math.PI);
        c.stroke();
        c.beginPath();
        if(n >= niveis[4]) { c.strokeStyle = cores[4]; }
        else if(n >= niveis[3]) { c.strokeStyle = cores[3]; }
        else if(n >= niveis[2]) { c.strokeStyle = cores[2]; }
        else if(n >= niveis[1]) { c.strokeStyle = cores[1];}
        else { c.strokeStyle = cores[0]; }
        let porcento = n/niveis[4];
        if(porcento > 1) porcento = 1;
        c.arc(r, r, r-c.lineWidth, 1.5*Math.PI, ((porcento*2)+1.5)*Math.PI);
        c.stroke();
        c.fillText(n, r, r+30);
    };
};

let barraProgresso = null;

window.addEventListener("DOMContentLoaded", () => {
    const contador = document.getElementById('contador');
    const contadorEntrada = document.getElementById('contador-entrada');
    const contadorMaximo = document.querySelector('#contador b');
    const btnAdd = document.getElementById('btn-add');
    const btnSub = document.getElementById('btn-sub');

    let nMax, nAlertaAlto, nAlertaMedio, nAlertaBaixo;

    fetch('/app-config')
        .then(res => res.json())
        .then(data => {
            nMax = data.nMax;
            nAlertaAlto = data.nAlertaAlto;
            nAlertaMedio = data.nAlertaMedio;
            nAlertaBaixo = data.nAlertaBaixo;

            barraProgresso = new barraProgressoCircular('#contador canvas', 144,
                [0, nAlertaBaixo, nAlertaMedio, nAlertaAlto, nMax],
                ['green', 'rgb(255, 136, 0)', 'rgb(255, 94, 0)', 'rgb(255, 72, 0)', 'red']);

            contadorMaximo.innerText = `MAX: ${nMax}`;

            const socket = io();
            socket.on('atualizar contador', (n) => {
                barraProgresso.atualizar(n);
            });
            contador.classList.remove('carregando');
            contadorEntrada.addEventListener('change', (e) => {
                e.preventDefault();
                if(contadorEntrada.value != "")
                    (contadorEntrada.classList.contains('erro') ? contadorEntrada.classList.remove('erro') : '')
            });
            btnAdd.addEventListener('click', (e) => {
                e.preventDefault();
                if(contadorEntrada.value == "") {
                    contadorEntrada.classList.add('erro');
                } else {
                    socket.emit('add contador', parseInt(contadorEntrada.value));
                }
            });
            btnSub.addEventListener('click', (e) => {
                e.preventDefault();
                if(contadorEntrada.value == "") {
                    contadorEntrada.classList.add('erro');
                } else {
                    if(barraProgresso.n > 0) {
                        socket.emit('sub contador', parseInt(contadorEntrada.value));
                    }
                }
            });
            document.addEventListener('visibilitychange', () => {
                if(document.visibilityState === 'visible') {
                    socket.emit('solicitar atualizacao');
                }
            });
        });
});