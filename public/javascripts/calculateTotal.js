$(document).ready(() => {
//   let selYear;
//   let  selMonth;

  function showTotal(data) {
    // $.Notification.notify('custom', 'top center', data);
    document.getElementById('sumValue').innerHTML = `${data}`;
  }

  $('#totalBtn').on('click', () => {
    if ($('#year').prop('selectedIndex' || $('#month').prop('selectedIndex')) <= 0) {
      return alert('Please Select Year & Month');
    }

    const payload = {
      month: $('#month').prop('selectedIndex'),
      year: $('#year').val(),
      _csrf: $('#token').val(),
    };

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/user/total',
      data: JSON.stringify(payload),
      success: showTotal,
      // headers: {'_csrf': token}
      dataType: 'json',
      contentType: 'application/json',
    });
  });

  $('#totalBtnYear').on('click', () => {
    if ($('#year').prop('selectedIndex') <= 0) {
      return alert('Please Select Year');
    }

    const payload = {
      year: $('#year').val(),
      _csrf: $('#token').val(),
    };

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/user/total/year',
      data: JSON.stringify(payload),
      success: showTotal,
      // headers: {'_csrf': token}
      dataType: 'json',
      contentType: 'application/json',
    });
  });


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




});
