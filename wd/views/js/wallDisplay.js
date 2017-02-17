var WallDisplay = function(jsonObject){
	this.servicesData=jsonObject.lastRel.servizio;
	this.metaData=jsonObject.metadata.servizi;
	this.tresholds=jsonObject.tresholds;
	//console.log(this.tresholds);
	this.setHtmlClasses();
	this.intervalID=[];
	this.charts=[];
}

WallDisplay.prototype.setHtmlClasses = function() {
	this.assignHtmlClasses("containerSmall container","titleCardSmall titleCard");
};

WallDisplay.prototype.assignHtmlClasses=function(containerClass,titleCardClass){
	this.containerClass=containerClass;
	this.titleCardClass=titleCardClass;
}
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
	//distrugge i grafici precedentemente creat	i
	this.charts.map(function(chart){
		chart.destroy();
	});
	this.charts=[];
	//contiene gli id per annullare lo scorrimento dei dati nei container
	//una volta che i dati vengono aggiornati
	this.intervalID=[];
	this.servicesData=jsonObject.lastRel.servizio;
	this.metaData=jsonObject.metadata.servizi;
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
			this.setUpHeaderCard(service);
			this.setUpBodyCard(service);
			this.setUpChart(service);
			this.setUpFooterCard(service);
		}else{
			this.drawChart(service);
		}
}
WallDisplay.prototype.setUpChart = function (service) {
	$("#"+service.nomeservizio).append("<div class='containerChart' id='containerChart"+service.nomeservizio+"'></div>");
	this.drawChart(service);
};
WallDisplay.prototype.drawChart=function(service){
	var chartsArray=this.charts;
	var optionsChart=OptionsChartFactory.getOptionsChart(service.nomeservizio);
    if(optionsChart.field!=undefined){
			if(service.nomeservizio.substr(0,3)!='FEU')
	  		optionsChart.yAxis.plotLines[0].value=this.tresholds[service.nomeservizio.toUpperCase()];
			else
				optionsChart.yAxis.plotLines[0].value=this.tresholds['FEU'];

}
	$.getJSON('/getJSON/'+abi+'/'+service.nomeservizio+'?date='+dateString,function(json){
		if(optionsChart.coloured==true)
    	optionsChart.plotOptions.series.colorByPoint=optionsChart.coloured;
    optionsChart.chart.renderTo='containerChart'+service.nomeservizio;
		optionsChart.series[0].name=optionsChart.fieldLabel;
		optionsChart.xAxis.categories=json.categories
																			.filter(function(obj){
                                        if(optionsChart.filterCategories)
																					return optionsChart.filterCategories(obj)
																				else return true
																			})
																			.map(function(obj){
																					return optionsChart.renderCategories(obj)
    																		});
   optionsChart.series[0].data=json.data.map(Number).slice(json.data.length-optionsChart.xAxis.categories.length);
		chartsArray.push(new Highcharts.Chart(optionsChart));
		});
}

WallDisplay.prototype.setUpHeaderCard = function (service) {
	$("#"+service.nomeservizio).append("<div class='headerCard' id='header"+service.nomeservizio+"'></div>");
	$("#header"+service.nomeservizio).append("<h5 class='"+this.titleCardClass+"'>"+this.getServiceLabel(service.nomeservizio)+"</h5>");
	$("#header"+service.nomeservizio).css({"cursor":"pointer"});
	$("#header"+service.nomeservizio).click(function(){
				//location.href='servicePage?abi='+abi+'&service='+service.nomeservizio+'&date='+dateString;
				window.open('servicePage?abi='+abi+'&service='+service.nomeservizio+'&date='+dateString, '_blank');
			})
};
WallDisplay.prototype.setUpBodyCard = function (service) {
	$("#"+service.nomeservizio).append("<div class='info' id='info"+service.nomeservizio+"'></div>");
	$("#info"+service.nomeservizio).append("<p class='total' id='total"+service.nomeservizio+"'></p>");
	$("#info"+service.nomeservizio).append("<h4 class='field' id='field"+service.nomeservizio+"'></h4>");
};
WallDisplay.prototype.setUpFooterCard = function (service) {
	$("#"+service.nomeservizio).append("<div class='footerCard' id='footer"+service.nomeservizio+"'></div>");
	$("#footer"+service.nomeservizio).append("<h4 class='logtime' id='logtime"+service.nomeservizio+"'></h4>");
};

WallDisplay.prototype.insertValuesIntoContainer=function(service) {
var thisWall=this;
var values=[];
	for(var key in service.rilevazioni[0]){
		var meta=this.getMetaData(service.nomeservizio,key);
		if(!(meta===null))
			values.push({"name":key, "value":service.rilevazioni[0][key], "treshold":meta.treshold,
									 "label":meta.label, "type":meta.type});
	}
	var counter=0;
	$("#logtime"+service.nomeservizio).html("<i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i>"+service.rilevazioni[0].logtime.substr(0,16));
	thisWall.insertValueText(service,values[counter],service.rilevazioni[0].logtime.substr(11,2),service.rilevazioni[0].logtime.substr(14,2));
	if(values.length>1)
		{counter++;
		this.intervalID.push(setInterval(function(){
							    thisWall.insertValueText(service,values[counter],service.rilevazioni[0].logtime.substr(11,2),service.rilevazioni[0].logtime.substr(14,2));
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
				for (var n = 0; n < this.metaData[i].meta.length; n++) {
					if(this.metaData[i].meta[n].name===key)
						return {"treshold":0,"label":this.metaData[i].meta[n].label,
										"type":this.metaData[i].meta[n].TipoDato};
				}
			}
		}
  return null;
};
WallDisplay.prototype.insertValueText=function(service,data,hour,minutes) {
	var valueText=this.setValueText(data.value);
	$("#total"+service.nomeservizio).text(valueText);
	$("#field"+service.nomeservizio).html(data.label)
}

WallDisplay.prototype.setValueText=function(value){
	if (value>=10*1000&&value<1000*1000) {
		return (value/1000).toFixed(2).toString()+"K";
	}else if (value>1000*1000) {
		return (value/1000000).toFixed(2).toString()+"M";
	}else{
		return value.toString();
	}
}
