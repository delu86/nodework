let OptionsChartFactory=	{
			getOptionsChart: function (serviceName) {
				let optionsCharts={
				optionsAreaChart:{
							chart: {
									type: 'areaspline'
							},
							title: {  text: null  },
							subtitle: {
									text: "Area chart",
									floating: true,
									align: 'center' , y:0
							},
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
											format: '{value:.0f}',
											style: {
													color: 'black',
													fontSize:'8px'
											}},
									plotLines: [{
										zIndex:10,
											value: 121,
											width: 3,
											color: 'orange',
											dashStyle: 'shortdot'
									}]
							},
							credits: {  enabled: false },
							plotOptions: {
									areaspline: {
											fillOpacity: 0.7 ,
										color: '#e2d86a'
										}
							},
							series: [{ marker: {
									enabled: true,
									symbol: 'circle',
									radius: 3
						 },
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
									text: "Column chart",
									floating: true,
									align: 'center' , y:0
							},
							xAxis: {
							gridLineWidth: 1,
									categories: [],
									 labels: {
										 rotation:0,
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
									alternateGridColor: '#ECF0F4',
									tickAmount: 4,
										gridLineWidth: 1,

											labels: {
											style: {
													color: 'black',
													fontSize:'8px'
											}},
									plotLines: [{
										zIndex:10,
											value: 22,
											width: 2,
											color: 'red',
											dashStyle: 'shortdot'
									}]

							},
						 plotOptions: {
									series: {
											colorByPoint: false
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
					title:{text:null},
								subtitle: {
										text: "Line chart",
										floating: true,
										align: 'center' , y:0
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
										min:0,
								tickAmount: 4,
										gridLineWidth: 1,
												labels: {
												style: {
														color: 'black',
														fontSize:'8px'
												}},
												 alternateGridColor: '#E3E3E3',
										plotLines: [{
											  zIndex:10,
												value: 0.52,
												width: 2,
												color: 'red',
												dashStyle: 'shortdot'
										}]
								},
								series: [{
								 marker: {
										enabled: true,
										symbol: 'circle',
										radius: 3
							 },
									showInLegend: false,
									color: 'gray',
									name: '',
									data: []
								}]
						}};
						var filter=function(datetimeString){
							return Number(datetimeString.substr(11,2))>=8
						};
						var getMonthDay=function(datetimeString){
							return datetimeString.substr(5,5)};
						var getTime=function(datetimeString){
							return datetimeString.substr(11,5)
						}
					switch (serviceName) {
						case 'PWS':
							var ret= Object.assign({field:"TempoMedio",filterCategories:filter,fieldLabel:"AVG time",renderCategories:getTime},optionsCharts.optionsChartLine);
						  ret.subtitle.text="AVG time";
							ret.series[0].color="#F6546A";
							return ret;
							break;
						case 'CBI':
							var ret=Object.assign({field:"TotaleLogon",fieldLabel:"Totale Logon",renderCategories:getMonthDay},optionsCharts.optionsChartBar);
						  ret.subtitle.text="#Logon";
							ret.series[0].color="#b0e0e6";
							return ret;
							break;
					  case 'HB':
							var ret=Object.assign({field:"Durata",fieldLabel:"AVG time",filterCategories:filter,renderCategories:getTime},optionsCharts.optionsChartLine);
							ret.subtitle.text="AVG time";
							ret.series[0].color="#003366";
							return ret;
							break;
						case 'FEAfirmati':
							var ret= Object.assign({field:"firmati",fieldLabel:"#Signed",renderCategories:getMonthDay},optionsCharts.optionsChartBar);
							ret.subtitle.text="#Signed";
							ret.series[0].color="#20b2aa";
							return ret;
							break;
						case 'Ticket':
							var ret= Object.assign({field:"Pervenuti",fieldLabel:"#Ticket",renderCategories:getMonthDay},optionsCharts.optionsChartBar);
							ret.subtitle.text="#Ticket";
							ret.series[0].color="#a0db8e";
							return ret;
							break;
						case 'atm':
						var ret=  Object.assign({coloured:true,fieldLabel:"#Atm",renderCategories:function(string){return string}},optionsCharts.optionsChartBar);
					 			ret.subtitle.text="Indisponibili";
								return ret;
								break;
						case 'OperazioniSportello':
							var ret= Object.assign({field:"Operations",fieldLabel:"#Operations",renderCategories:getMonthDay},optionsCharts.optionsChartBar);
							ret.subtitle.text="#Operations";
							ret.series[0].color="#cbbeb5";
							return ret;
							break;
						case 'CasseSportello':
							var ret =Object.assign({field:"OpenCashesToday",fieldLabel:"#CasseAperte",renderCategories:getTime},optionsCharts.optionsAreaChart);
							ret.subtitle.text="#OpenCashes";
							return ret;
							break;
						case 'FEU_SintesiStatoCliente':
							var ret= Object.assign({field:"TempoMedio",fieldLabel:"AVG time(s)",renderCategories:getTime},optionsCharts.optionsChartLine);
							ret.subtitle.text="Avg time";
							ret.series[0].color="#660066";
							return ret;
							break;
						case 'FEU_QuadroDiControllo':
							var ret= Object.assign({field:"TempoMedio",fieldLabel:"AVG time(s)",renderCategories:getTime},optionsCharts.optionsChartLine);
							ret.subtitle.text="Avg time";
							ret.series[0].color="magenta";
							return ret;
							break;
					};

			}
};
