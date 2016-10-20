var OptionsChartFactory={
	optionsAreaChart:{
        chart: {
            type: 'areaspline'
        },
        title: {  text: null  },
       xAxis: {

            categories: [],
             labels: {
                style: {
                    color: 'black',
                    fontSize:'8px'
                }},
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: { text: null },
            tickAmount: 5,
            gridLineWidth: 1,
            labels: {
                style: {
                    color: 'black',
                    fontSize:'8px'
                }},
            plotLines: [{
                value: 121,
                width: 1,
                color: 'orange'
            }]
        },
        credits: {  enabled: false },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.3 ,
                                                                                                                              color: '#D6EAF8'
              }
        },
        series: [{
            showInLegend: false,
            name: null,
            data: []
            }
        ]
    },
	optionsChartBar:{

    legend: {
            enabled: false
        },
        chart: {
            type: 'column'
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        xAxis: {
        gridLineWidth: 1,
            categories: [],
             labels: {
                style: {
                    color: 'black',
                    fontSize:'8px'
                }},
            crosshair: true
        },
        yAxis: {
					allowDecimals: false,
            min: 0,
            title: {
                text: null
            },
            alternateGridColor: '#EAFAF1',
            tickAmount: 4,
              gridLineWidth: 1,

                labels: {
                style: {
                    color: 'black',
                    fontSize:'8px'
                }},
            plotLines: [{
                value: 22,
                width: 1,
                color: 'red'
            }]

        },
       plotOptions: {
            series: {
                colorByPoint: true
            }
        },
        series: [{
            data: []
        }]
    },
	optionsChartLine:{
		chart: {
				renderTo:''
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
	            categories: []
	        },
	        yAxis: {
						  title: {
	                text: null
	            },
        	tickAmount: 4,
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
	          name: '',
	          data: []
	        }]
	    },
			getOptionsChart: function (serviceName) {
					switch (serviceName) {
						case 'PWS':
							return Object.assign({field:"AVG time",renderCategories:function(string){return string.substr(11,5)}},this.optionsChartLine);
							break;
						case 'CBI':
							return Object.assign({field:"Totale Logon",renderCategories:function(string){return string.substr(5,5)}},this.optionsChartBar);
							break;
					  case 'HB':
							return Object.assign({field:"AVG time",renderCategories:function(string){return string.substr(11,5)}},this.optionsChartLine);
							break;
						case 'FEAfirmati':
							return Object.assign({field:"#Signed",renderCategories:function(string){return string.substr(5,5)}},this.optionsChartBar);
							break;
						case 'Ticket':
							return Object.assign({field:"#Ticket",renderCategories:function(string){return string.substr(5,5)}},this.optionsChartBar);
							break;
							case 'atm':
								return Object.assign({field:"#Atm",renderCategories:function(string){return string}},this.optionsChartBar);
								break;
						case 'OperazioniSportello':
							return Object.assign({field:"#Operations",renderCategories:function(string){return string.substr(5,5)}},this.optionsChartBar);
							break;
						case 'CasseSportello':
							return Object.assign({field:"#Operations",renderCategories:function(string){return string.substr(11,5)}},this.optionsAreaChart);
							break;
						default: return Object.assign({},this.optionsChartLine);

					}
			}
};
