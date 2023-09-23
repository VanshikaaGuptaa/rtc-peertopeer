
// let AgoraRTM  = require('agora-rtm-sdk');
// import AgoraRTM, { createInstance } from 'agora-rtm-sdk';
// const { createInstance } = require('agora-rtm-sdk');
const AgoraRTM = require('agora-rtm-sdk');
let localStream;
let remoteStream;
let app_id = "4ae6d7cee58842ae9a645e5c48191df2"
let token = null;
let client;
let channel;

let uid = String(Math.floor(Math.random()*10000))
const servers ={
    iceServers :[
        {
            urls:['stun:stun3.l.google.com:19302','stun:stun2.l.google.com:19302']
        }
    ]


    
}

let init = async ()=>{
    if (!AgoraRTM) {
        console.error('AgoraRTM SDK is not properly initialized or imported.');
        return;
    }
    console.log("Before AgoraRTM.createInstance");
    client = await createInstance(app_id);
console.log("After AgoraRTM.createInstance");

    await client.login({uid, token})

    channel = client.createChannel('main')
    await channel.join()

    channel.on('MemberJoined', handleUserJoined)
    // channel.on('MemberLeft', handleUserLeft)

    // client.on('MessageFromPeer', handleMessageFromPeer)
    let handleUserJoined = async (MemberId) => {
        console.log('A new user joined the channel:', MemberId)
        createOffer(MemberId)
    }

    localStream = await navigator.mediaDevices.getUserMedia({video:true,audio:false})
    var vdo1=document.getElementById('vdo1')
    vdo1.srcObject = localStream;
   
    createoffer();
}
let createoffer = async()=>{
    peerconnect = new RTCPeerConnection(servers);
    remoteStream = new MediaStream();
    document.getElementById('vdo2').srcObject = remoteStream;


    localStream.getTracks().forEach((track) => {
        peerconnect.addTrack(track,localStream)
        
    });//adding tracks to localstream

    peerconnect.onTrack = (event)=>{
    EventTarget.streams[0].getTracks().forEach((track)=>{
        remoteStream.addTrack(track)
    })//adding tracks from remote client to remotestream
    }
    peerconnect.onicecandidate = async(event)=>{
        if(event.candidate){
            console.log('new candidate',event.candidate)
        }
    }
    //as we setlocaldescription onicecandidate is triggered and it start requesting ice candidates from stun server

    let offer = await peerconnect.createOffer();
    await peerconnect.setLocalDescription(offer)
    console.log(offer);

    

}

init()