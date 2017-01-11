console.log("JS good to go, sir!");

$('.put-form').on('submit', function(e) {
  e.preventDefault();
  var element = $(this);
  var url = element.attr('action');
  var formData = element.serialize();
  $.ajax({
    method: 'PUT',
    url: url,
    data: formData
  }).done(function(data) {
    // get data returned from the PUT route
    console.log(data);

    // refresh the page we're on using GET to display the item details.
    window.location = url;
  });
});

$('.delete-ispublic-link').on('click', function(e) {
  e.preventDefault();
  var element = $(this);
  console.log('this',e.target);
  var url = element.attr('href');
  $.ajax({
    method: 'DELETE',
    url: url
  }).done(function(data) {
    window.location = '/posts';
  });
});

$('.delete-draft-link').on('click', function(e) {
  e.preventDefault();
  var element = $(this);
  console.log('this',e.target);
  var url = element.attr('href');
  $.ajax({
    method: 'DELETE',
    url: url
  }).done(function(data) {
    window.location = '/posts/draft';
  });
});
