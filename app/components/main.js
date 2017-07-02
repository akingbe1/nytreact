// Include React 
var React = require('react');

// Here we include all of the sub-components
var Form = require('./Children/Form');
var Results = require('./Children/Results');
var History = require('./Children/History');

// Helper Function
var helpers = require('./utils/helpers.js');

// This is the main component. 
var Main = React.createClass({

	// Here we set a generic state associated with the number of clicks
	getInitialState: function(){
		return {
			searchTerm: "",startYear: "",endYear: "",results: "",history: [] /*Note how we added in this history state variable*/
		}
	},	

	// This function allows childrens to update the parent.
	setTerm: function(term, startYear, endYear){
		this.setState({
			searchTerm: term,
			startYear: startYear,
			endYear: endYear
		})
	},



	// If the component changes (i.e. if a search is entered)... 
	componentDidUpdate: function(prevProps, prevState){

		if(prevState.searchTerm != this.state.searchTerm){
			console.log("UPDATED");

			// Run the query from NY Times
			helpers.runQuery(this.state.searchTerm, this.state.startYear, this.state.endYear)
				.then(function(data){
					if (data != this.state.results)
					{
						console.log(data);

						this.setState({
							results: data
						})
					} // end if
				}.bind(this)) // .then(function(data){	
						

			helpers.getHistory()
				.then(function(response){
					console.log( response.data);
					if (response != this.state.history){
						console.log ("Saved Articles", response.data);

						this.setState({
							history: response.data
						})
					}
				}.bind(this)) // then(function(response){
			
					
				
				
				
		} // end if(prevState.searchTerm
	},

	// The moment the page renders get the History
	componentDidMount: function(){

		// Get saved articles
		helpers.getHistory().then(function(response){
				console.log(response);
				if (response != this.state.history){
					console.log ("History", response.data);

					this.setState({
						history: response.data
					})
				}
			}.bind(this))
	},

	// Here we render the function
	render: function(){

		return(
			<div className="container">
				<div className="row">
					<div className="jumbotron">
						<h2 className="text-center">New York Times Search</h2>
						<p className="text-center">
							<em>Search for articles from The New York Times</em>
						</p>
					</div>
					<div className="col-md-12">					
						<Search setTerm={this.setTerm}/>
					</div>
					<div className="col-md-12">				
						<Results results={this.state.results} />
					</div>	
					<div className="col-md-12">
						 <Saved saved={this.state.history}/>
					</div>
				</div>
			</div>
		)
	}
});

// Export the component back for use in other files
module.exports = Main;