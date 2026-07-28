const canvas =
document.getElementById("canvas");


const ctx =
canvas.getContext("2d");


const upload =
document.getElementById("upload");


const generate =
document.getElementById("generate");


const loading =
document.getElementById("loading");



const TOTAL_FRAME = 385;

const FPS = 23.976;

const PHOTO_START = 130;



let frames=[];

let userImage=null;



let photo={

x:0,

y:0,

scale:1

};



let dragging=false;

let lastX=0;

let lastY=0;



async function preload(){


for(let i=1;i<=TOTAL_FRAME;i++){


let img=new Image();


img.src =
`assets/peserta/maba_${String(i).padStart(5,"0")}.png`;



await new Promise(resolve=>{


img.onload=resolve;


});



frames.push(img);


}



draw(385);


}



preload();





function draw(frameNumber){


ctx.clearRect(
0,
0,
1350,
1080
);



if(
userImage &&
frameNumber>=PHOTO_START
){


ctx.save();


ctx.translate(
photo.x,
photo.y
);


ctx.scale(
photo.scale,
photo.scale
);



ctx.drawImage(
userImage,
0,
0,
1350,
1080
);



ctx.restore();


}



ctx.drawImage(
frames[frameNumber-1],
0,
0,
1350,
1080
);


}




upload.onchange=e=>{


const img=new Image();


img.onload=()=>{


userImage=img;


draw(385);


};



img.src=
URL.createObjectURL(
e.target.files[0]
);


};





canvas.onpointerdown=e=>{


dragging=true;


lastX=e.offsetX;

lastY=e.offsetY;


};



canvas.onpointermove=e=>{


if(!dragging)return;



photo.x +=
(e.offsetX-lastX)*2;


photo.y +=
(e.offsetY-lastY)*2;



lastX=e.offsetX;

lastY=e.offsetY;



draw(385);


};



canvas.onpointerup=()=>{

dragging=false;

};




canvas.onwheel=e=>{


e.preventDefault();



photo.scale +=
e.deltaY < 0 ?
0.05 :
-0.05;



photo.scale=Math.max(
0.5,
Math.min(
3,
photo.scale
)
);



draw(385);


};





generate.onclick=()=>{


loading.classList.remove(
"hidden"
);



let stream =
canvas.captureStream(
FPS
);



let recorder =
new MediaRecorder(
stream
);



let chunks=[];



recorder.ondataavailable=e=>{


if(e.data.size){

chunks.push(e.data);

}


};



recorder.onstop=()=>{


const blob =
new Blob(
chunks,
{
type:"video/webm"
}
);



const reader =
new FileReader();



reader.onload=()=>{


sessionStorage.setItem(
"video",
reader.result
);



location.href=
"result.html";


};



reader.readAsDataURL(blob);



};





recorder.start();



let current=1;



function render(){


draw(current);



current++;



if(current<=TOTAL_FRAME){


setTimeout(
render,
1000/FPS
);


}

else{


recorder.stop();


}



}



render();



};