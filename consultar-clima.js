function getByID(id) {
    return document.getElementById(id);
}

let botaoBuscar = getByID('botaoBuscar');
botaoBuscar.addEventListener('click', buscarClima);

let botaoLimpar = getByID('botaoLimpar');
botaoLimpar.addEventListener('click', limparCampos);

function traduzirClima(codigo) {
    if (codigo === 0) {
        return 'Céu limpo';
    }
    if (codigo <= 2) { 
        return 'Parcialmente nublado';
    }
    if (codigo === 3) {
        return 'Nublado';
    }
    if (codigo <= 49) {
        return 'Neblina';
    }
    if (codigo <= 59) {
        return 'Chuvisco';
    }
    if (codigo <= 69) {
        return 'Chuva';
    }
    if (codigo <= 79) {
        return 'Neve';
    }
    if (codigo <= 82) {
        return 'Pancadas de chuva';
    }
    if (codigo <= 84) {
        return 'Pancadas intensas';
    }
    if (codigo <= 99) {
        return 'Tempestade';
    }
    return 'Indisponível';
}

function buscarClima() {
    let cidade = getByID('cidade').value.trim();
    let resultado = getByID('resultado');

    if (cidade === '') {
        resultado.innerHTML = 'O contéudo do campo precisa estar preenchido para fazer a consulta.';

        setTimeout(function () {
            resultado.innerHTML = '';
        }, 3000);

        return;
    }

    let urlGeo = 'https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(cidade) + '&count=1&language=pt&format=json';

    fetch(urlGeo)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na busca da cidade: ' + response.status);
            }
            return response.json();
        })
        .then(geoJson => {
            if (!geoJson.results || geoJson.results.length === 0) {
                resultado.innerHTML = 'Cidade não encontrada. Verifique o nome e tente novamente.';
                return;
            }

            let local = geoJson.results[0];
            let lat = local.latitude;
            let lon = local.longitude;
            let nomeCidade = local.name;
            let pais = local.country;

            let urlClima = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon +
                '&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m' +
                '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code' +
                '&timezone=America%2FSao_Paulo&forecast_days=3';

            return fetch(urlClima)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao buscar dados climáticos: ' + response.status);
                    }
                    return response.json();
                })
                .then(climaJson => {
                    let atual = climaJson.current;
                    let diario = climaJson.daily;

                    let previsoes = '';
                    for (let i = 0; i < diario.time.length; i++) {
                        let data = new Date(diario.time[i] + 'T12:00:00');
                        let dataFormatada = data.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
                        previsoes += `<p><strong>${dataFormatada}:</strong> ${traduzirClima(diario.weather_code[i])} — 
                            Máx ${diario.temperature_2m_max[i].toLocaleString('pt-BR')}°C / 
                            Mín ${diario.temperature_2m_min[i].toLocaleString('pt-BR')}°C — 
                            Chuva: ${diario.precipitation_sum[i].toLocaleString('pt-BR')} mm</p>`;
                    }

                    resultado.innerHTML = `
                        <p><strong>Cidade:</strong> ${nomeCidade}, ${pais}</p>
                        <p><strong>Temperatura atual:</strong> ${atual.temperature_2m.toLocaleString('pt-BR')}°C</p>
                        <p><strong>Sensação térmica:</strong> ${atual.apparent_temperature.toLocaleString('pt-BR')}°C</p>
                        <p><strong>Umidade:</strong> ${atual.relative_humidity_2m}%</p>
                        <p><strong>Precipitação:</strong> ${atual.precipitation.toLocaleString('pt-BR')} mm</p>
                        <p><strong>Vento:</strong> ${atual.wind_speed_10m.toLocaleString('pt-BR')} km/h — ${atual.wind_direction_10m}°</p>
                        <p><strong>Condição:</strong> ${traduzirClima(atual.weather_code)}</p>
                        <br>
                        <p><strong>Previsão para os próximos dias:</strong></p>
                        ${previsoes}
                    `;
                });
        })
        .catch(error => {
            resultado.innerHTML = 'Erro ao buscar clima: ' + error.message;
        });
}

function limparCampos() {
    let cidade = getByID('cidade');
    let resultado = getByID('resultado');

    cidade.value = '';
    resultado.innerHTML = '';
}
