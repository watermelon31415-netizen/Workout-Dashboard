async function login(){


const email =
document.getElementById("email").value;



const password =
document.getElementById("password").value;



const {data,error}
=
await supabaseClient.auth
.signInWithPassword({

email,

password

});



if(error){

alert(error.message);

return;

}



alert("Login successful 💪");


window.location.href="index.html";


}