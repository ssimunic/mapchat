var socket = io();
var map;
var pos;

function initMap() {
  	map = new google.maps.Map(document.getElementById('map'), {
    	zoom: 2,
    	center: {lat: 0, lng: 0}
  	});
 
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			pos = {
        		lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			map.setCenter(pos);
			map.setZoom(4);
   		}, function() {
     		handleLocationError(true, infoWindow, map.getCenter());
		});
  	} else {
    	handleLocationError(false, infoWindow, map.getCenter());
	}
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  	infoWindow.setPosition(pos);
  	infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

$(document).ready(function(){
	var lastSend = 0;	
	$("#send-message").submit(function() {
		if(pos==null) return false;
		
		event.preventDefault();

        var d = new Date();
        var t = d.getTime();
        if(t - lastSend < 500) return false;
        lastSend = t;
		
		var message = $("#message").val();
		if(message === '') return false;
		
		var data = {
			pos: pos,
			message: message
		};
		
		socket.emit('data', data);
		
		$("#message").val('');		
	});

});

socket.on('data', function(data){
	var infoWindow = new google.maps.InfoWindow({map: map});
	
	infoWindow.setPosition(data.pos);
	infoWindow.setContent(data.message);
			
	setTimeout(function(){
		infoWindow.close();
	}, 5000);
});