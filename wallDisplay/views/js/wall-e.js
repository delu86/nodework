var WallE = function(jsonObject){
	this.servicesData=jsonObject.servizio;
	this.setColumnsClasses();
	this.intervalID=[];
  this.servicePanelClass="servicePanel";
  this.serviceColumnClass="col-md-";
  this.rowsClasses="row rowWallE"
}
WallE.prototype.render = function () {
  console.log(this.rowNum);
};

WallE.prototype.setColumnsClasses = function () {
  switch(this.servicesData.length){
    case 8: this.columnsClasses=this.serviceColumnClass+"3 "+this.servicePanelClass;
      this.rowNum=2
      break;
		case 7: this.columnsClasses=this.serviceColumnClass+"3 "+this.servicePanelClass;
      this.rowNum=2
      break;
		case 6: this.columnsClasses=this.serviceColumnClass+"4 "+this.servicePanelClass;
      this.rowNum=2
      break;
		case 5: this.columnsClasses=this.serviceColumnClass+"4 "+this.servicePanelClass;
      this.rowNum=2
      break;
		case 4: this.columnsClasses=this.serviceColumnClass+"5 "+this.servicePanelClass;
      this.rowNum=2
      break;
		case 3: this.columnsClasses=this.serviceColumnClass+"5 "+this.servicePanelClass
      this.rowNum=2
      break;
		case 2: this.columnsClasses=this.serviceColumnClass+"5 "+this.servicePanelClass;
      this.rowNum=2
      break;
		case 1: this.columnsClasses=this.serviceColumnClass+"6 "+this.servicePanelClass;
      this.rowNum=1
      break;
    default: this.columnsClasses=this.serviceColumnClass+"3 "+this.servicePanelClass;
      this.rowNum=Math.floor(this.servicesData.length/4) +1;
        break;
  }
};
