function getByID(id) {
    return document.getElementById(id);
}

let botaoConsultar = getByID('botaoConsultar');
botaoConsultar.addEventListener('click', consultarPreco);

function consultarPreco() {

    let moedaBase = getByID('moedaBase').value.toUpperCase();
    let moedaConversao = getByID('moedaConversao').value.toUpperCase();
    let resultado = getByID('resultado');

    if (moedaBase == '' || moedaConversao == '') {
        resultado.innerHTML = 'O contéudo dos dois campos precisa estar preenchido para fazer a conversão'

        setTimeout(function() {
            resultado.innerHTML = '';
        }, 3000)
    }
    else {
        
    //implemente a chamada à fetch API
    let symbol = moedaBase + moedaConversao
    let url = 'https://api.binance.com/api/v3/ticker/price?symbol=' + symbol;
    fetch(url)
        .then(response => {
            if(!response.ok) {
                throw new Error('Erro na resposta:' + response.status);
            }

            return response.json();
        })
        .then(json => {
            let preco = Number(json.price);
            let precoConvertido = preco.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});

            resultado.innerHTML =
            `<p>Moeda base: ${moedaBase}</p>
            <p>Valor em ${moedaConversao}: ${precoConvertido}</p>`;
        })
        .catch(error => {
            resultado.innerHTML = "Erro ao realizar conversão:" + error;
        })
    }
}

let botaoLimpar = getByID('botaoLimpar');
botaoLimpar.addEventListener('click', limparCampos);

function limparCampos() {
    
    let moedaBase = getByID('moedaBase');
    let moedaConversao = getByID('moedaConversao');
    let resultado = getByID('resultado');

    moedaBase.value = '';
    moedaConversao.value = '';
    resultado.innerHTML = '';
}

let botaoInverter = getByID('botaoInverter');
botaoInverter.addEventListener('click', inverterCampos);

function inverterCampos() {

    let moedaBase = getByID('moedaBase');
    let moedaConversao = getByID('moedaConversao');
    let temp = moedaBase.value;

    moedaBase.value = moedaConversao.value;
    moedaConversao.value = temp;
}