import {getDashboardData} from '../js-functions/script.js';
const userdata = await getDashboardData();
const textoProgresso = document.getElementById("textoProgresso");
const barraProgresso = document.getElementById("barraProgresso");
const nivel = document.getElementById("nivel");
const mensagem = document.getElementById("Mensagem");
const listaExercicios = document.getElementById("listaExercicios");
const duracaoExercicios = document.getElementById("duracaoExercicios");
const rotinaInicio = document.getElementById("horarioInicio");
const rotinaFim = document.getElementById("horarioFim");
const horaSemIA = document.getElementById("horasSemIA");
const quantidadeExercicios = document.getElementById("QuantidadeExercicios");
function PreencherDashboard() {
    const progress = userdata.userprogress;
    const nivelUsuario = (userdata.level === "critical" ? "Crítico" : (userdata.level === "attention" ? "Atenção" : "Controlado"));
    const exercicios = userdata.exercise;
    const duracaoTotal = userdata.exercise_duration;
    nivel.textContent = nivelUsuario;
    duracaoExercicios.textContent = duracaoTotal;
    rotinaInicio.textContent = userdata.routine_start;
    rotinaFim.textContent = userdata.routine_end;
    horaSemIA.textContent = userdata.time_without_IA;
    quantidadeExercicios.textContent = exercicios.length;

    // O "day" começa em 1, então o exercício de hoje é o de índice day - 1
    // (dia 1 -> exercicios[0], dia 2 -> exercicios[1], ...)
    const concluidos = progress.day - 1;
    const exercicioDoDia = exercicios[progress.day - 1];

    textoProgresso.textContent = `${concluidos} de ${exercicios.length} exercícios concluídos`;

    if (exercicioDoDia) {
        // Ainda há exercício para hoje: mostra só UM card
        listaExercicios.innerHTML += `<div class="col-12 col-md-6">
            <div class="card bg-white text-dark border-0 shadow-sm h-100">
                ${exercicioDoDia.img ? `<img src="${exercicioDoDia.img}" class="card-img-top" alt="${exercicioDoDia.type}">` : ""}
                <div class="card-body">
                    <span class="badge bg-primary">${exercicioDoDia.type}</span>
                    <p class="card-text mt-2 mb-0">${exercicioDoDia.question}</p>
                </div>
                <div class="card-footer bg-white border-0 pb-3">
                    <a href="../exercises/index.html" class="btn bg-blue text-white fw-bold w-100">Prosseguir para a lição do dia</a>
                </div>
            </div>
        </div>`;
    } else {
        // day passou do total: todos os exercícios foram feitos
        listaExercicios.innerHTML += `<div class="col-12 col-md-6">
            <div class="card bg-white text-dark border-0 shadow-sm h-100">
                <div class="card-body">
                    <span class="badge bg-success">Finalizado</span>
                    <p class="card-text mt-2 mb-0">Exercícios finalizados</p>
                </div>
            </div>
        </div>`;
    }
    barraProgresso.style.width = `${(concluidos / exercicios.length) * 100}%`;
    barraProgresso.textContent = `${Math.round((concluidos / exercicios.length) * 100)}%`;  
}
PreencherDashboard();
