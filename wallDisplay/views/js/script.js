var ATM_SERVICE='atm';
var CBI_SERVICE='CBI';
var HB_SERVICE='HB';
var CASSE_SERVICE='CasseSportello';
var OPERAZIONI_SERVICE='OperazioniSportello';
var PWS_SERVICE='PWS';
var FEA_SERVICE='FEAfirmati';
var TICKET_SERVICE='Ticket';
var containerClass;
var titleCardClass;
var socket = io();
var wallDisplay;
$(function(){
	renderWallDisplay();
	// console.log((abi+'_'+connection_id).split("_")[0]);
	socket.on('json '+abi+'_'+connection_id+' response', function(jsonString){
		json=JSON.parse(jsonString);
        wallDisplay.update(json);
    // console.log("Aggiornato!!!!");
  });
	setInterval(refreshData, 60*1000);
});
function refreshData() {
    socket.emit('json request',abi+'_'+connection_id);
    // console.log("AGGIORNA");

}
function renderWallDisplay(){
	$.getJSON('/getJSON/'+abi,function(json){
	$("#title").text(json.abi_desc);
	//controlla l'esistenza dell'immagine di logo
	$.get("img/"+abi+".png")
    .done(function() {
    	$("#logo").attr("src", "img/"+abi+".png") 
        }).fail(function() { 
        $("#logo").attr("src", "img/bank.png")

    })
        wallDisplay=new WallDisplay(json);
        wallDisplay.render();
})
}
