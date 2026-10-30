
let score = 20;// variavel que armazena a pontuação do usuário
let user_object = {};


if (score >= 80) {
    user_object.level = "Crítico";
    document.getElementById("nivel").style.color = "#c21515";
} else if (score >= 60) {
    user_object.level = "Atenção";
document.getElementById("nivel").style.color = "rgb(255, 251, 0)";
} else {
    user_object.level = "Controlado";
    document.getElementById("nivel").style.color = "rgb(0, 255, 0)";
}
if (score >= 80) {
    user_object.msg = "Você está usando IA em excesso. Tente realizar mais tarefas por conta própria.";
} else if (score >= 60) {
    user_object.msg = "Seu uso de IA está um pouco elevado. Busque mais equilíbrio.";
} else {
    user_object.msg = "Parabéns! Você usa a IA de forma equilibrada e mantém sua autonomia.";
}

document.getElementById("nivel").textContent = user_object.level;

document.getElementById("Mensagem").textContent = "" + user_object.msg + ".";
document.getElementById("potuação").textContent = "Pontuação: " + score;
