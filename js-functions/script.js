const users = 'http://localhost:3000/users';
const form = 'http://localhost:3000/Form'
const exercises = 'http://localhost:3000/exercises'

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

export async function registerUser(userData){
    try {
        const response = await request(users, 'POST', userData);
        return response;
    } catch (error) {
        console.error('Erro ao registrar o usuário:', error);
        throw error;
    }
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
export async function SubmitForm(UserResponse){
    let score = 0;
    const user_object = {
        id : crypto.randomUUID(),
        form_answers : [],
        level : '',
        routine : {
           time_without_IA : null, 
           time_no_IA_start : null,
           time_no_IA_end : null,
           exercise_time : null,
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
    } else if (score >= 60) {
        user_object.level = 'attention';
    }  else {
        user_object.level = 'low-level';
    }
   
   const response = await registerUser(user_object);
    localStorage.setItem('userId', user_object.id);
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
        let exercise = await request(`${exercises}/${level}`);
        return exercise;
    } catch (error) {
        throw new Error('Erro ao buscar exercícios do usuário');
    }
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