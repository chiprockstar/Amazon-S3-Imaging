// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
// require bootstrap-sprockets
// require turbolinks
//= require load-image.all.min
//= require canvas-to-blob.min
//= require jquery.ui.widget
//= require z.jquery.fileupload
//= require jquery.fileupload-process
//= require jquery.fileupload-image
//= require jquery.iframe-transport
//= require bootstrap
//= require dropzone
// require_tree .

var x = 1;
$(function() {
  $('.directUpload').find("input:file").each(function(i, elem) {
    var fileInput    = $(elem);
    var form         = $(fileInput.parents('form:first'));
    var submitButton = form.find('input[type="submit"]');
    var progressBar  = $("<div class='bar' style='width:200px;'></div>");
    var barContainer = $("<div class='progress' ></div>").append(progressBar);

    fileInput.after(barContainer);
    fileInput.fileupload({
      dropZone: $('#dropzone'),
      fileInput:       fileInput,
      url:             form.data('url'),
      type:            'POST',
      autoUpload:       true,
      formData:         form.data('form-data'),
      paramName:        'file', // S3 does not like nested name fields i.e. name="user[avatar_url]"
      dataType:         'XML',  // S3 returns XML if success_action_status is set to 201
      replaceFileInput: false,
      //disableImageResize: /Android(?!.*Chrome)|Opera/
      //  .test(window.navigator && navigator.userAgent),
      disableImageResize: false,
      imageMaxWidth: 600,
    //  imageMaxHeight: 400,
      imageCrop: false, // Force cropped images
      add: function(e, data) {
        $.blueimp.fileupload.prototype.options.add.call(this, e, data);
      },
      progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        progressBar.css('width', progress + '%')
      },
      start: function (e) {
        submitButton.prop('disabled', true);
        $( ".progress" ).css( "visibility", "visible");
        $( ".submit" ).css( "visibility", "visible");

        progressBar.
          css('height', '20px').
          css('padding-bottom', '20px').
        //  css('background', 'green').
          css('display', 'block').
          css('width', '0%').
          text("Loading...");
      },
      done: function(e, data) {
        submitButton.prop('disabled', false);
        progressBar.text("Uploading done");

        // extract key and generate URL from response
        var key   = $(data.jqXHR.responseXML).find("Key").text();
        var url   = '//' + form.data('host') + '/' + key;

        // create hidden field
      //  var input = $("<input />", { type:'hidden', name: fileInput.attr('name'), value: url })
      //  var input = $("<input />", { type:'text', name: 'name[]', value: '' })
      //  var form_name = form.append(input);
      //  $('#some_target').appendTo(form_name);
        var input = $("<input />", { type:'hidden', name: 'avatar_url[]', value: url });
        form.append(input);
        var input = $("<input />", { type:'hidden', name: fileInput.attr('name'), value: url })
        form.append(input);
        $('<p id="me'+ x + '" style=float:left;margin:1px;width:200px;1px;padding:1px;></p>').prependTo('#some_target');
        // var input = $("<input />", { type:'text', name: 'name[]', value: '', width: '180px' });
        var input = "<textarea name='name[]' style='width:180px'></textarea>"
        $('#me' + x + '' ).append(input);
        $('#me' + x + '' ).append('</br>');

        // load image
      //  $('#some_target').empty();
        loadImage(url, 200, 200, '#me' + x + '');
        x = x + 1;


      },
      fail: function(e, data) {
        submitButton.prop('disabled', false);

        progressBar.
          css("background", "red").
          text("Failed");
      }
    });
  });
});
