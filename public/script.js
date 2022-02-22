const localVideo = document.querySelector('#local'),
	remoteVideo = document.querySelector('#remote');

navigator.mediaDevices.getUserMedia({
	video: true,
	audio: true
}).then(localStream => {
	localVideo.srcObject = localStream;
	var peer = new Peer();
	peer.on('open', () => {
		document.querySelector('p').innerHTML = `Your id is ${peer.id}`;

		document.querySelector('button').onclick = function(){
			var id = window.prompt('Enter your recipients id');
			if(id == null) return;
			var call = peer.call(id, localStream);
			call.on('stream', remoteStream => {
				remoteVideo.srcObject = remoteStream;
			});
			call.on('close', () => remoteVideo.srcObject = null);
		};
		
		peer.on('call', call => {
			call.answer(localStream);
			call.on('stream', remoteStream => {
				remoteVideo.srcObject = remoteStream;
			});
			call.on('close', () => remoteVideo.srcObject = null);
		});
		
	});
});