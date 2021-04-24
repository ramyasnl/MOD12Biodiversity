function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
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
  console.log(newSample);
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Building the Demographics Panel 
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
       
        // 3. Create a variable that holds the samples array which is  one of the 3 arrays in the data "samples"having 153 array values
    var samples = data.samples;
    console.log(samples)

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var labels =  data.samples[0].otu_labels.slice(0,10);
    console.log (labels)
    var result = samples.filter(id => id.id == sample );
    //  5. Create a variable that holds the first sample in the array.
      var r1 = result[0];
    console.log("result[0]=r1", r1);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values
    var otu_labels = r1.otu_labels;
    var otu_ids = r1.otu_ids; console.log("otu_ids:",otu_ids);
    var sample_values = r1.sample_values;console.log("sample_values:",sample_values);
    
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  

    var yticks = otu_ids.slice(0, 10).map(d => "OTU " + d).reverse();
    console.log("yticks:",yticks) ;
    //  so the otu_ids with the most bacteria are last. 
    
   
    // 8. Create the trace for the bar chart.
    var trace = {
        x: sample_values.slice(0, 10).reverse() ,
        y: yticks,
        text: labels,
        marker: {
        color: 'blue'},
        type:"bar",
        orientation: "h",
    };
    
    var barData = [trace]; 
   
    // 9. Create the layout for the bar chart. 
    var barLayout = {title: "<b>Top 10 Bacteria Cultures Found</b>",
                     yaxis:{
                        tickmode:"linear",  },
                     margin: {
                        l: 100,
                        r: 100,
                        t: 100,
                        b: 30
                        }
                    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData , barLayout);
  
   // The bubble chart
    var trace1 = {
    x: otu_ids,
    y: sample_values,
    mode: "markers",
    marker: {
        size: sample_values,
        color: otu_ids
      
    },
    text: otu_labels
  };
  // set the layout for the BUBBLE plot
  var layout_2 = {title: "<b> Bacteria Cultures per Sample </b>",
  xaxis:{title: "OTU ID"},
  height: 600,
  width: 1000
  };
  // / creating data variable 
        var data1 = [trace1];

    // create the bubble plot
    Plotly.newPlot("bubble", data1, layout_2); 
    
    });
    // To GET the wfreq from data 
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];console.log(result);
      var wfreq = result.wfreq;
      
    // The guage chart
     var data_g = [
      {
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreq,
      title: {text: `<b>Belly Button Washing Frequency</b><br>Scrubs per Week`},
      type: "indicator",
      
      mode: "gauge+number",
      gauge: { axis: { range: [null, 10] },
                steps: [
                {range: [0, 2], color: "red"},
                {range: [2, 4], color: "orange"},
                {range: [4, 6], color: "yellow"},
                {range: [6, 8], color: "greenyellow"},
                {range: [8, 10], color: "green"},
                ]}
          
      }
     ];
    var layout_g = { 
        width: 700, 
        height: 600, 
        margin: { t: 20, b: 40, l:100, r:100 } 
      };
    Plotly.newPlot("gauge", data_g, layout_g);
  });
}


