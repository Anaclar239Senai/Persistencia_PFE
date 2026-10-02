/* ==========================================
   ELEMENTOS DA PÁGINA
========================================== */

const btnLocalizar =
    document.getElementById("btnLocalizar");

const mapa =
    document.getElementById("mapa");

const mapaInicial =
    document.getElementById("mapaInicial");

const mapaStatus =
    document.getElementById("mapaStatus");

const linkMapa =
    document.getElementById("linkMapa");

const btnGoogle =
    document.getElementById("btnGoogle");

const latitude =
    document.getElementById("latitude");

const longitude =
    document.getElementById("longitude");

const ultimaLocalizacao =
    document.getElementById("ultimaLocalizacao");

const dataLocalizacao =
    document.getElementById("dataLocalizacao");

const papel =
    document.getElementById("papel");

const lixeira =
    document.getElementById("lixeira");

const notificacao =
    document.getElementById("notificacao");


/* ==========================================
   LOCALIZAR USUÁRIO
========================================== */

btnLocalizar.addEventListener("click", () => {

    if (!navigator.geolocation) {

        mostrarNotificacao(
            "Seu navegador não suporta geolocalização."
        );

        return;
    }


    mapaStatus.innerHTML =
        `<span></span> Localizando...`;


    btnLocalizar.disabled = true;

    btnLocalizar.innerHTML =
        `<span>⌖</span> Localizando...`;


    navigator.geolocation.getCurrentPosition(

        (posicao) => {

            const lat =
                posicao.coords.latitude;

            const lon =
                posicao.coords.longitude;


            const latFormatada =
                lat.toFixed(6);

            const lonFormatada =
                lon.toFixed(6);


            /* ==============================
               EXIBIR COORDENADAS
            ============================== */

            latitude.textContent =
                latFormatada;

            longitude.textContent =
                lonFormatada;


            /* ==============================
               DATA E HORÁRIO
            ============================== */

            const agora =
                new Date();


            const data =
                agora.toLocaleDateString(
                    "pt-BR"
                );


            const horario =
                agora.toLocaleTimeString(
                    "pt-BR"
                );


            /* ==============================
               DADOS PARA LOCALSTORAGE
            ============================== */

            const dados = {

                latitude: latFormatada,

                longitude: lonFormatada,

                data: data,

                horario: horario
            };


            localStorage.setItem(
                "ultimaLocalizacao",
                JSON.stringify(dados)
            );


            /* ==============================
               MOSTRAR ÚLTIMA LOCALIZAÇÃO
            ============================== */

            mostrarUltimaLocalizacao(dados);


            /* ==============================
               ATUALIZAR MAPA
            ============================== */

            atualizarMapa(
                lat,
                lon
            );


            /* ==============================
               GOOGLE MAPS
            ============================== */

            btnGoogle.disabled = false;


            /* ==============================
               FINALIZAR BOTÃO
            ============================== */

            btnLocalizar.disabled = false;

            btnLocalizar.innerHTML =
                `<span>⌖</span> Atualizar localização`;


            mostrarNotificacao(
                "Localização encontrada e salva!"
            );

        },

        (erro) => {

            btnLocalizar.disabled = false;

            btnLocalizar.innerHTML =
                `<span>⌖</span> Encontrar minha localização`;


            mapaStatus.innerHTML =
                `<span></span> Aguardando localização`;


            let mensagem =
                "Não foi possível obter sua localização.";


            if (erro.code === 1) {

                mensagem =
                    "Permita o acesso à localização no navegador.";

            } else if (erro.code === 2) {

                mensagem =
                    "Sua localização não pôde ser encontrada.";

            } else if (erro.code === 3) {

                mensagem =
                    "A localização demorou muito para responder.";
            }


            mostrarNotificacao(
                mensagem
            );

        },

        {
            enableHighAccuracy: true,

            timeout: 15000,

            maximumAge: 0
        }
    );

});


/* ==========================================
   ATUALIZAR MAPA
========================================== */

function atualizarMapa(
    lat,
    lon
) {

    const margem = 0.01;


    const bbox =
        `${lon - margem},` +
        `${lat - margem},` +
        `${lon + margem},` +
        `${lat + margem}`;


    const url =
        `https://www.openstreetmap.org/export/embed.html` +
        `?bbox=${bbox}` +
        `&layer=mapnik` +
        `&marker=${lat},${lon}`;


    mapa.src = url;


    mapaInicial.style.display =
        "none";


    mapaStatus.innerHTML =
        `<span></span> Localização encontrada`;


    linkMapa.href =
        `https://www.openstreetmap.org/` +
        `?mlat=${lat}` +
        `&mlon=${lon}` +
        `#map=16/${lat}/${lon}`;

}


/* ==========================================
   MOSTRAR ÚLTIMA LOCALIZAÇÃO
========================================== */

function mostrarUltimaLocalizacao(
    dados
) {

    ultimaLocalizacao.innerHTML =
        `${dados.latitude}<br>${dados.longitude}`;


    dataLocalizacao.textContent =
        `Salva em ${dados.data} às ${dados.horario}`;
}


/* ==========================================
   ABRIR GOOGLE MAPS
========================================== */

btnGoogle.addEventListener(
    "click",
    () => {

        const lat =
            latitude.textContent;

        const lon =
            longitude.textContent;


        if (
            lat === "--.--------" ||
            lon === "--.--------"
        ) {

            return;
        }


        const url =
            `https://www.google.com/maps?q=${lat},${lon}`;


        window.open(
            url,
            "_blank"
        );

    }
);


/* ==========================================
   RECUPERAR LOCALIZAÇÃO DO LOCALSTORAGE
   QUANDO A PÁGINA É ATUALIZADA
========================================== */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        const localizacaoSalva =
            localStorage.getItem(
                "ultimaLocalizacao"
            );


        if (!localizacaoSalva) {

            return;
        }


        try {

            const dados =
                JSON.parse(
                    localizacaoSalva
                );


            /* ==============================
               COORDENADAS
            ============================== */

            latitude.textContent =
                dados.latitude;

            longitude.textContent =
                dados.longitude;


            /* ==============================
               ÚLTIMA LOCALIZAÇÃO
            ============================== */

            mostrarUltimaLocalizacao(
                dados
            );


            /* ==============================
               MAPA
            ============================== */

            atualizarMapa(
                parseFloat(dados.latitude),
                parseFloat(dados.longitude)
            );


            /* ==============================
               GOOGLE MAPS
            ============================== */

            btnGoogle.disabled = false;


            mapaInicial.style.display =
                "none";


            mapaStatus.innerHTML =
                `<span></span> Última localização salva`;


        } catch (erro) {

            console.error(
                "Erro ao recuperar localização:",
                erro
            );

            localStorage.removeItem(
                "ultimaLocalizacao"
            );

        }

    }
);


/* ==========================================
   DRAG AND DROP
========================================== */


/* Começou a arrastar o papel */

papel.addEventListener(
    "dragstart",
    (evento) => {

        evento.dataTransfer.setData(
            "text/plain",
            "papel"
        );


        papel.classList.add(
            "sendo-arrastado"
        );

    }
);


/* Terminou de arrastar */

papel.addEventListener(
    "dragend",
    () => {

        papel.classList.remove(
            "sendo-arrastado"
        );

    }
);


/* Papel passou sobre a lixeira */

lixeira.addEventListener(
    "dragover",
    (evento) => {

        evento.preventDefault();


        lixeira.classList.add(
            "destino-ativo"
        );

    }
);


/* Papel saiu da lixeira */

lixeira.addEventListener(
    "dragleave",
    () => {

        lixeira.classList.remove(
            "destino-ativo"
        );

    }
);


/* Papel foi solto na lixeira */

lixeira.addEventListener(
    "drop",
    (evento) => {

        evento.preventDefault();


        lixeira.classList.remove(
            "destino-ativo"
        );


        const dados =
            evento.dataTransfer.getData(
                "text/plain"
            );


        if (dados !== "papel") {

            return;
        }


        /* ==============================
           APAGAR LOCALSTORAGE
        ============================== */

        localStorage.removeItem(
            "ultimaLocalizacao"
        );


        /* ==============================
           LIMPAR GPS
        ============================== */

        latitude.textContent =
            "--.--------";

        longitude.textContent =
            "--.--------";


        /* ==============================
           LIMPAR ÚLTIMA LOCALIZAÇÃO
        ============================== */

        ultimaLocalizacao.textContent =
            "Nenhuma localização salva.";


        dataLocalizacao.textContent =
            "Nenhuma data registrada.";


        /* ==============================
           LIMPAR MAPA
        ============================== */

        mapa.src = "";

        mapaInicial.style.display =
            "flex";


        mapaStatus.innerHTML =
            `<span></span> Aguardando localização`;


        /* ==============================
           DESABILITAR GOOGLE MAPS
        ============================== */

        btnGoogle.disabled = true;


        /* ==============================
           NOTIFICAÇÃO
        ============================== */

        mostrarNotificacao(
            "Localização e dados apagados!"
        );

    }
);


/* ==========================================
   NOTIFICAÇÃO
========================================== */

function mostrarNotificacao(
    mensagem
) {

    notificacao.textContent =
        mensagem;


    notificacao.classList.add(
        "mostrar"
    );


    setTimeout(
        () => {

            notificacao.classList.remove(
                "mostrar"
            );

        },
        3000
    );

}