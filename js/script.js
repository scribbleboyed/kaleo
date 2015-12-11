var queryBaseURL = "https://demo1.kaleosoftware.com/v4/search.json?sitemap_token=123456789&sitemap=sales";
var queryURL = queryBaseURL;

var RESULTS = [];
var TAGS = [];

var bodyContainer = $('#body');
var resultsContainer = $('#results-container');
var tagsContainer = $('#tags-container');
var searchField = $('#search-field');
var searchButton = $('#search-button');

var timeoutID = null;

var tagTemplate = _.template($('.tag-template').html());
var resultTemplate = _.template($('.result-template').html());

$(document).ready(function() {
	bodyContainer.hide();
   $.get(queryBaseURL)
   .done(function(results) {
     RESULTS = results.collection;
     initPage();
   });
});

var initPage = function() {

	displayResults();
};

function displayResults() {

	bodyContainer.hide();

	resultsContainer.empty();

	if (RESULTS.length > 0) {
		RESULTS.forEach(function(result) {

			result.tag_names.forEach(function(tag) {
				if (TAGS.indexOf(tag) < 0) {
					TAGS.push(tag)
				}
			});

			var compiledResult = resultTemplate({
				title: result.title,
				id: result.id,
				status: result.status,
				board_name: result.board_name,
				tag_names: result.tag_names,
				views_count: result.views_count,
				answers_count: result.answers_count,
				created_at: result.created_at,
				url: result.url_anonymous
			});
			
			resultsContainer.append(compiledResult);
		});
	} else {
		resultsContainer.append('No Results Found')
	}

 	var compiledTags = tagTemplate({
		tags: TAGS
	});

	tagsContainer.append(compiledTags);

	bodyContainer.fadeIn(200);

}

searchField.keyup(function(e) {

	e.preventDefault();

	clearTimeout(timeoutID);
	timeoutID = setTimeout(function() {
		var searchTerm = searchField.val();
		queryURL = queryBaseURL + "&term=" + searchTerm.replace(/ /g, "%20");
		updateResults(queryURL);
	}, 200);

});

function updateResults(url) {

	RESULTS = [];

	$.get(url)
	.done(function(results) {
		RESULTS = results.collection;
		displayResults();
	});

}

function filterByTag(tag) {
	var queryURLWithTag = queryURL + "&tags[]=" + tag.replace(/ /g, "&20");
	console.log(queryURLWithTag);
	updateResults(queryURLWithTag);
}