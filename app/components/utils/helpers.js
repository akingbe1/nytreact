// Include the axios package for performing HTTP requests (promise based alternative to request)
var axios = require('axios');

var nytAPI = "9014215c21954e19b56078a56cdfeeed";


// Helper Functions for making API calls
var helpers = {

	// This function serves our purpose of running the query to geolocate. 
	runQuery: function(searchTerm, startYear, endYear){
			console.log(searchTerm, startYear, endYear);
			
			
			// Query NY Times
			var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + authKey + "&q=" + searchTerm + "&limit=5";
			if (parseInt(startYear)) {

			// Add the necessary fields
				startYear = startYear;

				queryURL = queryURL + "&begin_date=" + beginYear// Add the date information to the newly created URL variable
			
			} // end if

			if(parseInt(endYear)){

				// Add the necessary fields
				endYear = endYear + "1231";
				
				// Add the date information to the newly created URL variable
				queryURL = queryURL + "&end_date=" + endYear;
			} // end if
			console.log('queryURL: ' + queryURL)
			
			return new Promise(function(resolve, reject) {

			axios.get(queryURL)
			.then(function(response){
				console.log(response);
				var results =[];
				for (var i = 0; i < response.data.response.docs.length; i++) {
					results.push({
						title: response.data.response.docs[i].headline.main, 
						pubDate: response.data.response.docs[i].pub_date, 
						url: response.data.response.docs[i].web_url
					})
				}
					if (results.length != 0) {
						console.log(results);
						resolve(results);
					} else {
						reject(Error("error"));
					}
			});

				
		})
	},


	// This function hits our own server to retrieve the record of query results
	getSaved: function(){

		return axios.get('/saved')
			.then(function(response){

				console.log(response);
				return (response);
			});
	},

	// This function posts new searches to our database.
	postSaved: function(){
		
		return axios.post('/saved', {
			title: article.theTitle,
			pubDate: article.theDate, 
			url: article.theUrl
		})
			.then(function(results){

				console.log("Posted to MongoDB");
				return(results);
			})
	},

	deleteSaved: function(id){

		return axios.delete('/saved', {_id: id})
			.then(function(results){

				console.log("Deleted from  MongoDB");
				return(results);
			})
	}

}


// We export the helpers function 
module.exports = helpers;