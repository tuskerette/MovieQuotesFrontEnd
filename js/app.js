'use strict';


$(document).ready(function(){
// var apiUrl = "https://ancient-fortress-5331.herokuapp.com/";
var apiUrl = "http://localhost:3000/";
var currentUser;
var userInfo = {};
setUsers();



// set the fictional users
function setUsers(){
                $.ajax({
                    type: 'GET',
                    url: apiUrl + 'users/',
                    dataType: 'json'
                })
                .done(function(users_data){
                    users_data.forEach(function(user){
                    userInfo[user.id] = user.name;
                    $('.users').prepend('<button type="button" class="button-users" data-user-id="' + user.id + '">' + user.name + ', ' + user.points + '</button>');
                    $('.users').append('<div id="current-user"></div>')

                    // switch among the fictional users
                    $('button.button-users').on('click', function(event){
                          var user_id = $(this).data('user-id');

                          currentUser = user_id;
                          localStorage.setItem('id', user_id);
                          $('#current-user').html('<div><h4>The current user is ' + userInfo[currentUser] + '</h4></div>');
                         });
                    })
                }).fail(function(){
                    alert('Error getting users');
                 });
};

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
                thisEntry.append('<div data-moviequote-id="'+moviequotes.id+'"><h3>' + moviequotes.quote + '</h3></div>');
                thisEntry.append('<button id="delete-moviequote-button" data-moviequote-id="' +moviequotes.id + '">Delete Movie Quote</button><br />');
                thisEntry.append('Guess the title: <br /><input type="text" name="guess" placeholder="Guess" id="new-guess" data-moviequote-id="'+moviequotes.id+'">? <button id="submit-guess-button" data-moviequote-id="'+moviequotes.id+'">Submit Guess</button><br />');

            })
        }).fail(function() {
            alert("failure");
        });
    });

// Create a new Movie Quote (POST)
$('#new-moviequote-button').click(function() {
        var moviequote = {
            quote: $('#new-quote').val().toLowerCase(),
            title: $("#new-title").val().toLowerCase(),
        };
        $('#new-quote').val(' ');
        $('#new-title').val(' ')

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

//Submit a guess (POST)
$('body').on("click", '#submit-guess-button', function(moviequotes) {
    var thisMoviequoteId = $(this).attr('data-moviequote-id');
    console.log(thisMoviequoteId);
    var guess = $('#new-guess[data-moviequote-id="' + thisMoviequoteId + '"').val().toLowerCase();
    console.log(guess);
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
        thisEntry.append('<div>' + guess + '? <em>by ' + userInfo[currentUser] +'</em></div>');

        // // if a user finds the solution, add one point
        //     if (response.titleguess === guess) {

        //         alert("we have a winner");
        //         $('#submit-guess-button').hide();
        //         $('.entry[data-entry-id="' +thisMoviequoteId+ '"]').append('SOLVED!');
        //         $.ajax({
        //         type: 'POST',
        //         url: apiUrl + "users/" + localStorage['id'] + "/increment_points",
        //         dataType: "json"
        //             }).done(function(response) {
        //             response.points;

        //             $('button[data-user-id="'+ response.id + '"]').html('<button type="button" class="button-users" data-user-id="' + response.id + '">' + response.name + ', ' + response.points + '</button>');


        //         }).fail(function() {
        //             alert("failed to increment points");
        //         });
        //     };
             $('#new-guess').val(' ');


    }).fail(function() {
        alert("could not post guess");
    });
});




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




});

