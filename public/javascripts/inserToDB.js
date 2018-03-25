$(document).ready(() => {
  const saveToDB = function() {
    let description = [];
    let quantity = [];
    let cost = [];
    let remarks = [];
    let token = $('#token').val();
    let name = $('#invoiceName').text();
    let subTotal = $('#subT').text();
    let grandTotal = $('#subT2').text();
    let vat = $('#vat').text();
    let date = $('#date').text();

    $('#invoiceTable tr:gt(0)').each(() => {
      description.push($('td:eq(1)', this).text());
      quantity.push($('td:eq(2)', this).text());
      cost.push($('td:eq(3)', this).text());
      remarks.push($('td:eq(4)', this).text());
    });

    const tableData = {
      name,
      date,
      subTotal,
      grandTotal,
      vat,
      desc: description,
      qty: quantity,
      cost,
      remarks,
      _csrf: token,
    };
    // console.log(JSON.stringify(tableData));


    function finished(data) {
      // console.log(data);
      // $.Notification.notify('success','top middle', data);
      $.Notification.notify('custom', 'top center', data);
      setTimeout(() => {
        window.location.href = '/user/dashboard';
      }, 2000);
    }


    // POST table data to datase
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/create',
      data: JSON.stringify(tableData),
      success: finished,
      // headers: {'_csrf': token}
      dataType: 'json',
      contentType: 'application/json',
    });
  };

/**
 * Notifications
 */
!function($) {
    "use strict";

    let Notification = function() {};

    //simple notificaiton
    Notification.prototype.notify = function(style,position, title, text) {
        var icon = 'fa fa-adjust';
        if(style == "error"){
            icon = "fa fa-exclamation";
        }else if(style == "warning"){
            icon = "fa fa-warning";
        }else if(style == "success"){
            icon = "fa fa-check";
        }else if(style == "custom"){
            icon = "md md-album";
        }else if(style == "info"){
            icon = "fa fa-question";
        }else{
            icon = "fa fa-adjust";
        }
        $.notify({
            title: title,
            text: text,
            image: "<i class='"+icon+"'></i>"
        }, {
            style: 'metro',
            className: style,
            globalPosition:position,
            showAnimation: "show",
            showDuration: 0,
            hideDuration: 0,
            autoHide: true,
            clickToHide: true
        });
    },

    //auto hide notification
    Notification.prototype.autoHideNotify = function (style,position, title, text) {
        var icon = "fa fa-adjust";
        if(style == "error"){
            icon = "fa fa-exclamation";
        }else if(style == "warning"){
            icon = "fa fa-warning";
        }else if(style == "success"){
            icon = "fa fa-check";
        }else if(style == "custom"){
            icon = "md md-album";
        }else if(style == "info"){
            icon = "fa fa-question";
        }else{
            icon = "fa fa-adjust";
        }
        $.notify({
            title: title,
            text: text,
            image: "<i class='"+icon+"'></i>"
        }, {
            style: 'metro',
            className: style,
            globalPosition:position,
            showAnimation: "show",
            showDuration: 0,
            hideDuration: 0,
            autoHideDelay: 5000,
            autoHide: true,
            clickToHide: true
        });
    },
    //confirmation notification
    Notification.prototype.confirm = function(style,position, title) {
        var icon = "fa fa-adjust";
        if(style == "error"){
            icon = "fa fa-exclamation";
        }else if(style == "warning"){
            icon = "fa fa-warning";
        }else if(style == "success"){
            icon = "fa fa-check";
        }else if(style == "custom"){
            icon = "md md-album";
        }else if(style == "info"){
            icon = "fa fa-question";
        }else{
            icon = "fa fa-adjust";
        }
        $.notify({
            title: title,
            text: '<div class="clearfix"></div><br><a class="btn btn-sm btn-white yes">Yes</a> <a class="btn btn-sm btn-danger no">No</a>',
            image: "<i class='"+icon+"'></i>"
        }, {
            style: 'metro',
            className: style,
            globalPosition:position,
            showAnimation: "show",
            showDuration: 0,
            hideDuration: 0,
            autoHide: false,
            clickToHide: false
        });
        //listen for click events from this style
        $(document).on('click', '.notifyjs-metro-base .no', function() {
          //programmatically trigger propogating hide event
          $(this).trigger('notify-hide');
        });
        $(document).on('click', '.notifyjs-metro-base .yes', function() {
          //show button text
        //   alert($(this).text() + " clicked!");

        // Save to DB
        saveToDB();
          //hide notification
          $(this).trigger('notify-hide');
        });
    },
    //init - examples
    Notification.prototype.init = function() {

    },
    //init
    $.Notification = new Notification, $.Notification.Constructor = Notification
}(window.jQuery);






    // $('#addBtn').on('click', function(e){
    //     e.preventDefault();  

    // });


   
    
})

















































