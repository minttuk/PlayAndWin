var names = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    url: '/Backend/php/controller.php?q=searchUsers&query=%QUERY',
    wildcard: '%QUERY'
  }
});

$('#remote .typeahead').typeahead(null, {
  name: 'name',
  displayKey: 'name',
  source: names,
  templates: {
    empty: ['<h4><b>No users found!</b></h4>'
    ],
    suggestion: function(data){
          return '<a class="resultlink" href="/profile/'+data.name
          +'"><div class="result"><img class="searchimage" src="/images/user/'
          +data.image+'"><b>&nbsp;&nbsp;'+data.name+'</b></div></a>';
    }
  }
});
