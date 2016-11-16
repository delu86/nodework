var Table = function(tableDivID,jsonData){
  var createRow=function(rowData){
    var rowHtmlString="<tr>";
    for(var key in rowData){
        rowHtmlString=rowHtmlString+"<td>"+rowData[key]+"</td>"
      }
    rowHtmlString=rowHtmlString+"</tr>";
    $("#"+tableDivID+"Body").append(rowHtmlString);
  }
  $("#"+tableDivID).append("<table class='table stripe hover' id='"+tableDivID+"T'><thead><tr id='"+tableDivID+"Head'></tr></thead><tbody id='"+tableDivID+"Body'></tbody></table>");
  //console.log(jsonData);
  for(var key in jsonData.data[0]){
    //console.log(key);
    $("#"+tableDivID+"Head").append("<th>"+key+"</th>");
  }
  jsonData.data.forEach(createRow);
  $('#'+tableDivID+'T').DataTable({
    "order": [[ 0, "desc" ]],
    "paging":   false,
    "ordering": true,
    "info":     false,
    "searching": false
  });
}
