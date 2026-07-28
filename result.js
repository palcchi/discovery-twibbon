const video =
document.getElementById("video");


const download =
document.getElementById("download");


const status =
document.getElementById("status");



async function convert(){


const data =
sessionStorage.getItem("video");



if(!data){

status.innerHTML =
"Video tidak ditemukan";

return;

}



status.innerHTML =
"Loading converter...";



const {
createFFmpeg,
fetchFile
}
=
FFmpeg;



const ffmpeg =
createFFmpeg({

log:true,

corePath:
"https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js"

});



await ffmpeg.load();



status.innerHTML =
"Converting MP4...";



await ffmpeg.FS(
"writeFile",
"input.webm",
await fetchFile(data)
);



await ffmpeg.run(

"-i",
"input.webm",

"-c:v",
"libx264",

"-pix_fmt",
"yuv420p",

"-movflags",
"+faststart",

"output.mp4"

);



const file =
ffmpeg.FS(
"readFile",
"output.mp4"
);



const blob =
new Blob(
[
file.buffer
],
{
type:"video/mp4"
}
);



const url =
URL.createObjectURL(blob);



video.src=url;


video.classList.remove(
"hidden"
);



download.href=url;


download.download =
"twibbon.mp4";


download.classList.remove(
"hidden"
);



status.innerHTML =
"Done";


}



convert();