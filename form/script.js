import { getFormQuestions, SubmitForm, getUserID, checkUserExists } from "../js-functions/script.js";

// Se o usuário já existe, vai direto para o diagnóstico,
// a não ser que ele tenha vindo pelo botão "Responder novamente" (?refazer=1)
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

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Bloqueia o botão logo no primeiro clique para evitar envio duplicado
    botaoEnviar.disabled = true;
    botaoEnviar.textContent = "Enviando...";

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
            alert(`Responda a pergunta ${i + 1} antes de enviar.`);
            botaoEnviar.disabled = false;
            botaoEnviar.textContent = "Enviar Respostas";
            return;
        }

        respostas.push({
            questionId: formquestions[i].id,
            letter: letraMarcada
        });
    }

    try {
        await SubmitForm(respostas);
        window.location.href = "/diagnostic/index.html"; // ajuste para a página de resultado
    } catch (error) {
        console.error(error);
        alert("Erro ao enviar o formulário");
        botaoEnviar.disabled = false;
        botaoEnviar.textContent = "Enviar Respostas";
    }
});

