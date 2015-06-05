'use strict';


$(document).ready(function(){
setUsers();


var apiUrl = "http://localhost:3000/";

$('#users').on('click', function(event){
      var user_id = event.target.id;
      alert('user_id is ' + user_id);
      $.ajax({
        url: apiUrl + 'users/' + user_id,
        type: 'GET',
        dataType: 'json'
      })
      .done(function(user_data){
        alert(user_data);
        console.log(user_data);
        colors.renderColors(user_data.colors);
      })
    });



function setUsers(){
                $.ajax({
                type: 'GET',
                url: apiUrl + 'users/',
                dataType: 'json'
                })
                .done(function(users_data){
                users_data.forEach(function(user){
                $('#users').append('<p id="' + user.id + '">' + user.name + '</p>');
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
                $("#all-moviequotes").prepend('<div id="entry"></div><hr />');
                $("#entry").append('<p data-moviequote-id="'+moviequotes.id+'"><h3>' + moviequotes.quote + '</h3></p>');
                $("#entry").append('<button id="delete-moviequote-button" data-moviequote-id="' +moviequotes.id + '">Delete Movie Quote</button><br />');
                $("#entry").append('Guess the title: <br /><input type="text" name="guess" placeholder="Guess" id="new-guess">? <button id="submit-guess-button" data-moviequote-id="'+moviequotes.id+'">Submit Guess</button><br />');
                // $('#entry').append('<button id="update-moviequote-button" data-moviequote-id="' +moviequotes.id + '">Edit Movie Quote</button>');
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
    $.ajax({
        type: 'GET',
        url: apiUrl + "moviequotes/" + thisMoviequoteId,
        dataType: "json"
    }).done(function(response) {
        console.log(response.title);
        response.title;
        $("#entry").append('<p>' + guess + '?</p>');
            if (response.title === guess) {
                alert("we have a winner");
                $('#submit-guess-button').hide();
                $("#entry").append('SOLVED!');
            };

    }).fail(function() {
        alert("could not get title");
    });
});


// Delete a Movie Quote (DELETE)
$('body').on("click", '#delete-moviequote-button', function(moviequotes) {
        var thisMoviequoteId = $(this).attr('data-moviequote-id');
        console.log(thisMoviequoteId);
        $.ajax({
          type: 'DELETE',
          url: apiUrl + "moviequotes/" + thisMoviequoteId,
          dataType: "json"
        }).done(function(response) {
            alert("comment deleted");
    });
  });





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

