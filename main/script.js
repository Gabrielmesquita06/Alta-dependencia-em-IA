import { getUserID } from "../js-functions/script";

function checkUser(){
   const exist = getUserID();
   if (!exist) window.location.replace();
}

checkUser;