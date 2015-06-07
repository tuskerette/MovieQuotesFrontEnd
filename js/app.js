'use strict';


$(document).ready(function(){
// var apiUrl = "https://ancient-fortress-5331.herokuapp.com/";
var apiUrl = "http://localhost:3000/";
var currentUser;
var userInfo = {};
setUsers();
skrollr.init();



// Set the fictional users
function setUsers(){
                $.ajax({
                    type: 'GET',
                    url: apiUrl + 'users/',
                    dataType: 'json'
                })
                .done(function(users_data){
                    users_data.forEach(function(user){
                    userInfo[user.id] = user.name;
                    $('.users').prepend('<button type="button" class="button-users btn btn-default" data-user-id="' + user.id + '">' + user.name + ' | Points: ' + user.points + '</button>');
                    $('.users').append('<div id="current-user"></div>');


                    // switch among the fictional users
                    $('button.button-users').on('click', function(event){
                          var user_id = $(this).data('user-id');

                          currentUser = user_id;
                          localStorage.setItem('id', user_id);
                          $('#current-user').html('<div><h5>The current player is </h5><h4>' + userInfo[currentUser] + '</h4></div>');
                         });
                    });
                    $('.users').prepend('<button type="button" class="button-reset-points btn btn-warning">Reset points for selected user</button>');
                }).fail(function(){
                    alert('Error getting users');
                 });
};


// Reset the points of the users (PATCH)
$('body').on("click", 'button.button-reset-points', function() {
                $.ajax({
                type: 'PATCH',
                url: apiUrl + "users/" + localStorage['id'] + "/reset_points",
                dataType: "json"
                    }).done(function(response) {
                    $('button[data-user-id="'+ response.id + '"]').html('<button type="button" class="button-users btn btn-default" data-user-id="' + response.id + '">' + response.name + ' | ' + response.points + '</button>');


                }).fail(function() {
                    alert("failed to reset points");
                });
    });




// Display the Movie Quotes (GET)
$('#refresh-button').click(function() {
    $("#all-moviequotes").html(' ');
        $.ajax({
            type: 'GET',
            url: apiUrl + "moviequotes/",
            dataType: "json"
        }).done(function(response) {
            response.forEach(function(moviequotes) {
                $("#all-moviequotes").prepend('<div class= "entry" data-entry-id="' + moviequotes.id + '"></div><hr />');
                var thisEntry = $('.entry[data-entry-id="' + moviequotes.id+ '"]');
                thisEntry.append('<div data-moviequote-id="'+moviequotes.id+'"><h3>"' + moviequotes.quote + '"</h3></div>');
                thisEntry.append('<button id="delete-moviequote-button" data-moviequote-id="' +moviequotes.id + '" class="btn btn-default">Delete Movie Quote</button><br />');
                thisEntry.append('Guess the title: <br /><div class="form-group"><input type="text" name="guess" class="form-control" placeholder="Guess" id="new-guess" data-moviequote-id="'+moviequotes.id+'"> <br /><button class="btn btn-default" id="submit-guess-button" data-moviequote-id="'+moviequotes.id+'">Submit Guess</button></div><br />');

            })
        }).fail(function() {
            alert("failed to display movie quotes");
        });
    });

// Create a new Movie Quote (POST)
$('#new-moviequote-button').click(function() {
        var moviequote = {
            quote: $('#new-quote').val(),
            title: $("#new-title").val().toLowerCase(),
        };
        $('#new-quote').val(' ');
        $('#new-title').val(' ');

        $.ajax({
            type: 'POST',
            url: apiUrl + "moviequotes/",
            data: {
                moviequote: moviequote
            },
            dataType: "json"
        }).done(function() {
            $('#refresh-button').click();

        }).fail(function() {
            alert("fail to submit new quote");
        });
    });

// Submit a guess (POST)
$('body').on("click", '#submit-guess-button', function(moviequotes) {
    var thisMoviequoteId = $(this).attr('data-moviequote-id');
    var guess = $('#new-guess[data-moviequote-id="' + thisMoviequoteId + '"').val().toLowerCase();
    var submitguess = {
        titleguess: guess,
        user_id: currentUser
    };

    $.ajax({
        type: 'POST',
        url: apiUrl + "moviequotes/" + thisMoviequoteId + "/guesses",
        dataType: "json",
        data: {
            guesses: submitguess
        }
    }).done(function(response) {
        var thisEntry = $('.entry[data-entry-id="' + thisMoviequoteId + '"]');
        thisEntry.append('<div class="guess" data-guess-id="' + thisMoviequoteId + '">' + guess + '? <em>by ' + userInfo[currentUser] +'</em></div>');


        // Retrieve the movie title from the DB to compare with the submitted guess
        var title;
        $.ajax({
         type: 'GET',
         url: apiUrl + "moviequotes/" + thisMoviequoteId,
         data: { moviequotes: {
             title: title}
            },
         dataType: "json"
            }).done(function(moviequotes) {
                var thisTitle = moviequotes.title;
            // if a user finds the solution, add one point
            if (thisTitle === guess) {
                $('#submit-guess-button[data-moviequote-id="'+moviequotes.id+'"]').hide();
                $('.entry[data-entry-id="' +thisMoviequoteId+ '"]').append('SOLVED!');
                $.ajax({
                type: 'POST',
                url: apiUrl + "users/" + localStorage['id'] + "/increment_points",
                dataType: "json"
                    }).done(function(response) {
                    response.points;
                    $('button[data-user-id="'+ response.id + '"]').html('<button type="button" class="button-users btn btn-default" data-user-id="' + response.id + '">' + response.name + ' | ' + response.points + '</button>');


                }).fail(function() {
                    alert("failed to increment points");
                });
            };
            // end of if statement


        }).fail(function() {
         alert("fail to retrieve title from db");
        });

    }).fail(function() {
        alert("could not post guess");
    });
});


// // FIX: trying to clean up the input guess field
// $('body').on("click",'#new-guess', function() {
//     console.log("i'm here, trying to clean");
//             $(this).val(' ');
//         });

// Delete a Movie Quote (DELETE)
$('body').on("click", '#delete-moviequote-button', function(moviequotes) {
        var thisMoviequoteId = $(this).attr('data-moviequote-id');
        $.ajax({
          type: 'DELETE',
          url: apiUrl + "moviequotes/" + thisMoviequoteId,
          dataType: "json"
        }).done(function(response) {
            $('#refresh-button').click();
    }).fail(function() {
        alert("failed to delete quote");
            })
  });


$('#refresh-button').click();
$('#refresh-button').addClass('invisible');




});

