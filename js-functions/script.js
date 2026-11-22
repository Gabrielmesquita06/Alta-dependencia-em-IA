const users = 'http://localhost:3000/users';
const form = 'http://localhost:3000/Form'
const exercises = 'http://localhost:3000/exercises'
//Requisição de fetch universal criada
async function request (url, metodo = "GET", objectpost) {
    const response = await fetch(url, 
    {
        method: metodo,
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(objectpost)
    });
    if (!response.ok){
        const error = new Error(`Erro HTTP! status: ${response.status}`);
        error.status = response.status;
        throw error;
    }
    return response.json();
}

async function getAwnserScore (FormId, letter){
try{
    const response = await request(`${form}/${FormId}`);
    const alternates = response.alternates
    let points = 0;
    for(let i = 0; i < alternates.length; i++){
        if (alternates[i].letter == letter.toUpperCase()) points += alternates[i].points;
    }
    return points;
}catch(error){
    throw error;
};
}

export async function GetUserData(UserId) 
 {
   try { const response = await request(`${users}/${UserId}`);
        return response;
}
   catch(error){
    throw error;
   };
}
// Recebe UM objeto com tudo que o formulário coletou:
// {
//   answers: [{ questionId, letter }, ...],
//   routine: { time_no_IA_start, time_no_IA_end, exercise_time }
// }
export async function SubmitForm(formData){
    const UserResponse = formData.answers;
    const routine = formData.routine;
    const savedUserId = localStorage.getItem('userId');
    const userexists = savedUserId ? await checkUserExists(savedUserId) : false;
    let score = 0;
    const user_object = {
        form_answers : [],
        level : '',
        routine : {
           time_without_IA : null,
           time_no_IA_start : routine.time_no_IA_start,
           time_no_IA_end : routine.time_no_IA_end,
           exercise_time : routine.exercise_time,
        },
        progress: {
            day : 1,
            quiz_answers : [],
            feedback : []
        }
    }
    for(let i = 0; i < UserResponse.length; i++){
        user_object.form_answers[i] = UserResponse[i];
        score += await getAwnserScore(UserResponse[i].questionId, UserResponse[i].letter)
    }

    if (score >= 80) {
        user_object.level = 'critical';
                user_object.routine.time_without_IA = 3;
    } else if (score >= 60) {
        user_object.level = 'attention';
        user_object.routine.time_without_IA = 2;
    }  else {
        user_object.level = 'low-level';
        user_object.routine.time_without_IA = 1;
    }

    let response;
    if (userexists) {
        // Usuário já existe: atualiza respostas, nível e rotina, sem criar outro registro
        response = await request(`${users}/${savedUserId}`, 'PATCH', {
            form_answers: user_object.form_answers,
            level: user_object.level,
            routine: user_object.routine
        });
    } else {
        response = await request(users, 'POST', user_object);
    }
    localStorage.setItem('userId', response.id);
    return response;
}

export async function checkUserExists(userId) {
    try {
        await request(`${users}/${userId}`);
        return true;
    } catch (error) {
        if (error.status === 404) {
            return false; 
        }
        throw error;
    }
}

export async function getUserExercises(userId) {
    let userExists = await checkUserExists(userId);
    if (!userExists) {
        throw new Error('Usuário não encontrado');
    }
     try {
        let userLevel = await request(`${users}/${userId}`);
        let level = userLevel.level;
        const allExercises = await request(exercises);
        // Cada nível é uma LISTA de exercícios: [{ id, day, category, tip, question, alternates, correct_awnser }, ...]
        let exercise = allExercises[level];
        return exercise;
    } catch (error) {
        throw new Error('Erro ao buscar exercícios do usuário');
    }
}

// Só os exercícios do dia atual do usuário (progress.day)
export async function getTodayExercises(userId) {
    const userdata = await GetUserData(userId);
    const allExercises = await getUserExercises(userId);
    return allExercises.filter(ex => ex.day === userdata.progress.day);
}
export async function submitQuizAnswers(userId, quizAnswers) {
    let userExists = await checkUserExists(userId);
    if (!userExists) {
        throw new Error('Usuário não encontrado');
    }
    const userdata = await GetUserData(userId);
    const objectToUpdate = {
        progress : {
        ...userdata.progress,
        day : userdata.progress.day + 1,
        quiz_answers: [...userdata.progress.quiz_answers]
    }};
    for (let i = 0; i < quizAnswers.length; i++) {
    objectToUpdate.progress.quiz_answers.push(quizAnswers[i]);
    }
    try { 
        const response = await request(`${users}/${userId}`,"PATCH", objectToUpdate);
        return response;
    } catch (error) {
        throw new Error('Erro ao enviar respostas do quiz');
    }
}

export async function getFormQuestions(){
   try {
        const objectquestions = await request(form);
        return objectquestions;
    } catch (error) {
        throw new Error('Erro ao buscar perguntas do formulário');
    }
}

export function getUserID(){
    return localStorage.getItem('userId');
}

export async function SubimitUserFeedback(feedback, UserId) {
    const userdata = await request(`${users}/${UserId}`);
    const progress = userdata.progress;
    const objectToUpdate = 
    { progress : {
        ...progress,
        feedback : [...progress.feedback]
    }};
    objectToUpdate.progress.feedback.push(feedback);
    try
    {
        const send = await request(`${users}/${UserId}`,"PATCH", objectToUpdate);
        return send;
    }catch(error){
        throw Error("Erro ao enviar feedback");
    }
}
export async function SubmitUserRoutine(routine) {
    const savedUserId = localStorage.getItem('userId');
    const userexists = savedUserId ? await checkUserExists(savedUserId) : false;
    if (!userexists) {
        throw new Error('Usuário não encontrado');
    }
    const userdata = await request(`${users}/${savedUserId}`);
    let hoursNoIA = 1;
    if (userdata.level === 'critical') {
        hoursNoIA = 3;
    } else if (userdata.level === 'attention') {
        hoursNoIA = 2;
    }
    const objectToUpdate = {
        ...userdata,
        routine: {
            time_without_IA: hoursNoIA,
            time_no_IA_start: routine.time_no_IA_start,
            time_no_IA_end: routine.time_no_IA_end,
            exercise_time: routine.exercise_time 

        }
    };
    try {
        const response = await request(`${users}/${savedUserId}`, "PATCH", objectToUpdate);
        return response;
    } catch (error) {
        throw new Error('Erro ao enviar rotina do usuário');
    }   
}
export async function getDashboardData(){
    const savedUserId = localStorage.getItem('userId');
    const userexists = savedUserId ? await checkUserExists(savedUserId) : false;
    const userdata = await request(`${users}/${savedUserId}`);
    if (!userexists) {
        window.location.replace("/form/index.html");
}
// getUserExercises devolve a LISTA de exercicios do nivel do usuario (todos os dias)
const userExercises = await getUserExercises(savedUserId);
const objecttoReturn = {
    level : userdata.level,
    userprogress : userdata.progress,
    routine_start : userdata.routine.time_no_IA_start,
    routine_end : userdata.routine.time_no_IA_end,
    exercise_time : userdata.routine.exercise_time,
    time_without_IA : userdata.routine.time_without_IA,
    // cada item: { id, day, category, tip, question, alternates, correct_awnser }
    exercise : userExercises
}
return objecttoReturn;
}
