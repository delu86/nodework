var WallDisplay = function(jsonObject){
	this.servicesData=jsonObject.lastRel.servizio;
	this.metaData=jsonObject.metaData.servizio;
	this.setHtmlClasses();
	this.intervalID=[];
}
WallDisplay.prototype.setHtmlClasses = function() {
		switch(this.servicesData.length){
		case 8: this.containerClass="containerSmall container";
				this.titleCardClass="titleCardSmall titleCard";
				break;
		case 7: this.containerClass="containerSmall container";
				this.titleCardClass="titleCardSmall titleCard";
				break;
		case 6: this.containerClass="containerMedium container";
				this.titleCardClass="titleCardMedium titleCard";
				break;
		case 5: this.containerClass="containerMedium container";
		        this.titleCardClass="titleCardMedium titleCard ";
				break;
		case 4: this.containerClass="containerLarge container";
				this.titleCardClass="titleCardLarge titleCard";
				break;
		case 3: this.containerClass="containerLarge container"
				this.titleCardClass="titleCardLarge titleCard";
				break;
		case 2: this.containerClass="containerLarge container";
				this.titleCardClass="titleCardLarge titleCard";
				break;
		case 1: this.containerClass="containerFull container";
				this.titleCardClass="titleCardFull titleCard";
				break;
	}
};
WallDisplay.prototype.render=function() {
	for (var i = this.servicesData.length - 1; i >= 0; i--) {
		this.displayService(this.servicesData[i]);
	}
}
WallDisplay.prototype.update=function(jsonObject){
	//distrugge gli intervalli di scorrimento impostati nella funzione insertValuesIntoContainer
	for (var i = this.intervalID.length - 1; i >= 0; i--) {
		clearInterval(this.intervalID[i]);
	}
	//contiene gli id per annullare lo scorrimento dei dati nei container
	//una volta che i dati vengono aggiornati
	this.intervalID=[];
	this.servicesData=jsonObject.lastRel.servizio;
	this.metaData=jsonObject.metaData.servizio;
	this.render();
}
WallDisplay.prototype.displayService=function(service) {
    this.setUpContainer(service);
    this.insertValuesIntoContainer(service);
}

WallDisplay.prototype.setUpContainer=function(service) {
	//crea solo se non esiste il div
	if (!$('#'+service.nomeservizio).length){
      $("#wallDisplay").append("<div class='"+this.containerClass+"' id='"+service.nomeservizio+"'><div>");
			$("#"+service.nomeservizio).append("<p class='total' id='total"+service.nomeservizio+"'></p>");
			$("#"+service.nomeservizio).append("<h4 class='field' id='field"+service.nomeservizio+"'></h4>");
			$("#"+service.nomeservizio).append("<h1 class='delta' id='delta"+service.nomeservizio+"'></h1>");
			$("#"+service.nomeservizio).append("<h4 class='logtime' id='logtime"+service.nomeservizio+"'></h4>");
			$("#"+service.nomeservizio).append("<div class='footer' id='footer"+service.nomeservizio+"'></div>");
			$("#footer"+service.nomeservizio).append("<h5 class='"+this.titleCardClass+"'>"+service.nomeservizio+"</h5>");
    }

}

WallDisplay.prototype.insertValuesIntoContainer=function(service) {
var values=[];
	for(var key in service.rilevazioni[0]){
		var meta=this.getMetaData(service.nomeservizio,key);
		if(!(meta===null))
			values.push({"name":key, "value":service.rilevazioni[0][key], "treshold":meta.treshold,
									 "label":meta.label, "type":meta.type});
	}
	var counter=0;
	$("#logtime"+service.nomeservizio).html("<i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i><i>"+service.rilevazioni[0].logtime.substr(11,5));
	insertValueText(service,values[counter],service.rilevazioni[0].logtime.substr(11,2),service.rilevazioni[0].logtime.substr(14,2));
	if(values.length>1)
		{counter++;
		this.intervalID.push(setInterval(function(){
							    insertValueText(service,values[counter],service.rilevazioni[0].logtime.substr(11,2),service.rilevazioni[0].logtime.substr(14,2));
								if(++counter==values.length)
									counter=0;}, 5*1000));
	}
}
WallDisplay.prototype.getMetaData = function (serviceName,key) {
		for (var i = 0; i < this.metaData.length; i++) {
			if(this.metaData[i].nomeservizio===serviceName){
				for (var n = 0; n < this.metaData[i].soglie.length; n++) {
					if(this.metaData[i].soglie[n][key]!=undefined)
						return {"treshold":this.metaData[i].soglie[n][key],"label":this.metaData[i].soglie[n].label,
										"type":this.metaData[i].soglie[n].TipoDato};
				}
			}
		}
  return null;
};
insertValueText=function(service,data,hour,minutes) {
	var valueText=setValueText(data.value);
	delta=calculateDelta(data.value,data.treshold,data.type,hour,minutes);
	if(delta>0){
		$("#delta"+service.nomeservizio).attr("style","color:red");
		$("#delta"+service.nomeservizio).text("+"+delta.toFixed(1)+'%');
	}
	else{
		$("#delta"+service.nomeservizio).attr("style","color:green");
		$("#delta"+service.nomeservizio).text(delta.toFixed(1)+'%');
	}
  $("#total"+service.nomeservizio).text(valueText);
	$("#field"+service.nomeservizio).text(data.label);
}

setValueText=function(value){
	if (value>=10*1000&&value<1000*1000) {
		return (value/1000).toFixed(2).toString()+"K";
	}else if (value>1000*1000) {
		return (value/1000000).toFixed(2).toString()+"M";
	}else{
		return value.toString();
	}
}
calculateDelta=function(val,treshold,valType,hour,minutes) {
  if(valType==="Progressivo"){
		treshold=treshold*(((parseInt(hour)*60+parseInt(minutes))-8*60)/600);
	}
	if(treshold!=0)
		return 100*(val-treshold)/treshold;
	else
		return 0
}
