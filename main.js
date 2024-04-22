let APP_ID = "68504c6825424058a4cc13229b05a38d";


let token = null;
let uid = String(Math.floor(Math.random() * 10000));

let client;
let channel;



let localStream;
let remoteStream;
let peerConnection;


const servers = {
    iceServers:[
        {
            urls:['stun:stun1.l.google.com:19302','stun:stun2.l.google.com:19302']
        }
    ]
}


let init = async () => {

    client = await AgoraRTM.createInstance(APP_ID);
    await client.login({uid, token})

    //index.html?room=234234
    channel = client.createChannel('main')
    await channel.join()

    channel.on('MemeberJoined', handleUserJoined)



    //ask for permission and display camera video on the page 
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        document.getElementById('user-1').srcObject = localStream;
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
    createOffer()
    
};


let handleUserJoined = async (MemberId) => {
    console.log('A new user joined the channel: ', MemberId)
}



let createOffer = async () => {
    peerConnection = new RTCPeerConnection(servers)


    remoteStream = new MediaStream()
    document.getElementById('user-2').srcObject = remoteStream;

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
    })

    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack()
        })
    }


    peerConnection.onicecandidate = async(event) => {
        if(event.candidate){
            console.log('New ICE Candidate: ', event.candidate)
        }

    }

    



    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    console.log('Offer: ', offer)


}

init();


//b9it f d9i9a 41 3lq wdit dek AgoraRTM.createInstance(APP_ID)