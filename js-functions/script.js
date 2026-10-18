import axios from 'axios';

const users = 'https://localhost:3000/users'; // Substitua pelo URL do seu servidor backend
const form = 'http://localhost:3000/Form'
const exercises = 'http://localhost:3000/exercises'


export async function registerUser(userData){
    try {
        const response = await axios.post(users, userData);
        return response.data;
    } catch (error) {
        console.error('Erro ao registrar o usuário:', error);
        throw error;
    }
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
        switch(UserResponse[i].letter.toUpperCase()){
            case 'A':
                score += 10;
                break;
            case 'B':
                score += 20;
                break;
            case 'C':
                score += 30;
                break;
            case 'D':
                score += 40;
                break;
            default:
                throw new Error(`Opção inválida: ${UserResponse[i].letter}`);
        }
    }

    if (score >= 80) {
        user_object.level = 'critical';
    } else if (score >= 60) {
        user_object.level = 'attention';
    }  else {
        user_object.level = 'low-level';
    }

    return registerUser(user_object);
}

export async function checkUserExists(userId) {
    try {
        const response = await axios.get(`${users}/${userId}`);
        return true;
    } catch (error) {
        if (error.response && error.response.status === 404) {
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
        let userLevel = await axios.get(`${users}/${userId}`);
        let level = userLevel.data.level;
        let exercises = await axios.get(`${exercises}/${level}`);
        return exercises.data;
    } catch (error) {
        throw new Error('Erro ao buscar exercícios do usuário');
    }
}
export async function submitQuizAnswers(userId, quizAnswers) {
    let userExists = await checkUserExists(userId);
    if (!userExists) {
        throw new Error('Usuário não encontrado');
    }
    const objectToUpdate = {
            day : 1,
            exerciseId : "",
            letter : "",
            correct : null,
            completed : null
    }
    for (let i = 0; i < quizAnswers.length; i++) {
        objectToUpdate.day++;
        objectToUpdate.exerciseId = quizAnswers[i].exerciseId;
        objectToUpdate.letter = quizAnswers[i].letter;
        objectToUpdate.correct = quizAnswers[i].correct;
        objectToUpdate.completed = quizAnswers[i].completed;
    }
    try { 
        const response = await axios.patch(`${users}/${userId}`, objectToUpdate);
        return response.data;
    } catch (error) {
        throw new Error('Erro ao enviar respostas do quiz');
    }
}

export async function getFormQuestions(){
   try {
        const objectquestions = await axios.get(form);
        return objectquestions.data;
    } catch (error) {
        throw new Error('Erro ao buscar perguntas do formulário');
    }
}