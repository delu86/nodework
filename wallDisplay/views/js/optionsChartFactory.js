let OptionsChartFactory=	{
			getOptionsChart: function (serviceName) {
				let optionsCharts={
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
										zIndex:10,
											value: 121,
											width: 6,
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
											width: 1,
											color: 'red'
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
												 alternateGridColor: '#E3E3E3',
										plotLines: [{
											  zIndex:10,
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
						return Object.assign({field:"TempoMedio",filterCategories:filter,fieldLabel:"AVG time",renderCategories:getTime},optionsCharts.optionsChartLine);
						break;
						case 'CBI':
						return Object.assign({field:"TotaleLogon",fieldLabel:"Totale Logon",renderCategories:getMonthDay},optionsCharts.optionsChartBar);
						break;
					  case 'HB':
						return Object.assign({field:"Durata",fieldLabel:"AVG time",filterCategories:filter,renderCategories:getTime},optionsCharts.optionsChartLine);
						break;
						case 'FEAfirmati':
						return Object.assign({field:"firmati",fieldLabel:"#Signed",renderCategories:getMonthDay},optionsCharts.optionsChartBar);
						break;
						case 'Ticket':
						return Object.assign({field:"Pervenuti",fieldLabel:"#Ticket",renderCategories:getMonthDay},optionsCharts.optionsChartBar);
						break;
						case 'atm':
								 return Object.assign({coloured:true,fieldLabel:"#Atm",renderCategories:function(string){return string}},optionsCharts.optionsChartBar);
								break;
						case 'OperazioniSportello':
							return Object.assign({field:"Operations",fieldLabel:"#Operations",renderCategories:getMonthDay},optionsCharts.optionsChartBar);
							break;
						case 'CasseSportello':
							return Object.assign({field:"OpenCashesToday",fieldLabel:"#Operations",renderCategories:getTime},optionsCharts.optionsAreaChart);
							break;
						default: return Object.assign({renderCategories:getTime},optionsCharts.optionsChartLine);
					};

			}
};
