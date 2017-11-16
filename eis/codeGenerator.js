class SecretCodeGenerator {
  constructor(length=20,type=0) {
      this.length=length;
      switch (type) {
        case 2: this.possibleChars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
          break;
        case 1: this.possibleChars='0123456789';
          break;
        default:this.possibleChars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      }
  }
   generate(counter=this.length){
    return (counter==0)?'':
          this.possibleChars.charAt(Math.floor(Math.random() * this.possibleChars.length)).concat(this.generate(counter-1));
  }
}

module.exports = SecretCodeGenerator;
