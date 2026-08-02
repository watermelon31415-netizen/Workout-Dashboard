async function saveWorkout(){


const user = await getCurrentUser();


if(!user){

alert("Please login first");

return;

}



const file =
document.getElementById("imageInput").files[0];


let imageUrl = "";


// 上传图片

if(file){


const fileName =
Date.now() + "-" + file.name;



const {error:uploadError}
=
await supabaseClient
.storage
.from("workout-images")
.upload(fileName,file);



if(uploadError){

console.log(uploadError);

alert("Image upload failed");

return;

}



const {data:urlData}
=
supabaseClient
.storage
.from("workout-images")
.getPublicUrl(fileName);



imageUrl =
urlData.publicUrl;


}





const workout={


title:
document.getElementById("title").value,



video_url:
document.getElementById("video_url").value,



image_url:
imageUrl,



duration:
Number(
document.getElementById("duration").value
),



targets:
selectedTags.target,


category:
selectedTags.category,


occasions:
selectedTags.occasion,



difficulty:
document.getElementById("difficulty").value,



notes:
document.getElementById("notes").value,



favorite:false,



// ⭐ 新增
user_id:
user.id


};






const {data,error}
=
await supabaseClient
.from("workouts")
.insert([workout]);



if(error){

console.log(error);

alert(error.message);

}

else{


alert("Workout saved 💪");


window.location.href="workouts.html";


}


}
