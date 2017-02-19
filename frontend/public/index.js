$(document).ready(
	function(){
		$( "#register" ).submit(function( event ) {
			event.preventDefault();
			
			$.ajax({
			  type: "POST",
			  url: "http://127.0.0.1:8000/accounts/register",
			  data: {
			  	firstname: $('#rFirstName').val(),
			  	lastname: $("#rLastName").val(),
			  	password: $("#rPassword").val(),
			  	username: $("#rEmail").val()
			  },
			  success: function(data) {
			  	console.log("success");
			  },
			  error: function(data) {
			  	console.log(data);
			  },
			  complete: function(data) {
			  	console.log(data);
			  }
			});

			
		});
});