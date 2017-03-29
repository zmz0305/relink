import React from 'react';

module.exports = function(type, url, data, success, error) {    
  $.support.cors = true;
	// $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
	//   options.crossDomain ={
	//     crossDomain: true
	//   };
	//   options.xhrFields = {
	//     withCredentials: true
	//   };
	// });

	$.ajax({
	  type: type,
	  url: "http://127.0.0.1:8000" + url,
	  async: true,
	  data: data,
	  xhrFields: {
	    withCredentials: true,
	    crossDomain: true
	  },
	  success: function(data){
	    success(data);
	  },
	  error: function(data){
	    error(data);
	  }
	});
}