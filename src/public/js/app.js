const socket = io();
const myFace = document.querySelector("#myFace");
const mute = document.querySelector("#mute")
const camera = document.querySelector("#camera")
const cameraSelect = document.querySelector("#cameraSelect");



let myStream;
let muted = false;
let cameraOff = false;



async function getCamera(){
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const newCameras = devices.filter(e => e.kind === 'videoinput');
        const currentDevice = myStream.getAudioTracks()[0];
        newCameras.forEach(device =>{
            const option = document.createElement("option");
            option.value = device.deviceId;
            option.innerHTML = device.label;
            if(currentDevice.label === device.label)
                option.selected = true;
            cameraSelect.appendChild(option);
        });
    } catch (error) {
        console.log(error);
    }
}

async function getMedia(deviceId){
    const initialConstraint = {
        audio:true,
        video:{facingMode : "user"}
    }
    const cameraConstraint = {
        audio:true,
        video: { deviceId: { exact: deviceId } }
    }
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
           deviceId ? cameraConstraint : initialConstraint
        );
        myFace.srcObject = myStream;
        if(!deviceId){
            await getCamera();
        }
    } catch (error) {
        console.log(error);
    }
}

const handleMuteBtn = () => {
    myStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    if(!muted){
        muted = true;
        mute.innerHTML = 'Unmute';
    }
    else{
        muted = false;
        mute.innerHTML = 'Mute';
    }
    }

const handleCameraBtn =() => {
    myStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    if(!cameraOff){
        cameraOff = true;
        camera.innerHTML = 'Turn Camera On';
    }
    else{
        cameraOff = false;
        camera.innerHTML = 'Turn Camera Off';
    }
}

async function handleCameraSelect(){
    await getMedia(cameraSelect.value);
}

mute.addEventListener("click",handleMuteBtn);
camera.addEventListener("click",handleCameraBtn);
cameraSelect.addEventListener("input",handleCameraSelect);


const room = document.querySelector("#room");
const call = document.querySelector("#chat");
const roomForm = room.querySelector("form");

call.hidden = true;

let roomName;

async function initCall(){
    room.hidden = true;
    call.hidden = false;
    await getMedia();
}

async function handelRoomForm(event){
    event.preventDefault();
    const input = roomForm.querySelector("input");
    await initCall();
    roomName = input.value;
    input.value = "";
}

roomForm.addEventListener("submit",handelRoomForm);