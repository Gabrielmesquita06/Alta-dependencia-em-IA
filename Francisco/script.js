
let score = 85;
let user_object = {};


if (score >= 80) {
    user_object.level = "Crítico";
} else if (score >= 60) {
    user_object.level = "Atenção";
} else {
    user_object.level = "Controlado";
}
if (score >= 80) {
    user_object.msg = "Você está usando IA em excesso. Tente realizar mais tarefas por conta própria.";
} else if (score >= 60) {
    user_object.msg = "Seu uso de IA está um pouco elevado. Busque mais equilíbrio.";
} else {
    user_object.msg = "Parabéns! Você usa a IA de forma equilibrada e mantém sua autonomia.";
}

document.getElementById("Nivel").textContent = user_object.level;
document.getElementById("Mensagem").textContent = "" + user_object.msg + ".";
document.getElementById("potuação").textContent = "Pontuação: " + score;
