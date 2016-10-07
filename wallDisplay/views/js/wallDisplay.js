var WallDisplay = function(jsonObject){
	this.servicesData=jsonObject.servizio;
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
	this.servicesData=jsonObject.servizio;
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
			$("#"+service.nomeservizio).append("<h4 class='logtime' id='logtime"+service.nomeservizio+"'></h4>");
			$("#"+service.nomeservizio).append("<div class='footer' id='footer"+service.nomeservizio+"></div>");
			$("#footer"+service.nomeservizio).append("<h5 class='"+this.titleCardClass+"'>"+service.nomeservizio+"</h5>");	
    }

}

WallDisplay.prototype.insertValuesIntoContainer=function(service) {
	var values=[];
	for(var key in service.rilevazioni[0]){
		if(!(key==='logtime'))
			values.push({name:key, value:service.rilevazioni[0][key]});
	}
	var counter=0;
	$("#logtime"+service.nomeservizio).html("<i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i><i>"+service.rilevazioni[0].logtime.substr(10,9));
	insertValueText(service,values[counter].value,values[counter].name);
	if(values.length>1)	
		{counter++;
		this.intervalID.push(setInterval(function(){
							    insertValueText(service,values[counter].value,values[counter].name);
								if(++counter==values.length)
									counter=0;}, 5*1000));

	}
}

insertValueText=function(service,value,field) {
	$("#total"+service.nomeservizio).text(value);
	$("#field"+service.nomeservizio).text(field);
}