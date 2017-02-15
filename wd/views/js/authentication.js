$(function(){
  var password = '';
  var submitActionUrl = 'login';
  $(".inputValue").click(concatValueToPassword);
  function concatValueToPassword() {
    password += this.innerHTML
    $("#password").val(password);
    //console.log(password);
  }

  $("#cancel_button").click(undo);
  function undo(){
    password = password.substring(0,password.length-1);
    $("#password").val(password);
    //console.log(password);
  }

  $("#submit_button").click(submit);
  function submit(){
    var form = createForm({email:$("#email").val(),password:password});
    document.body.appendChild(form);
    form.submit();
  }
  function createForm(fields){
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", submitActionUrl);
    for(var key in fields){
      var hiddenField=createHiddenField(key,fields[key]);
      form.appendChild(hiddenField);
    }
    return form;
  }
  function createHiddenField(key,value){
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", value);
    return hiddenField;
  }
});
