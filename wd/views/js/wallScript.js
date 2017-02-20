var socket = io();
var wallDisplay;
  $( function() {
    setBackground();
    $("#logout").click(function(){
      location.href='/logout'
    });
    $("#datepicker").datepicker({
       dateFormat: 'yy-mm-dd',
       onSelect: function(d) {
            $("#datepicker").datepicker("setDate", dateString);
            //close calendar
            $(this).blur();
            window.open('/'+abi+'?date='+d, '_blank');

        }
    }).datepicker("setDate", dateString);
    renderWallDisplay();
	// console.log((abi+'_'+connection_id).split("_")[0]);
	socket.on('json '+abi+'_'+connection_id+' response', function(jsonString){
		json=JSON.parse(jsonString);
        wallDisplay.update(json);
        //console.log("Aggiornato!!!!");
  });
  //update only real-time data
  if(dateString===todayDate)
	 setInterval(refreshData, 60*1000);
});
function refreshData() {
    socket.emit('json request',abi+'_'+dateString+'_'+connection_id);
     //console.log("AGGIORNA");

}
function setBackground(){
  if(date.getMonth()==11){
    $("body").css('background-image','url(img/snow-background.jpg)')
  }

}
function renderWallDisplay(){
	$.getJSON('/getJSON/'+abi+'?date='+dateString,function(json){
    $("#title").text(json.lastRel.abi_desc);
	//controlla l'esistenza dell'immagine di logo
        wallDisplay=new WallDisplay(json);
        wallDisplay.render();
})
}
