import axios from 'axios';

const users = 'https://localhost:3000/users'; // Substitua pelo URL do seu servidor backend
const form = 'http://localhost:3000/Form'
const exercises = 'http://localhost:3000/exercises'


async function registerUser(userData){
    try {
        const response = await axios.post(users, userData);
        return response.data;
    } catch (error) {
        console.error('Erro ao registrar o usuário:', error);
        throw error;
    }
}

async function SubmitForm(UserResponse){
    let score = 0;
    const user_object = {
        id : crypto.randomUUID(),
        form_answers : new Array(UserResponse.length),
        level : '',
        routine : {
           time_without_IA : 0, 
           time_no_IA_start : 0,
           time_no_IA_end : 0,
           exercise_time : 0
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
        user_object.level = 'Crítico';
    } else if (score >= 60) {
        user_object.level = 'Atenção';
    }  else {
        user_object.level = 'Controlado';
    }

    return await registerUser(user_object);
}
