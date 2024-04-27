// Use D3 to fetch the JSON data
d3.json("https://static.bc-edx.com/data/dla-1-2/m14/lms/starter/samples.json")
    .then(function(data) {
        // Extract necessary data from JSON
        let samples = data.samples;
        let metadata = data.metadata; 

        // Create dropdown menu
        let dropdown = d3.select("#selDataset");

        dropdown.on("change", updateCharts);

        // dropdown menu with sample IDs using a for loop
        for (let index = 0; index < samples.length; index++) {
            dropdown.append("option").text(`Sample ${index + 1}`).property("value", index);
        }

        // rendering the charts and metadata for the first sample 
        renderCharts(0);
        renderMetadata(0); 

        // Function to update charts based on dropdown selection
        function updateCharts() {
            let selectedIndex = dropdown.property("value");
            renderCharts(selectedIndex);
            renderMetadata(selectedIndex);
        }

        // Function to visualise bar chart and bubble chart for a specific sample
        function renderCharts(sampleIndex) {
            let sample = samples[sampleIndex];
            let otuIds = sample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(); 
            let sampleValues = sample.sample_values.slice(0, 10).reverse();
            let otuLabels = sample.otu_labels.slice(0, 10).reverse();

            // Create horizontal bar chart
            let trace1 = {
                x: sampleValues,
                y: otuIds,
                text: otuLabels,
                type: "bar",
                orientation: "h"
            };

            let barData = [trace1];

            let barLayout = {
                title: "Top 10 Bacteria Cultures Found",
                xaxis: { title: "Name of Bacteria" },
            };

            Plotly.newPlot("bar", barData, barLayout);

            // Create bubble chart
            let bubbleTrace = {
                x: sample.otu_ids,
                y: sample.sample_values,
                text: sample.otu_labels,
                mode: 'markers',
                marker: {
                    size: sample.sample_values,
                    color: sample.otu_ids,
                    colorscale: 'Earth'
                }
            };

            let bubbleData = [bubbleTrace];

            let bubbleLayout = {
                title: 'Bacteria Cultures Per Sample',
                xaxis: { title: 'OTU ID' },
                yaxis: { title: 'Number of Bacteria' } // Update y-axis title
            };

            Plotly.newPlot('bubble', bubbleData, bubbleLayout);
        }

       // Function to capitalize the first letter of each word
        function capitalizeFirstLetter(str) {
            if (typeof str === 'string') {
                return str.replace(/\b\w/g, char => char.toUpperCase());
            } else {
                return str;
            }
        }

        // Function to render metadata for a specific sample
        function renderMetadata(sampleIndex) {
            let sampleMetadata = metadata[sampleIndex];
            let metadataPanel = d3.select("#sample-metadata");
            // Clear existing metadata
            metadataPanel.html("");
          
            // Loop through each key-value pair in the metadata object using a for loop
            for (let key in sampleMetadata) {
                if (sampleMetadata.hasOwnProperty(key)) {
                    // Capitalize the key to uppercase
                    let capitalizedKey = key.toUpperCase();
                    // Capitalize the first letter of each word in the value
                    let capitalizedValue = capitalizeFirstLetter(sampleMetadata[key]);
                    // Create a text string for the key-value pair
                    let text = `${capitalizedKey}: ${capitalizedValue}`;
                    // Append an html tag with that text to the #sample-metadata panel
                    metadataPanel.append("p").text(text);
                }
            }
        }
    })
    .catch(function(error) {
        console.error("Error fetching data:", error);
    });
