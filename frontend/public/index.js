$(document).ready(
	function(){

		var clearInputs = function() {
		  	$('#rFirstName').val("");
		  	$("#rLastName").val("");
		  	$("#rPassword").val("");
		  	$("#rConfirmPassword").val("");
		  	$("#rEmail").val("");
		  	$("#lEmail").val("");
		  	$("#lPassword").val("");
		}

		$( "#register" ).submit(function( event ) {
			event.preventDefault();

			var rawData = {
			  	firstname: $('#rFirstName').val(),
			  	lastname: $("#rLastName").val(),
			  	password: $("#rPassword").val(),
			  	username: $("#rEmail").val(),
			  	isInstructor: $('input[name=userType]:checked', '#register').val() === "Instructor" ? "True" : "False"
			};
			
			$.ajax({
			  type: "POST",
			  url: "http://127.0.0.1:8000/accounts/register",
			  data: rawData,
			  success: function(data) {
			  	alert(data);
			  	clearInputs();
			  },
			  error: function(data) {
			  	console.log(data);
			  }
			});
		});

		$( "#login" ).submit(function (event) {
			event.preventDefault();

			var rawData = {
				username: $("#lEmail").val(),
				password: $("#lPassword").val()
			}

			console.log(rawData);

			$.ajax({
				type: "POST",
				url: "http://127.0.0.1:8000/accounts/login",
				data: rawData,
				success: function(data) {
					alert(data);
					clearInputs();
				},
				error: function(data) {
					console.log(data);
				}
			});
		});
});