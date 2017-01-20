var Table = function(tableDivID,jsonData){
  var createRow=function(rowData){
    var rowHtmlString="<tr>";
    for(var key in rowData){
        rowHtmlString=rowHtmlString+"<td>"+rowData[key]+"</td>"
      }
    rowHtmlString=rowHtmlString+"</tr>";
    $("#"+tableDivID+"Body").append(rowHtmlString);
  }
  $("#"+tableDivID).append("<table class='table stripe hover compact row-border display cell-border' id='"+tableDivID+"T'><thead><tr id='"+tableDivID+"Head'></tr></thead><tfoot><tr id='"+tableDivID+"Foot'></tr></tfoot><tbody id='"+tableDivID+"Body'></tbody></table>");
  //console.log(jsonData);
  for(var key in jsonData.data[0]){
    //console.log(key);
    $("#"+tableDivID+"Head").append("<th>"+key+"</th>");
    $("#"+tableDivID+"Foot").append("<th>"+key+"</th>");
  }
  jsonData.data.forEach(createRow);
  $('#'+tableDivID+'T').DataTable({
    buttons: [
    'csv', 'excel'
    ],
    "order": [[ 0, "desc" ]],
    "paging":   false,
    "ordering": true,
    'sDom': 'Bt' ,
    "searching": false
  });
}
