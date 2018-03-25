$(document).ready(function(){
    
    var counter = 0;
    var itemNo = 0;
    var subTotal = 0;   
    var grdTotal = 0;
    var vat = 0;
  

    // var rcount = $('tr');

    // if(rcount < 1){
    //   $('#saveBtn').add
    // }

   $('#saveBtn').click(function(event){
    event.preventDefault();
    
    var desc = $('#description').val();
    var qty = parseInt($('#quantity').val());
    var unitCost = parseFloat($('#unitCost').val());
    var remarks = $('#rem').val();    

    // Clear form fields
    $('#description').val('');
    $('#quantity').val('');
    $('#unitCost').val('');
    $('#rem').val('');

    subTotal += qty * unitCost;
    vat += parseFloat((subTotal * 0.05).toFixed(2));
    grdTotal += subTotal + vat;

    itemNo++;
    counter++;

    var row = '<tr><td>' + itemNo +'</td><td class="xedit" id="desc">' + desc + '</td><td class="xedit" id="qty">' + qty + '</td><td class="xedit" id="unit">' + unitCost + '</td><td class="xedit" id="remarks">' + remarks + '</td></tr>';
    
    $('table tbody').append(row);
    $('.xedit').editable({
        type: 'text',        
        mode: 'inline'
      });

    $('#subT').text(subTotal);
    $('#subT2').text(grdTotal);
    $('#vat').text(vat);


    // sumTotal(qty, unitCost);


    
   });




   function sumTotal(qty, unitCost) {
    
    
}
});