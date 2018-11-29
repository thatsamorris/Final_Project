function clearThings() {

    clearNotGraphs();

    var graph1 = d3.select('#graph1');
    graph1.selectAll("*").remove();

    var graph2 = d3.select('#graph2');
    graph2.selectAll("*").remove();

    var graph3 = d3.select('#graph3');
    graph3.selectAll("*").remove();

    var graph4 = d3.select('#graph4');
    graph4.selectAll("*").remove();
}

function clearNotGraphs() {

    var title = d3.selectAll('div').select('h2').html("");

    var table = d3.select("table");
    var head = table.select("thead");
    head.selectAll("*").remove();

    var tbody = table.select("tbody");
    tbody.selectAll("*").remove();

    var title2 = d3.select(".col-md-4").select("h3").html("");

    var list = d3.select("ul");
    list.selectAll("*").remove();

    var form = d3.select("form");
    form.html("");
    form.selectAll("*").remove();

    var map = d3.select('#crimemap').html("");
}

function processAgenda(){
    clearThings();

    var graph1 = d3.select('#graph1');
    var list = graph1.append("ul");

    var list_item = list.append("li").text("Team Members: Dave S., Austin M., Carmen R.,\
        Gwen W.");
    var list_item = list.append("li").text("Agenda for Today: ");
    var minor_list = list_item.append("ol");
    minor_list.append("li").text("Background Information and Steps"); 
    minor_list.append("li").text("Models Used and Results: Linear Regression"); 
    minor_list.append("li").text("Prediction Based on Our Best Model "); 
}

function processBackground(){
    clearThings();

    var graph1 = d3.select('#graph1');
    var list = graph1.append("ul");
    var list_item = list.append("li").text("Cities Used for Analysis: ");
    var minor_list = list_item.append("ul");
    minor_list.append("li").text("Atlanta, GA"); 
    minor_list.append("li").text("Austin, TX"); 
    minor_list.append("li").text("Baltimore, MD"); 
    minor_list.append("li").text("Detroit, MI"); 
    minor_list.append("li").text("Kansas City, MO"); 
    minor_list.append("li").text("Orlando, FL"); 
    minor_list.append("li").text("Philadelphia, PA"); 
    minor_list.append("li").text("Tucson, AZ");
    var list_item = list.append("li").text("Not all police incident data had zipcode\
        - most had latitude and logitude - used python library (uszipcode) to get zipcode"); 
    var list_item = list.append("li").text("After data was cleaned up, it was combined\
        with census data and then put into database."); 
    var list_item = list.append("li").text("Models Used: Linear Regression, \
        Neural Network, and SVM"); 
}


function processNeural(i) {

    clearThings();

    console.log('in processNeural: ');
    var title = d3.select("h2");
    title.html("Neural Network - Score Results")

    
    var table = d3.select("table");
    
    var head = table.select("thead");

    var row = head.append("tr");
    row.append("th").text("Field");
    row.append("th").text("Description");

    var title2 = d3.select(".col-md-4").select("h3");
    title2.text("summary");

    var list = d3.select("ul");
    var list_item = list.append("li");
    list_item.text("Variable Used as Output For Model: Crime Encode (0-low, 1-medium, 2-high)");
    var list_item = list.append("li");
    list_item.text("Variables Used as Inputs For Model:");
    var minorlist = list_item.append("ul"); 
    minorlist.append("li").text("Median Age");
    minorlist.append("li").text("Houselhold Income");
    minorlist.append("li").text("Per Capita Income");
    minorlist.append("li").text("Poverty Rate");
    var list_item = list.append("li");
    list_item.text("Testing and Training Scores used 80/20 model");
  

    d3.json(`/neural`).then(function(data) {
        console.log('in processNeural: data ', data); 

        var tbody = table.select("tbody");
        var row = tbody.append("tr");
        row.append("td").text("Model Accuracy");
        row.append("td").text(data.model_accuracy);

        var row = tbody.append("tr");
        row.append("td").text("Model Loss");
        row.append("td").text(data.model_loss);

    });    

}




function processClassifier(i) {
    console.log('in processClassifier: ');

    clearThings();

    console.log('in classifier: ');
    var title = d3.select("h2");
    title.html("Logistic Regression - Score Results")
    var table = d3.select("table");
    var head = table.select("thead");
    var row = head.append("tr");
    row.append("th").text("Field");
    row.append("th").text("Score");

    var tbody = d3.select("tbody");
    // tbody.selectAll("*").remove();

    var list = d3.select("ul");
    // list.selectAll("*").remove();

    var list_item = list.append("li");
    list_item.text("Input Variables Used:");
    var minorlist = list_item.append("ul"); 
    minorlist.append("li").text("Median Age");
    minorlist.append("li").text("Houselhold Income");
    minorlist.append("li").text("Per Capita Income");
    minorlist.append("li").text("Poverty Rate");

    var list_item = list.append("li");
    list_item.text("Output is Crime Rating (low, medium high)");
    var list_item = list.append("li");
    list_item.text("Testing and Training Scores used 80/20 model");


  

    d3.json(`/classifer`).then(function(data) {
        console.log('in processClassifier: data ', data);

        var tbody = table.select("tbody");
        var row = tbody.append("tr");
        row.append("td").text("Training Score");
        row.append("td").text(data.training_score);

        var row = tbody.append("tr");
        row.append("td").text("Testing Score");
        row.append("td").text(data.testing_score);

    });    

}



function processR2(i) {

    clearThings();

    console.log('in processR2: ');
    var title = d3.select("h2");
    title.html("Linear Regression - Score Results")
    var table = d3.select("table");
    var head = table.select("thead");
    var row = head.append("tr");
    row.append("th").text("Field");
    row.append("th").text("R2 Score");

    var tbody = d3.select("tbody");
    // tbody.selectAll("*").remove();

    var list = d3.select("ul");
    // list.selectAll("*").remove();

    var list_item = list.append("li");
    list_item.text("All variables were used in initial scores and analysis to see how each variable affects crime rates");
    var list_item = list.append("li");
    list_item.text("Input Variables Used:");
    var minorlist = list_item.append("ul"); 
    minorlist.append("li").text("Median Age");
    minorlist.append("li").text("Houselhold Income");
    minorlist.append("li").text("Per Capita Income");
    minorlist.append("li").text("Poverty Rate");
    var list_item = list.append("li");
    list_item.text("Overall score uses all data with 4 variables listed");
    var list_item = list.append("li");
    list_item.text("Testing and Training Scores used 80/20 model");


    d3.json(`/linearR2`).then(function(data) {
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

    clearNotGraphs();

    console.log('in processLinear: ');
    // var filename = 'census_crime_data.csv';
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

function buildMap(data){

    if (map != undefined) { map.remove(); }

    var map3 = d3.select("#crimemap");
    map3.html("<div id='map' style='width: 100%; height: 500px;'></div>");

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    id: "mapbox.light",
    maxzoom: 15,
    accessToken: 'pk.eyJ1Ijoia2NtaWxsaWUiLCJhIjoiY2pvNjRobG1zMGd0NjNrcW04b2VxMmU5NyJ9._JbgNG2YppKmyeEcZenRPA'
    });

    // Create the map object with options
    var map = L.map("map", {
    center: [data.latitude, data.longitude],
    zoom: 10,
    });

    lightmap.addTo(map);

};

function myFunction(){
    event.preventDefault();

    var city = document.getElementById("myForm").elements.namedItem("cityInput").value;
    var state = document.getElementById("myForm").elements.namedItem("stateInput").value;
    var location = city.concat('-', state);
    console.log(location);

    d3.json(`/citystate/${String(location)}`).then(function(data) {
        console.log(data.total_results);
        buildMap(data);
    });
}


function prediction(){
    clearThings();

    console.log("test test test");

    var form = d3.select("form")
        .attr('id', 'myForm')
        .attr('onsubmit',"return myFunction();");
    
    form.html("<br> Input a City: <br>");
    
    var input = form.append("input")
        .attr('type','text')
        .attr('name','cityInput');

    var nextline = form.append().html("<br>Input a State:<br>");

    var input2 = nextline.append("input")
        .attr('type','text')
        .attr('name','stateInput');

    var nextline = form.append().html("<br>");

    var button = nextline.append("input")
        .attr('type',"submit");

    // console.log(myFunction());



    // var form = d3.select("form")
    // form.html("<br>");

    // var submit = form.append("input")
    //     .attr({type:"submit", value:"submit"});

    // get input - type in city?
    // look up zipcode ?
    // import model
    // print input variables
    // print predicted result
}


function optionChanged(model) {

    console.log('dis b da file: ', model);
    switch (model) {
        case "Intro":
            processAgenda();
            break;
        case "Background":
            processBackground();
            break;
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
        case "Prediction":
            prediction();
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
        .text('Intro')
        .property("value", 'Intro');
    selector
        .append("option")
        .text('Background')
        .property("value", 'Background');
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
        .text('Linear Regression')
        .property("value", 'R2_Scores');
    selector
        .append("option")
        .text('Logistic Regression')
        .property("value", 'Classifier');
    selector
        .append("option")
        .text('Neural Network')
        .property("value", 'Neural');
    selector
        .append("option")
        .text('Prediction')
        .property("value", 'Prediction');

}  

init();
