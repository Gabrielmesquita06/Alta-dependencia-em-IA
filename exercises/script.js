import { getUserID, getTodayExercises, submitQuizAnswers, GetUserData, podeFazerHoje } from "../js-functions/script.js";

const form = document.getElementById("ExercisesForm");
const container = document.getElementById("exercises");
const resultado = document.getElementById("resultado");
const botaoEnviar = form.querySelector('button[type="submit"]');

// 1. Descobre quem é o usuário. Sem usuário, volta para o formulário.
const userId = getUserID();
if (!userId) {
    window.location.replace("/form/index.html");
}

// 2. Busca os exercícios DO DIA do usuário (nível e dia atual vêm do js-functions)
let exercicios = [];
let deuErro = false;
let bloqueado = false;
if (userId) {
    try {
        // Já enviou hoje? Então só libera amanhã
        const userdata = await GetUserData(userId);
        if (!podeFazerHoje(userdata.progress)) {
            bloqueado = true;
            container.innerHTML = `<p class="text-dark">Você já fez o exercício de hoje. Volte amanhã!</p>
                <a href="../user_dashboard/index.html" class="btn bg-blue text-white fw-bold">Voltar ao painel</a>`;
            botaoEnviar.hidden = true;
        } else {
            exercicios = await getTodayExercises(userId);
        }
    } catch (error) {
        console.error(error);
        deuErro = true;
        container.innerHTML = `<p class="text-white">Não foi possível carregar seus exercícios.</p>`;
        botaoEnviar.hidden = true;
    }
}

// Sem exercícios para o dia atual (e sem erro): o usuário já concluiu todos os dias
if (!deuErro && !bloqueado && exercicios.length === 0) {
    container.innerHTML = `<p class="text-white">Você concluiu todos os exercícios.</p>
        <a href="../user_dashboard/index.html" class="btn bg-blue text-white fw-bold">Voltar ao painel</a>`;
    botaoEnviar.hidden = true;
}

// 3. Mostra cada exercício na tela
for (let i = 0; i < exercicios.length; i++) {
    let html = `
        <div class="card mb-4 border-light shadow-sm">
            <div class="card-body p-4">
                <h5 class="card-title fs-6 fw-semibold text-dark mb-3">${i + 1}. ${exercicios[i].question}</h5>
                <div class="d-flex flex-column gap-2">`;

    for (let j = 0; j < exercicios[i].alternates.length; j++) {
        html += `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="e${i}" id="e${i}_opt${j}" value="${exercicios[i].alternates[j].letter}" required>
                        <label class="form-check-label" role="button" for="e${i}_opt${j}">${exercicios[i].alternates[j].letter}) ${exercicios[i].alternates[j].text}</label>
                    </div>`;
    }

    // Espaço onde vai aparecer "Correto" ou "Errado" depois do envio
    html += `
                </div>
                <p id="feedback${i}" class="mt-3 mb-0 fw-semibold"></p>
            </div>
        </div>`;

    container.innerHTML += html;
}

// 4. Quando clicar em "Enviar Respostas"
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Bloqueia o botão para não enviar duas vezes
    botaoEnviar.disabled = true;
    botaoEnviar.textContent = "Enviando...";

    const respostas = [];
    let acertos = 0;

    for (let i = 0; i < exercicios.length; i++) {
        // Descobre qual alternativa o usuário marcou
        let letraMarcada = null;
        for (let j = 0; j < exercicios[i].alternates.length; j++) {
            const caixinha = document.getElementById(`e${i}_opt${j}`);
            if (caixinha.checked) {
                letraMarcada = caixinha.value;
            }
        }

        // Compara com a resposta certa que está no JSON
        const feedback = document.getElementById(`feedback${i}`);
        if (letraMarcada === exercicios[i].correct_awnser) {
            acertos++;
            feedback.textContent = "Correto!";
            feedback.className = "mt-3 mb-0 fw-semibold text-success";
        } else {
            feedback.textContent = `Errado. A resposta certa é a ${exercicios[i].correct_awnser}.`;
            feedback.className = "mt-3 mb-0 fw-semibold text-danger";
        }

        respostas.push({
            questionId: exercicios[i].id,
            letter: letraMarcada
        });
    }

    // Mostra a nota
    resultado.textContent = `Você acertou ${acertos} de ${exercicios.length}.`;
    resultado.hidden = false;

    // Salva as respostas no usuário (e avança o dia dele)
    try {
        await submitQuizAnswers(userId, respostas);
        botaoEnviar.textContent = "Respostas enviadas";
        // Link para voltar ao painel (o dia já avançou)
        resultado.innerHTML += ` <a href="../user_dashboard/index.html" class="alert-link">Voltar ao painel</a>`;
    } catch (error) {
        console.error(error);
        alert("Erro ao salvar as respostas");
        botaoEnviar.disabled = false;
        botaoEnviar.textContent = "Enviar Respostas";
    }
});
