$(document).ready(function(){

  $('form').on('submit', function(){

    var s = document.forms["myForm"]["search"].value;
      var searchStr ={
        str: s
      };

      $.ajax({
        type: 'POST',
        url: '/socialsearch',
        data: searchStr,
        success: function(data){
          //do something with the data via front-end framework

          location.reload();
        }
      });
      return false;
  });
});
