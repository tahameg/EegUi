$(document).ready(function() {
  var tabPrefix = "channel-tab-";
  var contentPrefix = "channel-content-";
  var theData = null;// bu değişken daha sonra sayfadaki değişikliklerle güncellenecek ve
  //ve server bu veriye göre kendisini güncelleyecek
  $("#confirm-button").click(function() {
    $.ajax({
      url: '/workbench',
      success: function(result) {
        console.log("I did my job!");
      },
      async: false
    });
  });



  $("#file-upload-form").find("#upload-button").click(function() {
    var form = $("#file-upload-form");
    var name = form.find("#data-name").val();
    console.log(name);
    if (name == "") {
      $("#name-error").html("Veriseti için isim girmelisiniz**")
      return;
    }
    $("#name-error").html("")
    var file = (form.find("#InputFile"))[0].files[0];
    var data = new FormData();
    data.append('name', name);
    data.append('file', file);
    $.ajax({
      type: "POST",
      enctype: "multipart/form-data",
      data: data,
      url: "/handle_file_upload",
      processData: false,
      contentType: false,
      cache: false,
      success: function(data) {
        theData = data;
        if (data.result == "success") {
          renderDataView(data.custom);
        } else {
          console.log(data.msg);
        }

      },
      error: function(e) {
        console.log(e.responseText);
      }
    });

  });

  $("#file-upload-form").find("#InputFile").on('change', function() {
    var file = this.files[0];
    $("[for='InputFile']").filter(".custom-file-label").html("'" + file.name + "'" + " seçildi");
  });

  $("#test-button").click(function() {

  });

  var renderDataView = function(analysisData) { //data.custom alır
    $("#file-upload").remove();
    $.get("../static/parts/dataedit.html", function(html_data) {
      $("body").append(html_data);
      $("#id").text(analysisData.id);
      $("#name").text(analysisData.name);
      $("#filename").text(analysisData.filename);
      $("#n-channel").text(analysisData.n_channel);
      $("#n-samples").text(analysisData.n_samples);
      $("#frequency").text(analysisData.frequency);
      $("#duration").text(analysisData.duration);
      for (var i = 0; i < analysisData.annotationTags.length; i++) {
        if (i != analysisData.annotationTags.length - 1)
          $("#annotationTags").append(analysisData.annotationTags[i] + " : ");
        else
          $("#annotationTags").append(analysisData.annotationTags[i]);

      }
      $("#annotationTags").text();
      $("#file-directory").text(analysisData.name);
      $("#technician-text").text(analysisData.header.techician);
      $("#admincode-text").text(analysisData.header.admincode);
      $("#record-addit-text").text(analysisData.header.recording_additional);
      $("#pat-name-text").text(analysisData.header.patientname);
      $("#pat-addit-text").text(analysisData.header.patient_additional);
      $("#pat-gender-text").text(analysisData.header.gender);
      $("#birthdate-text").text(analysisData.header.birthdate);
      $("#startdate-text").text(analysisData.header.startdate);
      $.ajax({
        url: '../static/parts/channelinfo.html',
        success: function(result) {
          renderChannels(analysisData, result);
        },
        async: false
      });
    });
  }
  var renderChannels = function(datasetArray, channelHtml) {
    //channel-tabs id li ul elemanının içine li elemanı ekle. class  nav-item olacak. içine bir a ekle. class "nav-link olacak
    $("#channel-tabs").empty();
    $("#channel-contents").empty();
    for (var i = 0; i < datasetArray.signals.length; i++) {
      var ch = datasetArray.signals[i].channel;
      var index = ch.index;
      var returnArray;
      if (i == 0)
        returnArray = createChannelTab(tabPrefix + index, contentPrefix + index, true);
      else
        returnArray = createChannelTab(tabPrefix + index, contentPrefix + index, false);

      var tag = returnArray[0].find("a").text(ch.label);
      var tabContent = returnArray[1];
      tabContent.append(channelHtml);
      tabContent.find("[name=index]").text(ch.index);
      tabContent.find("[name=label]").text(ch.label);
      tabContent.find("[name=dimension]").text(ch.dimension);
      tabContent.find("[name=physical-max]").text(ch.physical_max);
      tabContent.find("[name=physical-min]").text(ch.physical_min);
      tabContent.find("[name=digital-max]").text(ch.digital_max);
      tabContent.find("[name=digital-min]").text(ch.digital_min);
      tabContent.find("[name=prefilter]").text(ch.prefilter);
      tabContent.find("[name=transducer]").text(ch.transducer);
    }
  }

  var createChannelTab = function(tabID, contentID, state) { //tab ID goes to tab, contentID goes to content, state is true for active false for passive
    var tabsParent = $("#channel-tabs");
    var contentsParent = $("#channel-contents");

    var tabElement = $("<li class='nav-item'></li>")
    var tabElementLink = $("<a class='nav-link' id='" + tabID + "' data-toggle='pill' href='#" + contentID + "' role='tab' aria-controls='" + contentID + "' aria-selected='false'></a>");
    tabElement.append(tabElementLink);
    tabsParent.append(tabElement)

    var contentElement = $("<div class='tab-pane fade' id='" + contentID + "' role='tabpanel' aria-labelledby='" + tabID + "'></div>");
    contentElement.appendTo(contentsParent);

    if (state) {
      tabElementLink.addClass("active").attr("aria-selected", "true");
      contentElement.addClass("show active")
    }

    return [tabElement, contentElement];

  }
});
