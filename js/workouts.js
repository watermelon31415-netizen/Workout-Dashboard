let workouts = [];


// 加载运动数据
async function loadWorkouts(){


const user = await getCurrentUser();



if(!user){

alert("Please login first");

return;

}



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



workouts = data;


displayWorkouts(workouts);


}



// 显示卡片
function displayWorkouts(list) {


    const container =
    document.getElementById("workoutList");


    container.innerHTML = "";



    list.forEach(workout => {


        const card =
        document.createElement("div");


        card.className =
        "workout-card";



        card.innerHTML=`


        ${
        workout.image_url
        ?
        `<img src="${workout.image_url}" class="workout-image">`
        :
        ""
        }


        <h3>
        ${workout.title}
        </h3>


        <p>
        ⏱ ${workout.duration || 0} min
        </p>


        <p>
        🔥 ${workout.category || ""}
        </p>


        <p>
        🎯 ${workout.targets || ""}
        </p>


        <p>
        📍 ${workout.occasions || ""}
        </p>


        <button onclick="toggleFavorite(${workout.id},${workout.favorite})">

⭐

</button>


        <button onclick="openWorkout(${workout.id})">
        View Workout
        </button>

        <button onclick="deleteWorkout(${workout.id})">

🗑 Delete

</button>

        `;



        container.appendChild(card);


    });


}




// 打开详情页
function openWorkout(id) {


    window.location.href =
    `workout-detail.html?id=${id}`;


}




// 筛选功能
function applyFilters() {


    let result = [...workouts];



    // 搜索

    const keyword =
    document
    .getElementById("searchInput")
    .value
    .toLowerCase();



    if(keyword) {


        result =
        result.filter(workout =>

            workout.title
            .toLowerCase()
            .includes(keyword)

        );


    }





    // 时间筛选

    const durations =
    [
        ...document.querySelectorAll(
            ".duration-filter:checked"
        )
    ]
    .map(item => Number(item.value));



    if(durations.length) {


        result =
        result.filter(workout => {


            return durations.some(duration => {


                if(duration === 30) {

                    return workout.duration >= 30;

                }


                return workout.duration === duration;


            });


        });


    }





    // 场景筛选

    const occasions =
    [
        ...document.querySelectorAll(
            ".occasion-filter:checked"
        )
    ]
    .map(item => item.value);



    if(occasions.length) {


        result =
        result.filter(workout => {


            return occasions.some(option =>


                workout.occasions
                .includes(option)


            );


        });


    }






    // 身体目标筛选

    const targets =
    [
        ...document.querySelectorAll(
            ".target-filter:checked"
        )
    ]
    .map(item => item.value);



    if(targets.length) {


        result =
        result.filter(workout => {


            return targets.some(target =>


                workout.targets
                .includes(target)


            );


        });


    }




    displayWorkouts(result);


}





// 监听搜索和筛选

document
.querySelectorAll("input")
.forEach(input => {


    input.addEventListener(
        "input",
        applyFilters
    );


});




// 启动

loadWorkouts();


function filterTag(tag){


if(tag===""){

displayWorkouts(workouts);

return;

}



const result =
workouts.filter(workout=>{


return (

workout.targets.includes(tag)

||

workout.category.includes(tag)

);


});



displayWorkouts(result);


}

async function toggleFavorite(id,status){


const user = await getCurrentUser();



if(!user){

alert("Please login first");

return;

}



const {error}=await supabaseClient
.from("workouts")
.update({

favorite:
!status

})
.eq(
"id",
id
)
.eq(
"user_id",
user.id
);



if(error){

console.log(error);

return;

}



loadWorkouts();


}

function showFavorites(){


const result =
workouts.filter(workout=>

workout.favorite===true

);



displayWorkouts(result);


}

async function deleteWorkout(id){


const user = await getCurrentUser();



if(!user){

alert("Please login first");

return;

}



const confirmDelete =
confirm(
"Delete this workout?"
);



if(!confirmDelete){

return;

}



const {error}=await supabaseClient
.from("workouts")
.delete()
.eq(
"id",
id
)
.eq(
"user_id",
user.id
);



if(error){

console.log(error);

alert(error.message);

return;

}



alert(
"Workout deleted 🗑"
);



loadWorkouts();


}