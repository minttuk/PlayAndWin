var search = true;
var names = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    url: '/rest/search/collection/%QUERY',
    wildcard: '%QUERY'
  }
});

$('#remote .typeahead').typeahead(null, {
  name: 'name',
  displayKey: 'name',
  source: names,
  templates: {
    empty: ['<h5><b>' + $.i18n.prop('search_nouser',localStorage.getItem("lang")) + '</b></h5>'],
    suggestion: function(data){
          return '<div class="result" value="'+data.id+'"><img class="searchimage" src="'+data.image_url+'"><b>&nbsp;&nbsp;'+data.name+'</b></div>';
    }
  }
});

$('#search').click(function(){
  if (search) {
    mobileView();
    $('#remote').toggle(500);
    $('#searchbar').focus();
  }
  search = false;
});
$('#searchbar').focusout(function(){
  $('#remote .typeahead').typeahead('val', '');
  $('#remote').toggle(500, function(){
    mobileView();
  });
  setTimeout(function(){search = true;},500);
});

function mobileView(){
  if($( window ).width() < 500)
    $('#search').toggle();
}
