var ServiceDetailsChart= function(jsonData,options){
  var optionsChart={
    chart: {
        backgroundColor: 'rgba(247,247,247,0.5)',
        type: 'line',
        renderTo:'chart1'
    },
    title: {
           text: '',
           x: -20 //center
       },
       subtitle: {
           text: '',
           x: -20
       },
       xAxis: {
           categories: []
       },
       yAxis: [{
         min:0,
         labels: {
         //format: '{value:.0f}',
           style: {
               color: Highcharts.getOptions().colors[0]
           }
       },plotLines: [{
             value: 0,
             width: 1,
             color: '#808080'
         }],
           title: {
               text: ''
           }},
           {opposite:true,
            min:0,
             labels: {
               style: {
                   color: Highcharts.getOptions().colors[1]
               }
           },
               title: {
                   text: ''
               }}],
      tooltip: {
           valueSuffix: ''
       },
       legend: {
           layout: 'horizontal',
           align: 'center',
           verticalAlign: 'bottom',
           borderWidth: 0
       },
       series: []
     };
  for(var i=0;i<options.series.length;i++){
    optionsChart.series.push({data:[]});
  }
  optionsChart.chart.renderTo=options.renderTo;
  jsonData.data.forEach(function(el){
    optionsChart.xAxis.categories.push(el[options.category]);
    for(var i=0;i<options.series.length;i++){
        var seriesName=options.series[i].name;
        var seriesType=options.series[i].type;
        var isOpposite=options.series[i].opposite;
        var suffixLabel=options.series[i].suffixLabel;
        if(seriesType!=null)
            optionsChart.series[i].type=seriesType;
        if(isOpposite)
            optionsChart.series[i].yAxis=1;
        if(suffixLabel)
           optionsChart.tooltip.valueSuffix=suffixLabel;
        optionsChart.series[i].name=seriesName;
        optionsChart.title.text=options.title
        optionsChart.series[i].data.push(el[seriesName]);
    }

    //optionsChart.series[1].data.push(el.errori);
  });
  var chart=new Highcharts.Chart(optionsChart);
}
