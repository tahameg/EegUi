$(document).ready(function() {
  $("#file-upload-form").find("#upload-button").click(function() {
    var form = $("#file-upload-form");
    var name = form.find("#data-name").val();
    console.log(name);
    if(name == ""){
          $("#name-error").html("Veriseti için isim girmelisiniz**")
          return;
    }
    var file = (form.find("#InputFile"))[0].files[0];
    var data = new FormData();
    data.append('name' , name);
    data.append('file' , file);
    $.ajax({
        type: "POST",
        enctype: "multipart/form-data",
        data: data,
        url: "/handle_file_upload",
        processData: false,
        contentType: false,
        cache: false,
        success: function (data) {
          console.log(data);

        },
        error: function (e) {
          console.log(e.responseText);
        }
    });

  });

  $("#file-upload-form").find("#InputFile").on('change', function() {
    var file = this.files[0];
    $("[for='InputFile']").filter(".custom-file-label").html("'" + file.name + "'" + " seçildi");
  });




});
