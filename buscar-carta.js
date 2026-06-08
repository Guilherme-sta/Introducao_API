function getByID(id) {
    return document.getElementById(id);
}

let botaoBuscar = getByID('botaoBuscar');
botaoBuscar.addEventListener('click', buscarCarta);

let botaoLimpar = getByID('botaoLimpar');
botaoLimpar.addEventListener('click', limparCampos);

function buscarCarta() {
    let nomeCard = getByID('nomeCard').value.trim();
    let resultado = getByID('resultado');

    if (nomeCard === '') {
        resultado.innerHTML = 'O contéudo do campo precisa estar preenchido para fazer a consulta.';

        setTimeout(function () {
            resultado.innerHTML = '';
        }, 3000);

        return;
    }

    let url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?name=' + encodeURIComponent(nomeCard);

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Carta não encontrada ou erro na requisição: ' + response.status);
            }
            return response.json();
        })
        .then(json => {
            let carta = json.data[0];
            let imagem = carta.card_images[0].image_url_small;
            let preco = carta.card_prices[0].tcgplayer_price;

            resultado.innerHTML = `
                <div class="card-resultado">
                    <img src="${imagem}" alt="${carta.name}">
                    <div class="card-info">
                        <p><strong>Nome:</strong> ${carta.name}</p>
                        <p><strong>Tipo:</strong> ${carta.type}</p>
                        <p><strong>Raça/Subtipo:</strong> ${carta.race}</p>
                        ${carta.atk !== undefined ? `<p><strong>ATK:</strong> ${carta.atk}</p>` : ''}
                        ${carta.def !== undefined ? `<p><strong>DEF:</strong> ${carta.def}</p>` : ''}
                        ${carta.level !== undefined ? `<p><strong>Nível:</strong> ${carta.level}</p>` : ''}
                        ${carta.attribute ? `<p><strong>Atributo:</strong> ${carta.attribute}</p>` : ''}
                        <p><strong>Preço (TCGPlayer):</strong> $${preco}</p>
                        <p><strong>Descrição:</strong> ${carta.desc}</p>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            resultado.innerHTML = 'Erro ao buscar carta: ' + error.message;
        });
}

function limparCampos() {
    let nomeCard = getByID('nomeCard');
    let resultado = getByID('resultado');

    nomeCard.value = '';
    resultado.innerHTML = '';
}
