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
            day : null,
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
        user_object.level = 'Crítico';
    } else if (score >= 60) {
        user_object.level = 'Atenção';
    }  else {
        user_object.level = 'Controlado';
    }

    return registerUser(user_object);
}

