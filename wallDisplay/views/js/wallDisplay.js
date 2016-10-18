var chart;
var optionsChart={
	chart: {
			renderTo:'containerChartPWS'
	},
        title: {
            text: null,
            x: 0 //center
        },
        subtitle: {
            text: null,
            x: 0
        },
        xAxis: {
         gridLineWidth: 1,
         labels: {
                style: {
                    color: 'black',
                    fontSize:'8px'
                }
                },
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: null
            },
                                                                                              tickAmount: 5,
            gridLineWidth: 1,
                labels: {
                style: {
                    color: 'black',
                    fontSize:'8px'
                }},
                 alternateGridColor: '#FDFFD5',
            plotLines: [{
                value: 0.52,
                width: 1,
                color: 'red'
            }]
        },
        series: [{
         marker: {
            enabled: false,
            symbol: 'circle',
            radius: 7
       },
          showInLegend: false,
          color: 'gray',
            name: 'Tokyo',
            data: [0.23, 0.6, 0.5, 0.5, 0.2, 0.5, 0.07, 0.32, 0.34, 0.18, 0.13, 0.9]
        }]
    };
var WallDisplay = function(jsonObject){
	this.servicesData=jsonObject.lastRel.servizio;
	this.metaData=jsonObject.metaData.servizio;
	this.setHtmlClasses();
	this.intervalID=[];
}


WallDisplay.prototype.setHtmlClasses = function() {
		switch(this.servicesData.length){
		case 8: this.assignHtmlClasses("containerSmall container","titleCardSmall titleCard");
				    break;
		case 7: this.assignHtmlClasses("containerSmall container","titleCardSmall titleCard");
				    break;
		case 6: this.assignHtmlClasses("containerMedium container","titleCardMedium titleCard");
				    break;
		case 5: this.assignHtmlClasses("containerMedium container","titleCardMedium titleCard ");
				    break;
		case 4: this.assignHtmlClasses("containerLarge container","titleCardLarge titleCard");
				    break;
		case 3: this.assignHtmlClasses("containerLarge container","titleCardLarge titleCard");
				    break;
		case 2: this.assignHtmlClasses("containerLarge container","titleCardLarge titleCard");
				    break;
		case 1: this.assignHtmlClasses("containerFull container","titleCardFull titleCard");
				    break;
	}
};
WallDisplay.prototype.assignHtmlClasses=function(containerClass,titleCardClass){
	this.containerClass=containerClass;
	this.titleCardClass=titleCardClass;
}
WallDisplay.prototype.render=function() {
	for (var i = this.servicesData.length - 1; i >= 0; i--) {
		this.displayService(this.servicesData[i]);
	}
	chart=new Highcharts.Chart(optionsChart);

}
WallDisplay.prototype.update=function(jsonObject){
	chart.destroy();
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
			$("#"+service.nomeservizio).append("<div class='header' id='header"+service.nomeservizio+"'></div>");
			$("#header"+service.nomeservizio).append("<h5 class='"+this.titleCardClass+"'>"+this.getServiceLabel(service.nomeservizio)+"</h5>")
			$("#"+service.nomeservizio).append("<p class='total' id='total"+service.nomeservizio+"'></p>");
			$("#"+service.nomeservizio).append("<h4 class='field' id='field"+service.nomeservizio+"'></h4>");
			$("#"+service.nomeservizio).append("<div class='containerChart' id='containerChart"+service.nomeservizio+"'></div>");
      // $("#"+service.nomeservizio).append("<h4 class='logtime' id='logtime"+service.nomeservizio+"'></h4>");

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
	$("#logtime"+service.nomeservizio).html("<i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i>"+service.rilevazioni[0].logtime.substr(11,5));
	insertValueText(service,values[counter],service.rilevazioni[0].logtime.substr(11,2),service.rilevazioni[0].logtime.substr(14,2));
	if(values.length>1)
		{counter++;
		this.intervalID.push(setInterval(function(){
							    insertValueText(service,values[counter],service.rilevazioni[0].logtime.substr(11,2),service.rilevazioni[0].logtime.substr(14,2));
								if(++counter==values.length)
									counter=0;}, 5*1000));
	}
}
WallDisplay.prototype.getServiceLabel = function (serviceName) {
		for (var i = 0; i < this.metaData.length; i++) {
			if(this.metaData[i].nomeservizio===serviceName){
				return this.metaData[i].labelservizio;
			}
		}
  return serviceName;
};
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
		// 	$("#delta"+service.nomeservizio).attr("style","color:red");
		// 	$("#delta"+service.nomeservizio).text("+"+delta.toFixed(1)+'%');
		$("#total"+service.nomeservizio).text(valueText);
		// $("#field"+service.nomeservizio).attr("style","color:red");
	$("#field"+service.nomeservizio).html(data.label+" <span style=\"color:red\"> +"+delta.toFixed(1)+'% </span>');
	 }
	 else{
		 $("#total"+service.nomeservizio).text(valueText);
		//  $("#field"+service.nomeservizio).attr("style","color:green");
		 $("#field"+service.nomeservizio).html(data.label+" <span style=\"color:green\">"+delta.toFixed(1)+'% </span>');
	 }

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
