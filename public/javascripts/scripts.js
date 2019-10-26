$(document).ready(function() {

   $('#storeButton').click(function(event){

       event.preventDefault();

       var id = $('#storeForm #inputStoreId').val();
       var key = $('#storeForm #inputStoreKey').val();
       var value = $('#storeForm #textareaStoreValue').val();

       $.post('/data', { id: id, encryption_key: key, value: value })
           .done(function(){
               Swal.fire('Good job!', 'Data has been stored.', 'success');
           })
           .catch(function(err){
               Swal.fire('Ups, a problem occurred', err.responseJSON.data.errors.join('<br />'), 'error');
           });
   });

    $('#fetchButton').click(function(event){

        event.preventDefault();

        var id = $('#fetchForm #inputFetchId').val();
        var key = $('#fetchForm #inputFetchKey').val();

        $.get('/data', { id: id, encryption_key: key })
            .done(function(results){
                Swal.fire('Good job!', 'Data has been fetch successfully.', 'success');

                let items = results.data.items.map(function(item){
                   return '<tr><td>' + item.id + '</td><td>' + item.value + '</td></tr>';
                });

                $('#fetchResults').html('<table class="table table-sm table-striped mt-3 mb-0"></table>');
                $('#fetchResults table').html('<thead><tr><th>Id</th><th>Value</th></tr></thead><tbody></tbody>');
                $('#fetchResults tbody').html(items.join('\n'));
            })
            .catch(function(err){
                Swal.fire('Ups, a problem occurred', err.responseJSON.data.errors.join('<br />'), 'error');
            });
    });
});
