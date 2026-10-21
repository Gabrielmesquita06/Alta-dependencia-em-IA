import axios from 'axios';
import { use } from 'react';

const users = 'https://localhost:3000/users'; // Substitua pelo URL do seu servidor backend
const form = 'http://localhost:3000/Form'
const exercises = 'http://localhost:3000/exercises'

async function getAwnserScore (FormId, letter){
try{
    const response = await axios.get(`${form}/${FormId}`);
    const alternates = response.data.alternates
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
        const response = await axios.post(users, userData);
        return response.data;
    } catch (error) {
        console.error('Erro ao registrar o usuário:', error);
        throw error;
    }
}
export async function GetUserData(UserId) 
 {
   try { const response = await axios.get(`${users}/${UserId}`);
        return response.data;
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
        let exercise = await axios.get(`${exercises}/${level}`);
        return exercise.data;
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

export function getUserID(){
    return localStorage.getItem('userId');
}

export async function SubimitUserFeedback(feedback, UserId) {
    const userdata = await axios.get(`${users}/${UserId}`);
    const progress = userdata.data.progress;
    const objectToUpdate = 
    { progress : {
        ...progress,
        feedback : [...progress.feedback]
    }};
    objectToUpdate.progress.feedback.push(feedback);
    try
    {
        const send = await axios.patch(`${users}/${UserId}`, objectToUpdate);
        return send.data;
    }catch(error){
        throw Error("Erro ao enviar feedback");
    }
}