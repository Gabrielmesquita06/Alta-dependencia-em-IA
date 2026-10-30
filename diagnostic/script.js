import { GetUserData, getUserID } from "../js-functions/script.js";

const levels = {
    "critical": {
        label: "Crítico",
        color: "#c21515",
        msg: "Você está usando IA em excesso. Tente realizar mais tarefas por conta própria."
    },
    "attention": {
        label: "Atenção",
        color: "rgb(255, 251, 0)",
        msg: "Seu uso de IA está um pouco elevado. Busque mais equilíbrio."
    },
    "low-level": {
        label: "Controlado",
        color: "rgb(0, 255, 0)",
        msg: "Parabéns! Você usa a IA de forma equilibrada e mantém sua autonomia."
    }
};

async function showResult() {
    const nivel = document.getElementById("nivel");
    const mensagem = document.getElementById("Mensagem");
    // o módulo não expõe a pontuação, apenas o nível
    document.getElementById("potuação").hidden = true;

    const userId = getUserID();
    if (!userId) {
        mensagem.textContent = "Nenhum diagnóstico encontrado. Responda o formulário primeiro.";
        return;
    }

    try {
        const user = await GetUserData(userId);
        const info = levels[user.level];
        nivel.textContent = info.label;
        nivel.style.color = info.color;
        mensagem.textContent = info.msg;
    } catch (error) {
        console.error("Erro ao obter o nível do usuário:", error);
        mensagem.textContent = "Não foi possível carregar seu resultado.";
    }
}

showResult();
