function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var selectedSample = samplesArray.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = selectedSample[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var selectedOtuIds = firstSample.otu_ids;
    var selectedOtuLabels = firstSample.otu_labels;
    var selectedValues = firstSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = selectedOtuIds.slice(0, 10).reverse().map(selectedOtuIds => selectedOtuIds);

    // 8. Create the trace for the bar chart. 
    var barData = [
      {x: selectedValues,
      y: [10,9,8,7,6,5,4,3,2,1],
      text: selectedOtuLabels,
      type: "bar",
      orientation: "h"}
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: yticks

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)
  
    // Bubble chart
    // 1. Create the trace for the bubble chart.
    
    var bubbleTrace = {
      x: selectedOtuIds,
      y: selectedValues,
      text: selectedOtuLabels,
      mode: "markers",
      marker: {
        size: selectedValues,
        color: selectedOtuIds,
        colorscale: "Earth",
        opacity: selectedValues
      }      
    };
    
    var bubbleData = [bubbleTrace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {
        title: {
          text: 'OTU ID',
          font: {
            family: 'Arial',
            size: 18,
            color: 'black'
          }
        },
      },
      showlegend: false,
      height: 600,
      width: 1200,
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Gauge
    // 3. Create a variable that holds the washing frequency.
    var metadataArray = data.metadata;
    var selectedMetadata = metadataArray.filter(metadataObj => metadataObj.id == sample);
    var firstMetadata = selectedMetadata[0]
    var selectedWashFreq = firstMetadata.wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: {x: [0, 1], y:[0, 1]},
        value: selectedWashFreq,
        title: {text:"Belly Button Washing Frequency"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range:[null, 10], tickwidth: 1, tickcolor: "black"},
          bar: {color: "black"},
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "black",
          steps: [
            {range: [0, 2], color: "red"},
            {range: [2, 4], color: "orange"},
            {range: [4, 6], color: "yellow"},
            {range: [6, 8], color: "limegreen"},
            {range: [8, 10], color: "darkgreen"}
          ]
        },
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, height: 450, margin: { t: 0, b: 0 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
