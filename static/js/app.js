//define a variable for the path relative to app.js
var file_path='../samples.json'
d3.json(file_path).then(function(data){
    console.log(data);
    dropDown(data);
});

//populate drop down menu
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


//build a bar chart and bubble chart base on the selection

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
        var layoutBar={
            title:"Sample Value Numbers vs. otu_ids",
            xaxis:{
                title:"Number of Samples"
            },
            yaxis:{
                title:"otu_ids"
            }
        };

        Plotly.newPlot('bar', [traceBar], layoutBar);
    

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
    
        var layoutBubble={
            title: "OTU Bubble Chart",
            xaxis:{
                 title:"OTU ID"
             }
         };

        Plotly.newPlot('bubble',[traceBubble], layoutBubble)
    });
};

//build the metadata from Json
function buildTable(sampleId){
    d3.json(file_path).then(function(data){
        var metadata=data['metadata'];
        var selectedMetadata=metadata.filter(meta=>meta['id']==sampleId)[0];
        // console.log(selectedMetadata);
        var panel=d3.select('#sample-metadata');
        panel.html('');
        Object.entries(selectedMetadata).forEach(([meta_key, meta_value])=>{
            panel.append('h5')
                .text(`${meta_key}: ${meta_value}`);
        
        //BONUS Gauge Chart
        var wash_freq=selectedMetadata.wfreq;
            // console.log(wash_freq);
                
           var data=[
            {
                domain:{x:[0,1], y:[0,1]},
                    value:wash_freq,
                    title:{text:"<b>Wash Frequency</b><br><i>Scrubs per Week</i>"},
                    type: "indicator",
                    mode:"gauge+number+range",
                    gauge:{
                        axis:{range:[0,10]},
                        bar:{color:"red"},
                        step: [
                            {range:[0,1], color:"rgb(204,214,204)"},
                            {range:[1,2], color:"rgb(186,206,186)"},
                            {range:[2,3], color:"rgb(168,199,168)"},
                            {range:[3,4], color:"rgb(150,191,150)"},
                            {range:[4,5], color:"rgb(132,184,132)"},
                            {range:[5,6], color:"rgb(114,176,114)"},
                            {range:[6,7], color:"rgb(96,168,96)"},
                            {range:[7,8], color:"rgb(78,161,78)"},
                            {range:[8,9], color:"rgb(60,153,60)"},
                            {range:[9,10], color:"rgb(42,146,42)"}
                            ],
                        }
                    }
                ];
                
                    var layoutGauge={width:500, height:400, margin:{t:1, b:1}};
                
                    Plotly.newPlot('gauge', data, layoutGauge);
                
        });
    });
};