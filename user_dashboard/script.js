import {getDashboardData} from '../js-functions/script.js';
const userdata = await getDashboardData();
const textoProgresso = document.getElementById("textoProgresso");
const barraProgresso = document.getElementById("barraProgresso");
const nivel = document.getElementById("nivel");
const mensagem = document.getElementById("Mensagem");
const listaExercicios = document.getElementById("listaExercicios");
const diaAtualBadge = document.getElementById("diaAtual");
const rotinaInicio = document.getElementById("horarioInicio");
const rotinaFim = document.getElementById("horarioFim");
const horaSemIA = document.getElementById("horasSemIA");
const quantidadeExercicios = document.getElementById("QuantidadeExercicios");
function PreencherDashboard() {
    const progress = userdata.userprogress;
    const nivelUsuario = (userdata.level === "critical" ? "Crítico" : (userdata.level === "attention" ? "Atenção" : "Controlado"));

    // userdata.exercise é a lista com TODOS os exercícios do nível (todos os dias).
    // Cada item: { id, day, category, tip, question, alternates, correct_awnser }
    const exercicios = userdata.exercise;

    // Dia atual do usuário (começa em 1) e total de dias que existem nos exercícios
    const diaAtual = progress.day;
    const totalDias = Math.max(...exercicios.map(ex => ex.day).filter(d => d));

    // Só os exercícios do dia de hoje (ex.: dia 1 -> 12 exercícios)
    const exerciciosDoDia = exercicios.filter(ex => ex.day === diaAtual);

    // Dias já concluídos (nunca passa do total)
    const concluidos = Math.min(diaAtual - 1, totalDias);

    nivel.textContent = nivelUsuario;
    diaAtualBadge.textContent = Math.min(diaAtual, totalDias);
    rotinaInicio.textContent = userdata.routine_start;
    rotinaFim.textContent = userdata.routine_end;
    horaSemIA.textContent = userdata.time_without_IA;
    quantidadeExercicios.textContent = exerciciosDoDia.length;

    textoProgresso.textContent = `${concluidos} de ${totalDias} dias concluídos`;

    if (exerciciosDoDia.length > 0) {
        // Agrupa os exercícios do dia por categoria: { "Raciocínio lógico": [ex, ex, ex], ... }
        const porCategoria = {};
        for (const ex of exerciciosDoDia) {
            if (!porCategoria[ex.category]) {
                porCategoria[ex.category] = [];
            }
            porCategoria[ex.category].push(ex);
        }

        // Um card por categoria
        for (const categoria in porCategoria) {
            const lista = porCategoria[categoria];
            const comImagem = lista.find(ex => ex.img);   // usa a 1ª imagem da categoria, se houver
            listaExercicios.innerHTML += `<div class="col-12 col-md-6">
            <div class="card bg-white text-dark border-0 shadow-sm h-100">
                ${comImagem ? `<img src="${comImagem.img}" class="card-img-top" alt="${categoria}">` : ""}
                <div class="card-body">
                    <span class="badge bg-primary">${categoria}</span>
                    <p class="card-text mt-2 mb-0">${lista.length} exercícios</p>
                </div>
            </div>
        </div>`;
        }

        // Um único botão para a lição do dia (e não um por card)
        listaExercicios.innerHTML += `<div class="col-12">
            <a href="../exercises/index.html" class="btn bg-blue text-white fw-bold w-100">Prosseguir para a lição do dia</a>
        </div>`;
    } else {
        // day passou do total: todos os dias foram concluídos
        listaExercicios.innerHTML += `<div class="col-12 col-md-6">
            <div class="card bg-white text-dark border-0 shadow-sm h-100">
                <div class="card-body">
                    <span class="badge bg-success">Finalizado</span>
                    <p class="card-text mt-2 mb-0">Exercícios finalizados</p>
                </div>
            </div>
        </div>`;
    }
    barraProgresso.style.width = `${(concluidos / totalDias) * 100}%`;
    barraProgresso.textContent = `${Math.round((concluidos / totalDias) * 100)}%`;
}
PreencherDashboard();
