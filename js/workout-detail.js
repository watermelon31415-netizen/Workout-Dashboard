let currentWorkout = null;



async function loadWorkout(){


const params =
new URLSearchParams(
window.location.search
);


const id =
params.get("id");



const {data,error}=await supabaseClient
.from("workouts")
.select("*")
.eq("id",id)
.single();



if(error){

console.log(error);
return;

}



currentWorkout = data;



const container =
document.getElementById(
"workoutDetail"
);



container.innerHTML = `


${
data.image_url
?
`
<img 
src="${data.image_url}"
class="workout-image"
>
`
:
""
}



<h1>
${data.title}
</h1>



<p>
⏱ ${data.duration || 0} min
</p>



<p>
🔥 ${data.category || ""}
</p>



<p>
🎯 ${data.targets || ""}
</p>



<p>
📍 ${data.occasions || ""}
</p>



<p>
⭐ Difficulty:
${data.difficulty || ""}
</p>



<p>
${data.notes || ""}
</p>



<br>


<a href="${data.video_url}"
target="_blank">


<button>

▶ Watch Video

</button>


</a>



<button onclick="completeWorkout()">

✅ Complete Workout

</button>



<button onclick="toggleFavorite()">

${data.favorite ? "⭐ Remove Favorite" : "☆ Favorite"}

</button>



`;



}


async function completeWorkout(id){


    const user = await getCurrentUser();


    if(!user){

        alert("Please login first");

        return;

    }


    const today =
    new Date()
    .toISOString()
    .split("T")[0];



    const {error}=await supabaseClient
    .from("workout_history")
    .insert([{

        workout_id:id,

        completed_date:today,

        user_id:user.id

    }]);



    if(error){

        console.log(error);

        alert("Failed");

        return;

    }


    alert("Workout completed 🎉");


}



async function toggleFavorite(){


const {error}=await supabaseClient
.from("workouts")
.update({

favorite:
!currentWorkout.favorite

})
.eq(
"id",
currentWorkout.id
);



if(error){

console.log(error);

return;

}



alert("Updated ⭐");


loadWorkout();


}




loadWorkout();
