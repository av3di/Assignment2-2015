(function() {
  $.getJSON( '/igMediaCounts')
    .done(function( data ) {
      var yCounts = data.users.map(function(item){
        return item.counts.followed_by;
      });
      
      yCounts.unshift('Their Followers');

      var chart = c3.generate({
        bindto: '#chart',
        data: {
          columns: [
            yCounts 
          ],
          type: 'bar'
        },
        axis: {
          x: {
            label: {
                text: 'People You Follow',
                position: 'outer-center'
                // inner-right : default
                // inner-center
                // inner-left
                // outer-right
                // outer-center
                // outer-left
            }
          }
        }
      });
    });
})();

