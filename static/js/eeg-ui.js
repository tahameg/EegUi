$(document).ready(function() {
  var theData = null;
  var updateDataSync = function() {
    $.ajax({
      type: "POST",
      url: '/get_data',
      success: function(result) {
        theData = result.custom;
        $("#file-directory").text(theData.name);
        console.log(result.msg);
      },
      async: false
    });
  }



  var getNthChannelSignal = function(n) {
    if (theData != null) {
      if (n < theData.n_channel) {
        return {
          array: [theData.time, theData.signals[n].signalData],
          channel: theData.signals[n].channel
        };
      } else {
        console.log("invalid number of channels");
      }
    } else {
      console.log("the data is empty");
    }
  }

  function drawFFT(n) {
    layout = {
      title: {
        text: 'Frekans - Genlik'
      },
      xaxis: {
        title: "Frekans (Hz)"
      },
      yaxis: {
        title: "Genlik"
      },
      height: 600
    };

    tempY = theData.signals[n].freqData;
    tempX = theData.freqs;

    data2draw = [{
      x: tempX,
      y: tempY
    }];

    Plotly.newPlot("fft-plot-1", data2draw, layout);
  }

  function drawStft(n) {
    var stft = theData.signals[n].stftData;
    colorscale = [
      [0, "#3404ff"],
      [0.25, "#64eafe"],
      [0.5, "#5eff29"],
      [0.6, "#e8ff00"],
      [1, "#ee2700"]
    ];
    data2draw = [{
      z: stft[2],
      x: stft[1],
      y: stft[0],
      zmin: 0,
      zmax: 15,
      type: "heatmap",
      colorscale: colorscale
    }];

    layout = {
      title: 'Frekans - Zaman - Genlik Grafiği',
      width: 1000,
      height: 700,
      xaxis: {
        title: "Zaman (s)",
        automargin: true
      },
      yaxis: {
        title: "Frekans (Hz)"
      },
      annotations: [],
      colorbar: {
        title: "Genlik"
      }
    }

    for (k = 0; k < theData.epochs.length; k++) {
      epoch = theData.epochs[k];
      annotation = {
        xref: 'x',
        yref: 'paper',
        x: theData.time[epoch.low_time_idx],
        y: 1,
        text: epoch.annotation.tag
      };
      layout.annotations.push(annotation);
    }
    Plotly.newPlot('stft-plot-1', data2draw, layout);

  }


  var getDataArray2DrawLine = function() {
    var return_array = new Array();
    for (i = 0; i < theData.n_channel; i++) {
      channelData = getNthChannelSignal(i);
      var toPush = {
        x: channelData.array[0],
        y: channelData.array[1],
        yaxis: 'y' + (i + 1),
        name: channelData.channel.label
      };
      return_array.push(toPush);
    }
    return return_array;
  }
  var getLayout = function(plot_type, name) {
    var nchannels = theData.n_channel;
    if (plot_type == "all_channels_time") {
      var returnDict = {
        title: {
          text: 'Zaman Serisi Çizgi Grafiği'
        },
        height: nchannels * 30,
        annotations: [

        ],
        shapes: [],
        grid: {
          rows: nchannels,
          columns: 1,
          subplots: [],
          roworder: 'top to bottom'
        }
      };
      for (i = 0; i < nchannels; i++) {
        returnDict.grid.subplots.push('xy' + (i + 1));
      }
      for (k = 0; k < theData.epochs.length; k++) {
        epoch = theData.epochs[k];
        annotation = {
          xref: 'x',
          yref: 'paper',
          x: theData.time[epoch.low_time_idx],
          y: 1,
          text: epoch.annotation.tag
        };
        returnDict.annotations.push(annotation);
        line = {
          type: 'line',
          xref: 'x',
          yref: 'paper',
          x0: theData.time[epoch.low_time_idx],
          y0: 0,
          x1: theData.time[epoch.low_time_idx],
          y1: 1,
          line: {
            color: 'rgb(150, 150, 150)',
            opacity: "0.1",
            width: 1
          }
        };
        returnDict.shapes.push(line);
      }
    } else if (plot_type == "one_time") {
      var returnDict = {
        title: {
          text: name + ' - Zaman Serisi Çizgi Grafiği'
        },
        height: 600,
        annotations: [

        ],
        shapes: [],
        xaxis: {
          rangeslider: {
            range: [0, 8]
          }
        }
      };
      for (k = 0; k < theData.epochs.length; k++) {
        epoch = theData.epochs[k];
        annotation = {
          xref: 'x',
          yref: 'paper',
          x: theData.time[epoch.low_time_idx],
          y: 1,
          text: epoch.annotation.tag
        };
        returnDict.annotations.push(annotation);
        line = {
          type: 'line',
          xref: 'x',
          yref: 'paper',
          x0: theData.time[epoch.low_time_idx],
          y0: 0,
          x1: theData.time[epoch.low_time_idx],
          y1: 1,
          line: {
            color: 'rgb(150, 150, 150)',
            opacity: "0.1",
            width: 1
          }
        };
        returnDict.shapes.push(line);
      }
    }
    return returnDict;
  }

  function renderPage() {
    var select1 = $("#select-channel-for-time");
    var select2 = $("#select-channel-for-fft");
    var select3 = $("#select-channel-for-stft");
    for (var i = 0; i < theData.n_channel; i++) {
      var option = $("<option></option>");
      option.attr("value", i);
      option.text(theData.signals[i].channel.label);
      select1.append(option);
      select2.append(option.clone());
      select3.append(option.clone());
    }
    Plotly.newPlot("time-plot-1", getDataArray2DrawLine(), getLayout("all_channels_time"));
    drawFFT(0);
    drawStft(0);
  }
  updateDataSync();
  renderPage();

  $("#time-select").click(function() {
    var value = parseInt($("#select-channel-for-time").val());
    console.log(value);
    if (value >= 0) {
      var tempData = getNthChannelSignal(value);
      var data2draw = [{
        x: tempData.array[0],
        y: tempData.array[1],
        name: tempData.channel.label
      }];
      Plotly.newPlot("time-plot-1", data2draw, getLayout("one_time", tempData.channel.label));
    }
  });

  $("#time-back-all").click(function() {
    Plotly.newPlot("time-plot-1", getDataArray2DrawLine(), getLayout("all_channels_time"));
  });

  $("#apply-high-filter").click(function() {
    $.ajax({
      type: "POST",
      data: {
        hp_cutoff: $("#highpass-field").val(),
        order: 2
      },
      url: '/hp_prefilter',
      success: function(result) {
        var tag = $("#filter-warning");
        tag.empty();
        if (result.result == "success") {
          tag.css("color", "green");
          tag.text(result.msg);
          tag.css("color", "red");
          updateDataSync();
          renderPage();
          Plotly.newPlot("time-plot-1", getDataArray2DrawLine(), getLayout("all_channels_time"));
        } else {
          $("#filter-warning").text(result.msg);
        }
      },
      async: false
    });
  });



  $("#apply-low-filter").click(function() {
    $.ajax({
      type: "POST",
      data: {
        lp_cutoff: $("#lowpass-field").val(),
        order: 2
      },
      url: '/lp_prefilter',
      success: function(result) {
        var tag = $("#filter-warning");
        tag.empty();
        if (result.result == "success") {
          tag.css("color", "green");
          tag.text(result.msg);
          tag.css("color", "red");
          updateDataSync();
          renderPage();
          Plotly.newPlot("time-plot-1", getDataArray2DrawLine(), getLayout("all_channels_time"));
        } else {
          $("#filter-warning").text(result.msg);
        }
      },
      async: false
    });
  });

  $("#fft-select").click(function() {
    var value = parseInt($("#select-channel-for-fft").val());
    drawFFT(value);
  });

  $("#stft-select").click(function() {
    var value = parseInt($("#select-channel-for-stft").val());
    drawStft(value);
  });

});
