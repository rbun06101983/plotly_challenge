// function buildMetadata(sample){

//     //The following function builds the metadat panel

//     var metadata_url="/metadata/" + sample;

//     var metadata=d3.select("#sample-metadata")
//     metadata.html=""

//     d3.json(metadata_url).then(function(sample){

//         Object.defineProperties(sample).forEach(([key,value])=>{
//             console.log(key,value);
//             metadata.append('h6').text(`${key.toUpperCase()}:-${value}`);
//         });
//     });

//     //The following function builds the gauge indicator
//     d3.json(metadata_url).then(function(data){

//         var wash_freq=data.WFREQ;
//         console.log(wash_freq);

//         var data=[
//         {
//             domain:{x:[0,1], y:[0,1]},
//             value:wash_freq,
//             title:{text:"<b>Wash Frequency</b><br><i>Scrubs per Week</i>"},
//             type: "indicator",
//             mode:"gauge+number+range",
//             gauge:{
//                 axis:{range:[0,10]},
//                 bar:{color:"red"},
//                 step: [
//                     {range:[0,1], color:"rgb(204,214,204)"},
//                     {range:[1,2], color:"rgb(186,206,186)"},
//                     {range:[2,3], color:"rgb(168,199,168)"},
//                     {range:[3,4], color:"rgb(150,191,150)"},
//                     {range:[4,5], color:"rgb(132,184,132)"},
//                     {range:[5,6], color:"rgb(114,176,114)"},
//                     {range:[6,7], color:"rgb(96,168,96)"},
//                     {range:[7,8], color:"rgb(78,161,78)"},
//                     {range:[8,9], color:"rgb(60,153,60)"},
//                     {range:[9,10], color:"rgb(42,146,42)"}
//                 ],
//             }
//         }
//         ];

//     var layout={width:500, height:400, margin:{t:1, b:1}};

//     Plotly.newPlot('gague', data, layout);

//     })

// }

// function buildCharts(sample){

//     var sample_url='/sample/'+ sample;

//     //Horizontal Bar Chart using the data

//     d3.json(sample_url).then(function(data){
        
//         var sample_values=data.sample_values.slice(0,10);
//         console.log(sample_values);
//         var otu_ids=data.otu_ids.slice(0,10);
//         console.log(otu_ids);
//         var otu_labels=data.otu_labels.slice(0,10)
//         console.logt(otu_labels);
    
//         var data=[{
//             type:"bar",
//             orientation:'h',
//             x: sample_values,
//             y: otu_ids,
//             hovertext: otu_labels
//         }];

//         var layout={
//             title:"Sample Value Numbers vs. otu_ids",
//             xaxis:{
//                 title:"Number of Samples"
//             },
//             yaxis:{
//                 title:"otu_ids"
//             }
//         };

//         Plotly.newPlot('bar', data, layout);
//     });


//     //Bubble Chart using the sample data

//     d3.json(sample_url).then(function(data){
//         var otu_ids=data.otu_ids;
//         var sample_values=data.sample_values;
//         var otu_labels=data.otu_labels;
//         var size=data.sample_values;
//         var colors=data.sample_values;
//         var trace1={
//             x:otu_ids,
//             y:sample_values,
//             mode:'markers',
//             marker:{color:colors,
//                     opacity:colors,
//                     size:size}
//         };
//         var data=[trace1];
//         var layout={
//             title: "OTU Bubble Chart",
//             xaxis:{
//                 title:"OTU ID"
//             }
//         };
        
//         Plotly.newPlot("bubble", data, layout);
        
//     });
// }


//----------------------------------------------------------------------------------------------
//read in data
//      local file->usa a server
//      d3.json()->
//define a variable for the path relative to app.js
var file_path='../samples.json'
d3.json(file_path).then(function(data){
    console.log(data);
    dropDown(data);
});

//populate drop down menu
//wait for d3 promise to be filled
//for each item in names attribute, create an option element in
//html under the select element
//program  optionChanged to match html
function dropDown(sampleData){
    sampleData['names'].forEach(name=>{
        var newOption=d3.select('#selDataset').append('option')
        newOption.text(name);
        newOption.property('value', name);
    });
};

//program to set the newly selected value
function optionChanged(selected){
    console.log(selected);
    buildBar(selected);
    buildTable(selected);
};

// d3.select('#selDataset').on('change', optionChanged(this.value));
//build a bar chart base on the selection->take the parameter
//of the selection(int)
//filter down to top 10 OTUs
//inverse sort
function buildBar(sampleId){
    d3.json(file_path).then(function(data){
        var samples=data['samples'];
        var selectedSamples=samples.filter(sample=>sample.id==sampleId)[0];
        //console.log(selectedSamples);
        traceBar={
            type: 'bar',
            y:selectedSamples['otu_ids'].map(otu_id=>'OTU '+otu_id.toString()).slice(0,10).reverse(),
            x:selectedSamples['sample_values'].slice(0,10).reverse(),
            hovertext:selectedSamples['otu_labels'].slice(0,10).reverse(),
            orientation:'h'
        };
        Plotly.newPlot('bar', [traceBar]);
    

        traceBubble={
            type:'scatter',
            x:selectedSamples['otu_ids'],
            y:selectedSamples['sample_values'],
            mode:'markers',
            marker:{
                size:selectedSamples['sample_values'].map(sample_value=>sample_value/2),
                color:selectedSamples['otu_ids'],
                colorscale: 'Earth'
            }  
        };
        Plotly.newPlot('bubble',[traceBubble])
 });
};

//build the metadata from Json
//d3.json->read the data from samples.json again
//forEach Object.entries add new h6
function buildTable(sampleId){
    d3.json(file_path).then(function(data){
        var metadata=data['metadata'];
        var selectedMetadata=metadata.filter(meta=>meta['id']==sampleId)[0];
        // console.log(selectedMetadata);
        var panel=d3.select('#sample-metadata');
        panel.html('')
        Object.entries(selectedMetadata).forEach(([meta_key, meta_value])=>{
            panel.append('h5')
                .text(`${meta_key}: ${meta_value}`);
        });
    });
};
