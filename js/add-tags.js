let selectedTags = {


target:[],
category:[],
occasion:[]


};





function createTags(){


createTagGroup(
"targetTags",
workoutTags.target,
"target"
);



createTagGroup(
"categoryTags",
workoutTags.category,
"category"
);



createTagGroup(
"occasionTags",
workoutTags.occasion,
"occasion"
);



}





function createTagGroup(id,tags,type){


const box =
document.getElementById(id);



tags.forEach(tag=>{


const button =
document.createElement("button");


button.innerText=tag;


button.className="tag-button";



button.onclick=()=>{


if(
selectedTags[type]
.includes(tag)
){


selectedTags[type]
=
selectedTags[type]
.filter(
x=>x!==tag
);



button.classList.remove("selected");


}

else{


selectedTags[type]
.push(tag);


button.classList.add("selected");


}


};



box.appendChild(button);



});



}



createTags();