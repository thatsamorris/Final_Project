function clearThings() {
    d3.select("div").html("");
}


function processNeural(i) {

    console.log('in processNeural: ');
    var title = d3.select("h2").html("");
    title.html("Neural Network Analysis")
    var table = d3.select("table");
    var head = table.select("thead").html("");
    var row = head.append("tr");
    row.append("th").text("Field");
    row.append("th").text("Description");
  

    d3.json(`/neural`).then(function(data) {
        console.log('in processNeural: data ', data);

        // for (var l = 0; l < data.fieldArray.length; l++){
        
        //     // Append one table row `tr` to the table body
        //     var row = tbody.append("tr");
                
        //     // Append one cell for the student name
        //     row.append("td").text(data.fieldArray[l]);
            
        //     // Append one cell for the student grade
        //     row.append("td").text(data.field_score[l]);
        // }   

        // var row = tbody.append("tr");
        // row.append("td").text("OverallScore");
        // row.append("td").text(data.overall_score);

        // var row = tbody.append("tr");
        // row.append("td").text("TrainingScore");
        // row.append("td").text(data.training_score);

        // var row = tbody.append("tr");
        // row.append("td").text("TestingScore");
        // row.append("td").text(data.testing_score);



    });    

}




function processClassifier(i) {

    console.log('in processClassifier: ');
    var tbody = d3.select("tbody");
    tbody.selectAll("*").remove();
  

    d3.json(`/classifer`).then(function(data) {
        console.log('in processClassifier: data ', data);

        // for (var l = 0; l < data.fieldArray.length; l++){
        
        //     // Append one table row `tr` to the table body
        //     var row = tbody.append("tr");
                
        //     // Append one cell for the student name
        //     row.append("td").text(data.fieldArray[l]);
            
        //     // Append one cell for the student grade
        //     row.append("td").text(data.field_score[l]);
        // }   

        // var row = tbody.append("tr");
        // row.append("td").text("OverallScore");
        // row.append("td").text(data.overall_score);

        // var row = tbody.append("tr");
        // row.append("td").text("TrainingScore");
        // row.append("td").text(data.training_score);

        // var row = tbody.append("tr");
        // row.append("td").text("TestingScore");
        // row.append("td").text(data.testing_score);



    });    

}



function processR2(i) {

    console.log('in processR2: ');
    var title = d3.select("h2");
    title.html("R2 Score Analysis")
    var table = d3.select("table");
    var head = table.select("thead").html("");
    var row = head.append("tr");
    row.append("th").text("Field");
    row.append("th").text("R2 Score");

    var tbody = d3.select("tbody");
    // tbody.selectAll("*").remove();

    var list = d3.select("ul");
    var list_item = list.append("li");
    list_item.text("All variables were used in initial scores and analysis to see how each variable affects crime rates");
    var list_item = list.append("li");
    list_item.text("Final Variables Used:");
    var minorlist = list_item.append("ul"); 
    minorlist.append("li").text("Median Age");
    minorlist.append("li").text("Houselhold Income");
    minorlist.append("li").text("Per Capita Income");
    minorlist.append("li").text("Poverty Rate");
    var list_item = list.append("li");
    list_item.text("Overall score uses all data with 4 variables listed");
    var list_item = list.append("li");
    list_item.text("Testing and Training Scores used 80/20 model");


    d3.json(`/R2`).then(function(data) {
        console.log('in processR2: data ', data);

        for (var l = 0; l < data.fieldArray.length; l++){
        
            // Append one table row `tr` to the table body
            var row = tbody.append("tr");
                
            // Append one cell for the student name
            row.append("td").text(data.fieldArray[l]);
            
            // Append one cell for the student grade
            row.append("td").text(data.field_score[l]);
        }   

        var row = tbody.append("tr");
        row.append("td").text("Overall Score");
        row.append("td").text(data.overall_score);

        var row = tbody.append("tr");
        row.append("td").text("Training Score");
        row.append("td").text(data.training_score);

        var row = tbody.append("tr");
        row.append("td").text("Testing Score");
        row.append("td").text(data.testing_score);
    });    

}


function processLinear(i) {

    console.log('in processLinear: ');
    var filename = 'census_crime_data.csv';
    var graph_num = '';
    var class_name = "";

    

        d3.json(`/linear/${String(i)}`).then(function(data) {

            console.log('after d3', data);

            var xLine = [];
            var yLine = [];
            var xAx = [ ]
            var yAx = [ ]
            var trace1 = {}
            var trace2 = {}
           

            var layout = {}
            var color = "blue"
            var data1 = []

            xLine.push(data.xMin[0][0]);
            xLine.push(data.xMax[0][0]);

            yLine.push(data.yMin[0][0]);
            yLine.push(data.yMax[0][0]);


            console.log('xLine', xLine);
            console.log('yLine', yLine);



            for (var l = 0; l < data.X.length; l++){
                xAx.push(data.X[l][0])
                yAx.push(data.y[l][0])
            }
            
            switch (i) {
                case (0): 
                class_name = 'Household Income';
                graph_num = "graph1"
                 break;
                 case (1): 
                class_name = 'Median Age';
                graph_num = "graph2"
                 break;
                 case (2): 
                class_name = 'Poverty Rate';
                graph_num = "graph3"
                 break;
                 case (3): 
                class_name = 'Per Capita Income';
                graph_num = "graph4"
                 break;
                 case (4): 
                 console.log('whqt 4');
                 class_name = 'Household Income';
                 graph_num = "graph1"
                  break;
                  case (5): 
                 class_name = 'Median Age';
                 graph_num = "graph2"
                  break;
                  case (6): 
                 class_name = 'Poverty Rate';
                 graph_num = "graph3"
                  break;
                  case (7): 
                 class_name = 'Per Capita Income';
                 graph_num = "graph4"
                  break;
            }
       
        
            trace1 = {
            type: "scatter",
            mode: "markers",
            name: class_name,
            x: xAx,
            y: yAx,
            marker: {
                color: color
                ,            size: 10
            }
            };
       
            trace2 = {
                x:  xLine,
                y:  yLine,
                mode: 'lines',
                type: 'scatter'
            }

            data1 = [trace1, trace2];
        
            layout = {
            title: "Crime Rate/" + class_name,
            xaxis: { title: class_name },
            yaxis: {title: "Crime Rate"}
            };
        
    
            switch (i) {
                case (0): 
                Plotly.newPlot("graph1", data1, layout);
                graph_num = "graph1"
                 break;
                 case (1): 
                Plotly.newPlot("graph2", data1, layout);
                graph_num = "graph2"
                 break;
                 case (2): 
                 Plotly.newPlot("graph3", data1, layout);
                graph_num = "graph3"
                 break;
                 case (3): 
                 Plotly.newPlot("graph4", data1, layout);
                graph_num = "graph4"
                 break;
                 case (4): 
                 Plotly.newPlot("graph1", data1, layout);
                 graph_num = "graph1"
                  break;
                  case (5): 
                 Plotly.newPlot("graph2", data1, layout);
                 graph_num = "graph2"
                  break;
                  case (6): 
                  Plotly.newPlot("graph3", data1, layout);
                 graph_num = "graph3"
                  break;
                  case (7): 
                  Plotly.newPlot("graph4", data1, layout);
                 graph_num = "graph4"
                  break;
 

            }        


        } );   

    
}


function optionChanged(model) {

    console.log('dis b da file: ', model);
    switch (model) {
        case "Linear1":
            processLinear(0);
            break;
        case "Linear2":
            processLinear(1);
            break;
        case "Linear3":
            processLinear(2);
            break;
        case "Linear4":
            processLinear(3);
            break;
        case "Linear5":
           console.log('linear5')
            var graph1 = d3.select("graph1");
            graph1.selectAll("*").remove();
            processLinear(4);
            break;
        case "Linear6":
            processLinear(5);
            break;
        case "Linear7":
            processLinear(6);
            break;
        case "Linear8":
            processLinear(7);
            break;  
        case "R2_Scores":
            processR2(7);
            break;    
        case "Classifier":
            processClassifier(8);
            break;    
        case "Neural":
            processNeural(8);
            break;    
       
 
        }



}


function init() {
  var firstCity = 'Kansas City'
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  console.log('in init');


    selector
        .append("option")
        .text('select')
        .property("value", 'test');
    selector
        .append("option")
        .text('Linear1')
        .property("value", 'Linear1');
    selector
        .append("option")
        .text('Linear2')
        .property("value", 'Linear2');
    selector
        .append("option")
        .text('Linear3')
        .property("value", 'Linear3');
    selector
        .append("option")
        .text('Linear4')
        .property("value", 'Linear4');

        selector
        .append("option")
        .text('Linear5')
        .property("value", 'Linear5');
    selector
        .append("option")
        .text('Linear6')
        .property("value", 'Linear6');
    selector
        .append("option")
        .text('Linear7')
        .property("value", 'Linear7');
    selector
        .append("option")
        .text('Linear8')
        .property("value", 'Linear8');
    selector
        .append("option")
        .text('R2_Scores')
        .property("value", 'R2_Scores');
    selector
        .append("option")
        .text('Classifier')
        .property("value", 'Classifier');
    selector
        .append("option")
        .text('Neural')
        .property("value", 'Neural');

}  

init();
