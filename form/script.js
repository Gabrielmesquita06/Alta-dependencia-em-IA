import { getFormQuestions, SubmitForm, getUserID, checkUserExists } from "../js-functions/script.js";
const params = new URLSearchParams(window.location.search);
const refazendo = params.has("refazer");
const savedUserId = getUserID();
if (!refazendo && savedUserId && await checkUserExists(savedUserId)) {
    window.location.replace("/diagnostic/index.html");
}

const container = document.getElementById("questions");
const formquestions = await getFormQuestions();

for (let i = 0; i < formquestions.length; i++) {
    let html = `
        <div class="card mb-4 border-light shadow-sm">
            <div class="card-body p-4">
                <h5 class="card-title fs-6 fw-semibold text-dark mb-3">${i + 1}. ${formquestions[i].question}</h5>
                <div class="d-flex flex-column gap-2">`;

    for (let j = 0; j < formquestions[i].alternates.length; j++) {
        html += `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="q${i}" id="q${i}_opt${j}" value="${formquestions[i].alternates[j].letter}" required>
                        <label class="form-check-label" role="button" for="q${i}_opt${j}">${formquestions[i].alternates[j].letter}) ${formquestions[i].alternates[j].text}</label>
                    </div>`;
    }

    html += `
                </div>
            </div>
        </div>`;

    container.innerHTML += html;
}

// Quando clicar em "Enviar Respostas"
const form = document.getElementById("Form");
const botaoEnviar = form.querySelector('button[type="submit"]');

// Controla em qual etapa o formulário está: "perguntas" -> "horario"
// Em vez de ter 2 listeners de submit (que disparam juntos), temos UM só
// que decide o que fazer olhando esta variável.
let etapa = "perguntas";

// Guarda as respostas da etapa 1 na memória até o horário ser escolhido.
// NADA vai para o servidor antes da etapa 2: assim o db.json só muda uma vez,
// já com tudo preenchido (e o Live Server não recarrega a página no meio).
let respostasColetadas = [];

// Troca as perguntas pela tela de escolher o horário
function mostrarTelaHorario() {
    // Reaproveita o mesmo botão do formulário, só trocando o texto
    botaoEnviar.textContent = "Enviar Horário";
    container.innerHTML = `
        <div class="card mb-4 border-light shadow-sm">
            <div class="card-body p-4">
                <h5 class="card-title fs-6 fw-semibold text-dark mb-3">Qual é o seu horário disponível para realizarmos os exercícios?</h5>
                <div class="d-flex align-items-center gap-2">
                    <input type="time" class="form-control" id="horaInicio" value="19:00">
                    <span>até</span>
                    <input type="time" class="form-control" id="horaFim" value="20:00">
                </div>
            </div>
        </div>`;
}

// Lê os dois campos de hora e devolve os minutos totais (ou null se inválido)
function getSelectedTime() {
    const horarioInicio = document.getElementById("horaInicio").value;
    const horarioFim = document.getElementById("horaFim").value;
    const partesInicio = horarioInicio.split(':');
    const partesFim = horarioFim.split(':');
    const horaInicio = (parseInt(partesInicio[0], 10)) * 60 + parseInt(partesInicio[1], 10);
    const horaFim = (parseInt(partesFim[0], 10)) * 60 + parseInt(partesFim[1], 10);
    if (horaFim <= horaInicio) {
        alert("O horário final deve ser maior que o horário inicial.");
        return null;
    } else if (horaFim - horaInicio < 60) {
        alert("O intervalo entre os horários deve ser de pelo menos 1 hora.");
        return null;
    }
    return { horaInicio, horaFim };
}

// Converte minutos totais em "HH:MM" (ex.: 1145 -> "19:05")
function formatTime(totalMinutes) {
    const horas = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
    const minutos = String(totalMinutes % 60).padStart(2, "0");
    return `${horas}:${minutos}`;
}

// ETAPA 1: só coleta as respostas (não envia nada) e avança para o horário
function coletarPerguntas() {
    const respostas = [];

    for (let i = 0; i < formquestions.length; i++) {
        let letraMarcada = null;

        for (let j = 0; j < formquestions[i].alternates.length; j++) {
            const caixinha = document.getElementById(`q${i}_opt${j}`);

            if (caixinha.checked) {
                letraMarcada = caixinha.value;
            }
        }

        // Segurança extra: se alguma pergunta ficou sem resposta, não envia
        if (letraMarcada === null) {
            alert(`Responda a pergunta ${i + 1} antes de continuar.`);
            return;
        }

        respostas.push({
            questionId: formquestions[i].id,
            letter: letraMarcada
        });
    }

    // Tudo respondido: guarda na memória e troca para a tela de horário
    respostasColetadas = respostas;
    etapa = "horario";
    mostrarTelaHorario();
}

// ETAPA 2: monta UM objeto com respostas + horário e envia tudo de uma vez
async function enviarHorario() {
    const selectedTime = getSelectedTime();
    if (!selectedTime) {
        return; // horário inválido: getSelectedTime já mostrou o alerta
    }

    try {
        botaoEnviar.disabled = true;
        botaoEnviar.textContent = "Enviando...";
        const dadosFormulario = {
            answers: respostasColetadas,
            routine: {
                exercise_time: Math.floor((selectedTime.horaFim - selectedTime.horaInicio) / 60),
                time_no_IA_start: formatTime(selectedTime.horaInicio),
                time_no_IA_end: formatTime(selectedTime.horaFim)
            }
        };
        await SubmitForm(dadosFormulario);
        window.location.replace("/diagnostic/index.html");
    } catch (error) {
        console.error(error);
        alert("Erro ao enviar o formulário");
        botaoEnviar.disabled = false;
        botaoEnviar.textContent = "Enviar Horário";
    }
}

// O ÚNICO listener de submit: decide o que fazer conforme a etapa
form.addEventListener("submit", async (event) => {
    // Impede o navegador de recarregar a página ao enviar o formulário
    event.preventDefault();

    if (etapa === "perguntas") {
        coletarPerguntas();
    } else {
        await enviarHorario();
    }
});
