'use strict';


$(document).ready(function(){
var apiUrl = "http://localhost:3000/";
var currentUser;
var userInfo = {};
setUsers();



// switch among the fictional users
// $('.users div').on('click', function(event){

//       var user_id = $(this).data('user-id');
//       currentUser = user_id;
//       $(this).append('<div><h4>The current user is ' + userInfo[currentUser] + ' (' + user_id + ')<=</h4></div>');
//      });



// set the fictional users
function setUsers(){
                $.ajax({
                    type: 'GET',
                    url: apiUrl + 'users/',
                    dataType: 'json'
                })
                .done(function(users_data){
                    console.log(users_data);
                    users_data.forEach(function(user){
                    userInfo[user.id] = user.name;
                    $('.users').prepend('<button type="button" class="button-users" data-user-id="' + user.id + '">' + user.name + '</button>');
                    $('.users').append('<div id="current-user"></div>')
                    console.log(userInfo);
                    // switch among the fictional users
                    $('button.button-users').on('click', function(event){
                          var user_id = $(this).data('user-id');
                          currentUser = user_id;
                          $('#current-user').html('<div><h4>The current user is ' + userInfo[currentUser] + ' (' + user_id + ')<=</h4></div>');
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
                thisEntry.append('<p data-moviequote-id="'+moviequotes.id+'"><h3>' + moviequotes.quote + '</h3></p>');
                thisEntry.append('<button id="delete-moviequote-button" data-moviequote-id="' +moviequotes.id + '">Delete Movie Quote</button><br />');
                thisEntry.append('Guess the title: <br /><input type="text" name="guess" placeholder="Guess" id="new-guess">? <button id="submit-guess-button" data-moviequote-id="'+moviequotes.id+'">Submit Guess</button><br />');

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
            alert("quote entered successfully");
        }).fail(function() {
            alert("fail to submit new quote");
        });
    });

//Submit a guess (POST)
$('body').on("click", '#submit-guess-button', function(moviequotes) {
    var thisMoviequoteId = $(this).attr('data-moviequote-id');
    var guess = $('#new-guess').val().toLowerCase();
    var submitguess = {
        titleguess: guess,
        user_id: currentUser
    };
    $('#new-guess').val(' ');

    $.ajax({
        type: 'POST',
        url: apiUrl + "moviequotes/" + thisMoviequoteId + "/guesses",
        dataType: "json",
        data: {
            guesses: submitguess
        }
    }).done(function(response) {
        $('.entry[data-entry-id="' + thisMoviequoteId + '"]').append('<p>' + guess + '? <em>by ' + userInfo[currentUser] +'</em></p>');
        // if a user finds the solution, add one point
            if (response.title === guess) {
                alert("we have a winner");
                $('#submit-guess-button').hide();
                $('.entry[data-entry-id="' + thisMoviequoteId+ '"]').append('SOLVED!');
                $.ajax({
                type: 'POST',
                url: apiUrl + "users/" + currentUser + "/increment_points",
                dataType: "json"
                    }).done(function(response) {
                    console.log(response.points);

                    // Increment points and show it by the user!!

                }).fail(function() {
                    alert("failed to increment points");
                });
            };


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
            alert("comment deleted");
    });
  });


$('#refresh-button').click();


// // Update a new Movie Quote (PATCH)
// $('body').on('click', '#update-moviequote-button', function(moviequotes) {
//         $('#update-moviequote').show();
//         $('body').on('click', '#edit-moviequote-button', function() {
//             var thisMoviequoteId = $('#update-moviequote-button').attr('data-moviequote-id');
//             var moviequote = {
//             quote: $('#update-quote').val(),
//             title: $("#update-title").val(),
//             };


//         $.ajax({
//             type: 'POST',
//             url: apiUrl + "moviequotes/" + thisMoviequoteId,
//             data: {
//                 moviequote: moviequote
//             },
//             dataType: "json"
//         }).done(function() {
//             alert("quote edited successfully");
//         }).fail(function() {
//             alert("fail to edit movie quote");
//         });
//     });
// });


});

