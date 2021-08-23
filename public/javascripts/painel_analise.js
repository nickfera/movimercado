const analizarLogs = (logs) => {
    let data = new Date(logs[0].data*1000);
    let logsAnalizado = {
        data: data.toLocaleDateString(),
        entrou: 0,
        saiu: 0,
        atual: 0,
        max: 0,
        horarios: {},
        portas: {}
    };

    for (let h = 6; h <= 19; h++) {
        logsAnalizado.horarios[`${h}`] = {
            entrou: 0,
            saiu: 0,
            portas: {}
        };
        for (let p = 0; p < 6; p++) {
            logsAnalizado.portas[`${p}`] = {
                entrou: 0,
                saiu: 0
            };
            logsAnalizado.horarios[`${h}`].portas[`${p}`] = {
                entrou: 0,
                saiu: 0
            };
        }
    }

    for (let i = 0; i < logs.length; i++) {

        let d = new Date(logs[i].data*1000);
        let h = d.getHours();

        if (logs[i].acao) {
            logsAnalizado.atual++;
            if(logsAnalizado.atual > logsAnalizado.max)
                logsAnalizado.max = logsAnalizado.atual;
            logsAnalizado.entrou++;
            logsAnalizado.horarios[`${h}`].entrou++;
            logsAnalizado.portas[`${logs[i].porta}`].entrou++;
            logsAnalizado.horarios[`${h}`].portas[`${logs[i].porta}`].entrou++;
        } else if (!logs[i].acao) {
            logsAnalizado.atual--;
            logsAnalizado.saiu++;
            logsAnalizado.horarios[`${h}`].saiu++;
            logsAnalizado.portas[`${logs[i].porta}`].saiu++;
            logsAnalizado.horarios[`${h}`].portas[`${logs[i].porta}`].saiu++;
        }
    }
    return logsAnalizado;
};

const processarLogs = (logsAnalizado) => {
    let logsProcessado = {
        horarios: [
            [], []
        ],
        horariosPortasEntraram: [
            [], [], [], [], [], []
        ],
        horariosPortasSairam: [
            [], [], [], [], [], []
        ],
        portas: [
            [], []
        ],
        porta0: [
            [], []
        ],
        porta1: [
            [], []
        ],
        porta2: [
            [], []
        ],
        porta3: [
            [], []
        ],
        porta4: [
            [], []
        ],
        porta5: [
            [], []
        ],
    };

    for(const h in logsAnalizado.horarios) {
        logsProcessado.horarios[0].push(logsAnalizado.horarios[h].entrou);
        logsProcessado.horarios[1].push(logsAnalizado.horarios[h].saiu);
        for(const p in logsAnalizado.horarios[h].portas) {
            logsProcessado.horariosPortasEntraram[p].push(logsAnalizado.horarios[h].portas[p].entrou);
            logsProcessado.horariosPortasSairam[p].push(logsAnalizado.horarios[h].portas[p].saiu);
            logsProcessado[`porta${p}`][0].push(logsAnalizado.horarios[h].portas[p].entrou);
            logsProcessado[`porta${p}`][1].push(logsAnalizado.horarios[h].portas[p].saiu);
        }
            
    }
    for (const p in logsAnalizado.portas) {
        logsProcessado.portas[0].push(logsAnalizado.portas[p].entrou);
        logsProcessado.portas[1].push(logsAnalizado.portas[p].saiu);
    }
    return logsProcessado;
};

const gerarGraficos = (logsAnalizado, logsProcessado) => {
    document.getElementById('graficos-container').style.height = 'auto';
    document.getElementById('logs-apagar').style.display = 'inline-block';
    document.getElementById('logs-exportar').style.display = 'inline-block';
    document.getElementById('graficos-info-data').innerHTML = `Movimentação do dia: ${logsAnalizado.data}`;
    document.getElementById('graficos-info-num').innerHTML = `Total de clientes: ${logsAnalizado.entrou}<br>Máximo: ${logsAnalizado.max}`;
    
    Chart.defaults.global.legend.display = false;
    Chart.defaults.global.title.display = true;

    const ctx = (id) => {
        return document.getElementById(id).getContext('2d');
    };
    let graficos = [
        new Chart(ctx('grafico-horario-geral'), {
            type: 'line',
            data: {
                labels: legendaHorarios19,
                datasets: [{
                    label: 'Entraram',
                    data: logsProcessado.horarios[0],
                    backgroundColor: 'rgba(0, 200, 0, 1)',
                    borderColor: 'rgba(0, 200, 0, 1)',
                    fill: false
                }, {
                    label: 'Saíram',
                    data: logsProcessado.horarios[1],
                    backgroundColor: 'rgba(200, 0, 0, 1)',
                    borderColor: 'rgba(200, 0, 0, 1)',
                    fill: false
                }]
            }, options: {
                aspectRatio: 16/9,
                title: { text: 'Movimentação de clientes por horário' }
            }
        }),
        new Chart(ctx('grafico-horario-portas-entraram'), {
            type: 'line',
            data: {
                labels: legendaHorarios19,
                datasets: [{
                    label: 'Entrada Azul (Patio I)',
                    data: logsProcessado.horariosPortasEntraram[0],
                    backgroundColor: 'rgba(46, 58, 128, 1)',
                    borderColor: 'rgba(46, 58, 128, 1)',
                    fill: false
                }, {
                    label: 'Entrada Vermelha (Patio II)',
                    data: logsProcessado.horariosPortasEntraram[1],
                    backgroundColor: 'rgba(196, 20, 34, 1)',
                    borderColor: 'rgba(196, 20, 34, 1)',
                    fill: false
                }, {
                    label: 'Entrada Verde (R. Corrêa Neto)',
                    data: logsProcessado.horariosPortasEntraram[2],
                    backgroundColor: 'rgba(39, 172, 54, 1)',
                    borderColor: 'rgba(39, 172, 54, 1)',
                    fill: false
                }, {
                    label: 'Entrada R. Pernambuco',
                    data: logsProcessado.horariosPortasEntraram[3],
                    backgroundColor: 'rgba(255, 221, 55, 1)',
                    borderColor: 'rgba(255, 221, 55, 1)',
                    fill: false
                }, {
                    label: 'Entrada Púrpura (R. Santa Catarina)',
                    data: logsProcessado.horariosPortasEntraram[4],
                    backgroundColor: 'rgba(186, 57, 223, 1)',
                    borderColor: 'rgba(186, 57, 223, 1)',
                    fill: false
                }, {
                    label: 'Entrada Piso Superior',
                    data: logsProcessado.horariosPortasEntraram[5],
                    backgroundColor: 'rgba(101, 53, 21, 1)',
                    borderColor: 'rgba(101, 53, 21, 1)',
                    fill: false
                }]
            }, options: {
                aspectRatio: 16/9,
                title: { text: 'Clientes que entraram, por porta' }
            }
        }),
        new Chart(ctx('grafico-horario-portas-sairam'), {
            type: 'line',
            data: {
                labels: legendaHorarios19,
                datasets: [{
                    label: 'Entrada Azul (Patio I)',
                    data: logsProcessado.horariosPortasSairam[0],
                    backgroundColor: 'rgba(46, 58, 128, 1)',
                    borderColor: 'rgba(46, 58, 128, 1)',
                    fill: false
                }, {
                    label: 'Entrada Vermelha (Patio II)',
                    data: logsProcessado.horariosPortasSairam[1],
                    backgroundColor: 'rgba(196, 20, 34, 1)',
                    borderColor: 'rgba(196, 20, 34, 1)',
                    fill: false
                }, {
                    label: 'Entrada Verde (R. Corrêa Neto)',
                    data: logsProcessado.horariosPortasSairam[2],
                    backgroundColor: 'rgba(39, 172, 54, 1)',
                    borderColor: 'rgba(39, 172, 54, 1)',
                    fill: false
                }, {
                    label: 'Entrada R. Pernambuco',
                    data: logsProcessado.horariosPortasSairam[3],
                    backgroundColor: 'rgba(255, 221, 55, 1)',
                    borderColor: 'rgba(255, 221, 55, 1)',
                    fill: false
                }, {
                    label: 'Entrada Púrpura (R. Santa Catarina)',
                    data: logsProcessado.horariosPortasSairam[4],
                    backgroundColor: 'rgba(186, 57, 223, 1)',
                    borderColor: 'rgba(186, 57, 223, 1)',
                    fill: false
                }, {
                    label: 'Entrada Piso Superior',
                    data: logsProcessado.horariosPortasSairam[5],
                    backgroundColor: 'rgba(101, 53, 21, 1)',
                    borderColor: 'rgba(101, 53, 21, 1)',
                    fill: false
                }]
            }, options: {
                aspectRatio: 16/9,
                title: { text: 'Clientes que saíram, por porta' }
            }
        }),
        new Chart(ctx('grafico-portas-entraram'), {
            type: 'pie',
            data: {
                datasets: [{
                    data: logsProcessado.portas[0],
                    backgroundColor: [
                        'rgba(46, 58, 128, 1)',
                        'rgba(196, 20, 34, 1)',
                        'rgba(39, 172, 54, 1)',
                        'rgba(255, 221, 55, 1)',
                        'rgba(186, 57, 223, 1)',
                        'rgba(101, 53, 21, 1)'
                    ]
                }],
                labels: [
                    'Entrada Azul (Patio I)',
                    'Entrada Vermelha (Patio II)',
                    'Entrada Verde (R. Corrêa Neto)',
                    'Entrada R. Pernambuco',
                    'Entrada Púrpura (R. Santa Catarina)',
                    'Entrada Piso Superior'
                ]
            }, options: {
                aspectRatio: 1.5,
                title: { text: 'As portas que os clientes entraram' }
            }
        }),
        new Chart(ctx('grafico-portas-sairam'), {
            type: 'pie',
            data: {
                datasets: [{
                    data: logsProcessado.portas[1],
                    backgroundColor: [
                        'rgba(46, 58, 128, 1)',
                        'rgba(196, 20, 34, 1)',
                        'rgba(39, 172, 54, 1)',
                        'rgba(255, 221, 55, 1)',
                        'rgba(186, 57, 223, 1)',
                        'rgba(101, 53, 21, 1)'
                    ]
                }],
                labels: [
                    'Entrada Azul (Patio I)',
                    'Entrada Vermelha (Patio II)',
                    'Entrada Verde (R. Corrêa Neto)',
                    'Entrada R. Pernambuco',
                    'Entrada Púrpura (R. Santa Catarina)',
                    'Entrada Piso Superior'
                ]
            }, options: {
                aspectRatio: 1.5,
                title: { text: 'As portas que os clientes saíram' }
            }
        }),
        new Chart(ctx('grafico-porta0'), {
            type: 'line',
            data: {
                labels: legendaHorarios19,
                datasets: [{
                    label: 'Entraram',
                    data: logsProcessado.porta0[0],
                    backgroundColor: 'rgba(46, 58, 128, 1)',
                    borderColor: 'rgba(46, 58, 128, 1)',
                    fill: false
                }, {
                    label: 'Saíram',
                    data: logsProcessado.porta0[1],
                    backgroundColor: 'rgba(46, 58, 128, 1)',
                    borderColor: 'rgba(46, 58, 128, 1)',
                    borderDash: [5, 10],
                    fill: false
                }]
            }, options: {
                aspectRatio: 16/9,
                title: { text: 'Movimentação pela Entrada Azul (Patio I)' }
            }
        }),
        new Chart(ctx('grafico-porta1'), {
            type: 'line',
            data: {
                labels: legendaHorarios19,
                datasets: [{
                    label: 'Entraram',
                    data: logsProcessado.porta1[0],
                    backgroundColor: 'rgba(196, 20, 34, 1)',
                    borderColor: 'rgba(196, 20, 34, 1)',
                    fill: false
                }, {
                    label: 'Saíram',
                    data: logsProcessado.porta1[1],
                    backgroundColor: 'rgba(196, 20, 34, 1)',
                    borderColor: 'rgba(196, 20, 34, 1)',
                    borderDash: [5, 10],
                    fill: false
                }]
            }, options: {
                aspectRatio: 16/9,
                title: { text: 'Movimentação pela Entrada Vermelha (Patio II)' }
            }
        }),
        new Chart(ctx('grafico-porta2'), {
            type: 'line',
            data: {
                labels: legendaHorarios19,
                datasets: [{
                    label: 'Entraram',
                    data: logsProcessado.porta2[0],
                    backgroundColor: 'rgba(39, 172, 54, 1)',
                    borderColor: 'rgba(39, 172, 54, 1)',
                    fill: false
                }, {
                    label: 'Saíram',
                    data: logsProcessado.porta2[1],
                    backgroundColor: 'rgba(39, 172, 54, 1)',
                    borderColor: 'rgba(39, 172, 54, 1)',
                    borderDash: [5, 10],
                    fill: false
                }]
            }, options: {
                aspectRatio: 16/9,
                title: { text: 'Movimentação pela Entrada Verde (R. Corrêa Neto)' }
            }
        }),
        new Chart(ctx('grafico-porta3'), {
            type: 'line',
            data: {
                labels: legendaHorarios19,
                datasets: [{
                    label: 'Entraram',
                    data: logsProcessado.porta3[0],
                    backgroundColor: 'rgba(255, 221, 55, 1)',
                    borderColor: 'rgba(255, 221, 55, 1)',
                    fill: false
                }, {
                    label: 'Saíram',
                    data: logsProcessado.porta3[1],
                    backgroundColor: 'rgba(255, 221, 55, 1)',
                    borderColor: 'rgba(255, 221, 55, 1)',
                    borderDash: [5, 10],
                    fill: false
                }]
            }, options: {
                aspectRatio: 16/9,
                title: { text: 'Movimentação pela Entrada R. Pernambuco' }
            }
        }),
        new Chart(ctx('grafico-porta4'), {
            type: 'line',
            data: {
                labels: legendaHorarios19,
                datasets: [{
                    label: 'Entraram',
                    data: logsProcessado.porta4[0],
                    backgroundColor: 'rgba(186, 57, 223, 1)',
                    borderColor: 'rgba(186, 57, 223, 1)',
                    fill: false
                }, {
                    label: 'Saíram',
                    data: logsProcessado.porta4[1],
                    backgroundColor: 'rgba(186, 57, 223, 1)',
                    borderColor: 'rgba(186, 57, 223, 1)',
                    borderDash: [5, 10],
                    fill: false
                }]
            }, options: {
                aspectRatio: 16/9,
                title: { text: 'Movimentação pela Entrada Púrpura (R. Santa Catarina)' }
            }
        }),
        new Chart(ctx('grafico-porta5'), {
            type: 'line',
            data: {
                labels: legendaHorarios19,
                datasets: [{
                    label: 'Entraram',
                    data: logsProcessado.porta5[0],
                    backgroundColor: 'rgba(101, 53, 21, 1)',
                    borderColor: 'rgba(101, 53, 21, 1)',
                    fill: false
                }, {
                    label: 'Saíram',
                    data: logsProcessado.porta5[1],
                    backgroundColor: 'rgba(101, 53, 21, 1)',
                    borderColor: 'rgba(101, 53, 21, 1)',
                    borderDash: [5, 10],
                    fill: false
                }]
            }, options: {
                aspectRatio: 16/9,
                title: { text: 'Movimentação pela Entrada Piso Superior' }
            }
        })
    ];

    return graficos;
};

const limparGraficos = () => {
    document.getElementById('graficos-container').style.height = '0px';
    document.getElementById('logs-apagar').style.display = 'none';
    document.getElementById('logs-exportar').style.display = 'none';
    if(graficosLog) {
        for(let i = 0; i < graficosLog.length; i++)
            graficosLog[i].destroy();
    }
};

const exportarLogsAnalizado = logsAnalizado => {
    let dataStr = JSON.stringify(logsAnalizado);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    let exportFileDefaultName = `log-mov-${logsAnalizado.data}.json`;
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
};

const legendaHorarios18 = ['6h', '7h','8h','9h','10h','11h','12h','13h','14h','15h','16h','17h','18h'];
const legendaHorarios19 = ['6h', '7h','8h','9h','10h','11h','12h','13h','14h','15h','16h','17h','18h','19h'];
const legendaPortas = ['0','1','2','3','4','5'];

let logA, logP, graficosLog, dataLog;

window.addEventListener('load', (e) => {
    e.preventDefault();

    limparGraficos();

    let dataInp = document.getElementById('data');
    let dataHoje = new Date();
    dataHoje = `${dataHoje.getFullYear()}-${(`0`+(dataHoje.getMonth()+1)).slice(-2)}-${(`0`+dataHoje.getDate()).slice(-2)}`;
    dataInp.value = dataHoje;
    dataInp.max = dataHoje;

    document.getElementById('logs-procurar').addEventListener('click', async e => {
        e.preventDefault();
        let d = new Date( (parseInt(dataInp.value.substr(0, 4))), (parseInt(dataInp.value.substr(5, 2))-1), (parseInt(dataInp.value.substr(8, 2))) );
        let dSegundos = Math.floor(d.getTime() / 1000);
        let data = {
            d: dSegundos,
        };
        await fetch('/painel/fetch-log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
            body: JSON.stringify(data)
        }).then(res => res.json())
        .then(res => {
            if(res.log.length > 0) {
                limparGraficos();
                dataLog = dSegundos;
                logA = analizarLogs(res.log);
                logP = processarLogs(logA);
                graficosLog = gerarGraficos(logA, logP);
                insMsg('sucesso', 'Registros de movimentação abertos com sucesso');
            }
            else
                insMsg('erro', 'Não existe movimentação salvo nesse dia no banco de dados');
        });
    });

    document.getElementById('logs-abrir').addEventListener('input', async e => {
        e.preventDefault();
        let arquivo = document.getElementById('logs-abrir').files[0];
        let leitor = new FileReader();
        leitor.readAsText(arquivo);
        leitor.onload = () => {
            logA = JSON.parse(leitor.result);
            logP = processarLogs(logA);
            graficosLog = gerarGraficos(logA, logP);
            insMsg('sucesso', `Registros de movimentação do arquivo ${arquivo.name} abertos com sucesso`);
        };
        leitor.onerror = () => {
            console.log(leitor.error);
        }
    });

    document.getElementById('logs-apagar').addEventListener('click', async e => {
        e.preventDefault();
        if(dataLog) {
            let confirmar = window.confirm(`Tem certeza que quer apagar os registros de movimentação do dia ${logA.data}? Não esquece de salvar antes!!!`);
            if(confirmar) {
                let data = { d: dataLog };
                await fetch('/painel/delete-log', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                        },
                    body: JSON.stringify(data)
                }).then(res => res.json())
                .then(res => {
                    limparGraficos();
                    insMsg('sucesso', `Registros apagados!`)
                });
            }
        }
    });

    document.getElementById('logs-exportar').addEventListener('click', async e => {
        e.preventDefault();
        exportarLogsAnalizado(logA);
    });
});