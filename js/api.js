var addon = '<br /><br />Append with <b>/username </b> and for XML add <b>/xml </b> to the end of the API call.';

$('#user').click(function() {
  $(this).toggle();
  $('#apiTitle').html('/api/user');
  $('#info').html('The user API can be used to get a users information.');
  $('#user1').toggle();
  toggleParents();
});
$('#friends').click(function() {
  $(this).toggle();
  $('#apiTitle').html('/api/friends');
  $('#info').html('The friends API can be used to get a users friends.');
  $('#friends1').toggle();
  toggleParents();
});
$('#chat').click(function() {
  $(this).toggle();
  $('#apiTitle').html('/api/chat');
  $('#info').html('The chat API can be used to get the chatrooms chat log.');
  $('#get').toggle();
  toggleParents();
});
$('#highscore').click(function() {
  $(this).toggle();
  $('#apiTitle').html('/api/highscore');
  $('#info').html('The highscore API can be used to get a users highscores.');
  $('#userget').toggle();
  toggleParents();
});
$('#coins').click(function() {
  $(this).toggle();
  $('#apiTitle').html('/api/coins');
  $('#info').html('The coins API can be used to get a users coin amount.');
  $('#userget').toggle();
  toggleParents();
});
$('#products').click(function() {
  $(this).toggle();
  $('#apiTitle').html('/api/products');
  $('#info').html('The products API can be used to get data on the products available at the webstore.');
  $('#get').toggle();
  toggleParents();
});
$('#search').click(function() {
  $(this).toggle();
  $('#apiTitle').html('/api/search');
  $('#info').html('The search API can be used to find users by their username.<br /><br />'+
    'Append the API call with your search query <b>(/query)</b>');
  toggleParents();
});

function toggleParents(){
  $('#user').toggle();
  $('#friends').toggle();
  $('#chat').toggle();
  $('#highscore').toggle();
  $('#coins').toggle();
  $('#products').toggle();
  $('#search').toggle();
}

$('#userinfo').click(function() {
  $('#apiTitle').html('/api/user/info');
  $('#info').append('</br></br> /info is used to retrieve the public user information of the given user.' + addon);
});

$('#userget').click(function() {
  $('#apiTitle').append('/get');
  $('#info').append('</br></br> /get is used to retrieve the desired value in JSON format.' + addon);
});

$('#get').click(function() {
  $('#apiTitle').append('/get');
  $('#info').append('</br></br> /get is used to retrieve the requested data in JSON format.<br /><br />'
    +'Append with <b>/xml </b> to retrieve the information in XML format.');
});

$('#friendget').click(function() {
  $('#apiTitle').html('/api/friends/get');
  $('#info').html('This API call is used to retrieve the friends of the given user' + addon);
});

$('#requests').click(function() {
  $('#apiTitle').html('/api/friends/requests');
  $('#info').html('This API call is used to retrieve the friend requests of the given user.' + addon);
});

$('#pending').click(function() {
  $('#apiTitle').html('/api/friends/pending');
  $('#info').html('This API call is used to retrieve the pending friend requests of the given user.' + addon);
});
