const days = [
"Monday",
"Tuesday",
"Wednesday",
"Thursday",
"Friday",
"Saturday",
"Sunday"
];


const times = [
"Morning",
"After Meal",
"Night"
];


let workouts = [];

let plans = [];

let selectedDay = "";

let selectedTime = "";



// 生成计划页面

async function loadPlanner(){


const user = await getCurrentUser();


if(!user){

alert("Please login first");

return;

}



const {data,error}=await supabaseClient
.from("workout_plans")
.select(`
*,
workouts(*)
`)
.eq(
"user_id",
user.id
);



if(!error){

plans=data;

}



const container =
document.getElementById("planner");


container.innerHTML="";



days.forEach(day=>{


const dayBox =
document.createElement("div");


dayBox.className="planner-day";



dayBox.innerHTML=`


<h2>${day}</h2>


${times.map(time=>{


const plan =
plans.find(item=>

item.day===day &&
item.time_slot===time

);



return `

<div class="planner-slot">


<h4>${time}</h4>



${
plan

?

`
<p>
✅ ${plan.workouts.title}
</p>
`

:

`
<button onclick="chooseWorkout('${day}','${time}')">

+ Choose Workout

</button>
`

}


</div>


`;



}).join("")}


`;



container.appendChild(dayBox);


});


}



// 打开选择窗口

async function chooseWorkout(day,time){


selectedDay = day;

selectedTime = time;


document
.getElementById("workoutModal")
.style.display="flex";


loadWorkoutOptions();


}





// 获取运动

async function loadWorkoutOptions(){

const user = await getCurrentUser();

const {data,error}=await supabaseClient
.from("workouts")
.select("*")
.eq(
"user_id",
user.id
)
.order(
"created_at",
{
ascending:false
}
);



if(error){

console.log(error);

return;

}


workouts=data;


displayWorkoutOptions(workouts);


}





// 显示选择列表

function displayWorkoutOptions(list){


const box =
document.getElementById("plannerWorkoutList");



box.innerHTML="";



list.forEach(workout=>{


const item =
document.createElement("div");


item.className="picker-item";



item.innerHTML=`

<h3>
${workout.title}
</h3>


<p>
${workout.duration} min
</p>


`;



item.onclick=()=>{


addWorkoutToPlan(workout);


};



box.appendChild(item);


});


}





// 加入计划

async function addWorkoutToPlan(workout){


const user = await getCurrentUser();


if(!user){

alert("Please login first");

return;

}



const {error}=await supabaseClient
.from("workout_plans")
.insert([{

day:selectedDay,

time_slot:selectedTime,

workout_id:workout.id,

user_id:user.id

}]);



if(error){

console.log(error);

alert(error.message);

return;

}



alert(
`${selectedDay} ${selectedTime}: ${workout.title}`
);



closeModal();


loadPlanner();


}

// 搜索

document
.getElementById("plannerSearch")
.addEventListener(
"input",
(e)=>{


const keyword =
e.target.value.toLowerCase();


const result =
workouts.filter(workout=>

workout.title
.toLowerCase()
.includes(keyword)

);



displayWorkoutOptions(result);


});





function closeModal(){


document
.getElementById("workoutModal")
.style.display="none";


}



loadPlanner();