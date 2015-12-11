// URL STRINGS

var queryBaseURL = "https://demo1.kaleosoftware.com/v4/search.json?sitemap_token=123456789&sitemap=sales";
var queryURL = queryBaseURL;

// 

var META;
var RESULTS = [];
var TAGS = [];

var bodyContainer = $('#body');
var navContainer = $('#nav-container');
var resultsContainer = $('#results-container');
var tagsContainer = $('#tags-container');
var searchField = $('#search-field');
var searchButton = $('#search-button');

var timeoutID = null;

var navTemplate = _.template($('.nav-template').html())
var tagTemplate = _.template($('.tag-template').html());
var resultTemplate = _.template($('.result-template').html());

// LOAD BASE URL QUERY ON PAGE LOAD

$(document).ready(function() {
	bodyContainer.hide();
   $.get(queryBaseURL)
   .done(function(results) {
   	 META = results.meta;
   	 console.log(META.next_link);
     RESULTS = results.collection;
     initPage();
   });
});

// DISPLAY INITIAL RESULTS

var initPage = function() {

	displayResults();
};

// DISPLAY RESULTS FUNCTION

function displayResults() {

	navContainer.hide();
	bodyContainer.hide();
	tagsContainer.hide();

	navContainer.empty();
	resultsContainer.empty();
	tagsContainer.empty();

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

 	var compiledTags = tagTemplate({
		tags: TAGS
	});

	var compiledNav = navTemplate({
		total_results: META.total_results,
		total_pages: META.total_pages,
		page: META.page,
		prev_link: "https://demo1.kaleosoftware.com" + META.prev_link,
		next_link: "https://demo1.kaleosoftware.com" + META.next_link
	});

	tagsContainer.append(compiledTags);

	navContainer.append(compiledNav);

	bodyContainer.fadeIn(200);
	tagsContainer.fadeIn(200);
	navContainer.fadeIn(200);

}

// EXECUTE SEARCH WHEN USER STOPS TYPING

searchField.keyup(function(e) {

	e.preventDefault();

	clearTimeout(timeoutID);
	timeoutID = setTimeout(function() {
		var searchTerm = searchField.val();
		queryURL = queryBaseURL + "&term=" + searchTerm.replace(/ /g, "%20");
		updateResults(queryURL);
	}, 200);

});

// UPDATE RESULT FUNCTION

function updateResults(url) {

	RESULTS = [];
	TAGS = [];

	$.get(url)
	.done(function(results) {
		META = results.meta;
		RESULTS = results.collection;
		displayResults();
	});

}

// TAG FILTER PRESSED

function filterByTag(tag) {
	var queryURLWithTag = queryURL + "&tags[]=" + tag.replace(/ /g, "&20");
	updateResults(queryURLWithTag);
}

// NAV BUTTON PRESSED

function searchByURL(navURL) {
	console.log(navURL);
	updateResults(navURL);
}