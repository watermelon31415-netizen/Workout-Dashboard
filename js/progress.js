async function loadProgress(){



const user = await getCurrentUser();


if(!user){

alert("Please login first");

return;

}



const {data,error}=await supabaseClient
.from("workout_history")
.select(`
*,
workouts(*)
`)
.eq(
"user_id",
user.id
)
.order(
"completed_date",
{
ascending:false
}
);



if(error){

console.log(error);
return;

}




// 完成数量

document
.getElementById("completed")
.innerText =
data.length;



// 总分钟

let minutes = 0;



data.forEach(item=>{


minutes +=
item.workouts.duration || 0;


});



document
.getElementById("minutes")
.innerText =
minutes;




// 历史列表


const history =
document.getElementById("history");



history.innerHTML="";



data.forEach(item=>{


history.innerHTML += `


<div class="today-item">


<h3>

${item.workouts.title}

</h3>


<p>

📅 ${item.completed_date}

</p>


<p>

⏱ ${item.workouts.duration} min

</p>


</div>


`;



});




// streak

calculateStreak(data);



}





function calculateStreak(history){


if(history.length===0){

return;

}



let streak=1;



let previous =
new Date(
history[0].completed_date
);



for(
let i=1;
i<history.length;
i++
){


let current =
new Date(
history[i].completed_date
);



let diff =
(previous-current)
/
(1000*60*60*24);



if(diff===1){

streak++;

previous=current;

}

else{

break;

}



}



document
.getElementById("streak")
.innerText =
`${streak} Days`;

}



loadProgress();