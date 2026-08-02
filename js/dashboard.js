let currentUser = null;

const user = await requireLogin();

if (!user) return;

document.getElementById("userEmail").innerText =
    user.email;

async function loadDashboard(){


currentUser = await getCurrentUser();



if(!currentUser){

alert("Please login first");

return;

}



const today =
new Date()
.toLocaleDateString(
"en-US",
{
weekday:"long"
}
);



const {data,error}=await supabaseClient
.from("workout_plans")
.select(`
*,
workouts(*)
`)
.eq(
"user_id",
currentUser.id
)
.eq("day",today);



const container =
document.getElementById(
"todayWorkout"
);



if(error){

console.log(error);

return;

}



if(!data.length){


container.innerHTML=
`
<p>
No workout planned today 🎉
</p>
`;



}
else{


container.innerHTML="";


data.forEach(plan=>{


container.innerHTML +=`

<div class="today-item">


<h3>
${plan.time_slot}
</h3>


<p>
${plan.workouts.title}
</p>


<p>
⏱ ${plan.workouts.duration} min
</p>


<button onclick="completeWorkout(${plan.workouts.id})">

✅ Complete

</button>


</div>

`;


<div class="today-item">


<h3>
${plan.time_slot}
</h3>


<p>
${plan.workouts.title}
</p>


<p>
⏱ ${plan.workouts.duration} min
</p>


</div>


`;



});


}





// 总计划数量

const user = await getCurrentUser();
const {data:allPlans}=await supabaseClient
.from("workout_plans")
.select(`
*,
workouts(*)
`)
.eq(
"user_id",
currentUser.id
);

const user = await getCurrentUser();
const {data:history}=await supabaseClient
.from("workout_history")
.select("*")
.eq(
"user_id",
currentUser.id
);



document
.getElementById("completedWorkouts")
.innerText =
history.length;


document
.getElementById("totalWorkouts")
.innerText =
allPlans.length;



let minutes=0;


allPlans.forEach(item=>{


minutes +=
item.workouts.duration || 0;


});



document
.getElementById("totalMinutes")
.innerText =
minutes;


}



loadDashboard();

async function completeWorkout(id){


const today =
new Date()
.toISOString()
.split("T")[0];



const {error}=await supabaseClient
.from("workout_history")
.insert([{

workout_id:id,

completed_date:today

}]);



if(error){

console.log(error);

alert("Failed");

return;

}


alert("Workout completed 🎉");


loadDashboard();


}s