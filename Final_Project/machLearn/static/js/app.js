function clearThings() {

    clearNotGraphs();

    var graph1 = d3.select('#graph1');
    graph1.selectAll("*").remove();
    graph1.html("").attr("class", null);

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

    var tbody = table.select("tbody").html("");
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

    var team = graph1.append("span").attr("id", "team")
        .html("Team Members: Dave S., Austin M., Carmen R., Gwen W. <br>");
    
    graph1.append("span").attr("class","agenda")
        .html("Agenda for Today: <br>");
    graph1.append("span").attr("class","agenda")
        .html("1.) Background Information and Steps <br>"); 
    graph1.append("span").attr("class","agenda")
        .html("2.) Models Used and Results<br>"); 
    graph1.append("span").attr("class","agenda")
        .html("3.) Prediction Based on One of the Models "); 

    var graph2 = d3.select('#graph2')
    graph2.append("img").attr("class","crime").attr("src", '../static/crime_tape.jpg');
}

function randomDataSet(dataSetSize, minValue, maxValue) {
  return new Array(dataSetSize).fill(0).map(function(n) {
    return Math.random() * (maxValue - minValue) + minValue;
  });
}

function buildSimpleSVG(){
    var svg = d3.select("#graph2").append("svg");

    svg.attr("width", "100%").attr("height", "200px");

    var x = 125
    var xValues = [x, 2*x, 3*x, 4*x, 5*x, 6*x, 7*x, 8*x];
    var yValues = randomDataSet(8,20,150);
    var names = ['Atlanta', 'Austin', 'Baltimore',
        'Detroit','Kansas City','Orlando', 'Philadelphia',
        'Tucson'];
    var state = ['GA','TX','MD','MI','MO','FL','PA','AZ'];
    var clr = ['red', 'yellow','orange','green','purple','white','gray','pink']
    
    var data = [];
    for (i = 0; i < 8; i++) { 
        var item = {};
        item['x_axis'] = xValues[i];
        item['y_axis'] = 100;
        item['name'] = names[i];
        item['shape'] = state[i];
        item['clr'] = 'gray';
        data.push(item)
    }

    console.log(data)

    var circles = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle");

    var circleAttributes = circles
        .attr("r", 35)
        .attr("cy", function(d) {return d.y_axis;})
        .attr("cx", function(d) {return d.x_axis;})
        .attr("fill", function(d) {return d.clr;});

    var text = svg.selectAll("text")
        .data(data)
        .enter()
        .append("text");

    var textAttributes = text
        .text(function(d) { return d.name; })
        .attr("y", function(d) {return d.y_axis-45;})
        .attr("x", function(d) {return d.x_axis-25;})
        .attr("fill", "white")
        .attr("font-size",15);

    var foreign = svg.selectAll("foreignObject")
        .data(data)
        .enter()
        .append("foreignObject");

    var foreignAttributes = foreign
        .attr("y", function(d) {return d.y_axis-20;})
        .attr("x", function(d) {return d.x_axis-25;})
        .attr("class", "stateShape")
        .html(function(d) {
            var blah = (`${d.shape}`).toLowerCase();
            return (`<i class="mg map-us-${blah} mg-3x"></i>`);
        });

    
}

function processBackground(){
    clearThings();
    buildSimpleSVG();

    var graph1 = d3.select('#graph1');
    var section1 = graph1.append("div").attr("class", "col-md-6");
    var section1_header = section1.append('h2').text('Project Execution');
    var list_item = section1.append("span").attr('class','background').html("-The Python Library USZipcode was utilized \
    to convert police incidents recorded with latitude and longitude into zipcodes. <br>"); 

    var list_item = section1.append("span").attr('class','background').html("-After the data was cleaned, it was combined\
        with the census data and put into database. <br>"); 

    var list_item = section1.append("span").attr('class','background').html("-We went through cities \
        and calculated the crime rate. Then datapoints were then evenly distrubuted between\
        low - medium - high. <br>"); 

        var section2 = graph1.append("div").attr("class", "col-md-6");
        var section2_header = section2.append('h2').text('Managed Problems');
    var list_item = section2.append("span").attr('class','background').html("-Some cities only had more recent data and records \
        did not go further back than 2017. While other cities had data as far back as 2010. <br>");  

    var list_item = section2.append("span").attr('class','background').html("-The census was taken in 2010, which does not reflect \
        changes in population over the last 8/9 years.<br>");    

    var list_item = section2.append("span").attr('class','background').html("-Some data, such as latitude and longitude were \
    not put into the initial reports properly. <br>"); 

    // document.getElementById("myButton").onclick = prediction();

  //  var graph2 = d3.select('#graph2')
  //  graph2.append("img").attr("class","crime").attr("src", '../static/crime_tape.jpg');
}


function processNeural(i) {

    clearThings();

    console.log('in processNeural: ');
    var title = d3.select("h2");
    title.html("Deep Learning w/ Neural Network - Score")

    
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
    list_item.text("Model was created with 4 inputs, 100 hidden nodes, and 1 outputs");
    var list_item = list.append("li");
    list_item.text("Model was compiled with 'adam' as the optimizer and 'mean_squared_error' for the loss");

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
    title.html("Pipeline Model")
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
    list_item.text("Pipeline model built with Standard Scalar (helps to normalize numerical features), \
            PCA (Principal Component Analysis - statistical procedure), SVC (Support Vector Classification -\
            supervised learning model)");

    var list_item = list.append("li");
    list_item.text("Input Variables Used for Model:");
    var minorlist = list_item.append("ul"); 
    minorlist.append("li").text("Median Age");
    minorlist.append("li").text("Houselhold Income");
    minorlist.append("li").text("Per Capita Income");
    minorlist.append("li").text("Poverty Rate");

    var list_item = list.append("li");
    list_item.text("Output Variable is Crime Rating (low, medium, high)");

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
    list_item.text("Scores were tabulated for each variable individually relative to \
        crime rate.");
    var list_item = list.append("li");
    list_item.text("Input Variables Used in Final Model:");
    var minorlist = list_item.append("ul"); 
    minorlist.append("li").text("Median Age");
    minorlist.append("li").text("Houselhold Income");
    minorlist.append("li").text("Per Capita Income");
    minorlist.append("li").text("Poverty Rate");
    var list_item = list.append("li");
    list_item.text("Output Variable Used in Model: Crime Rating");
    var list_item = list.append("li");
    list_item.text("Overall score is for the final model with 4 inputs and 1 output");
    var list_item = list.append("li");
    list_item.text("Testing and Training Scores are for the final model");


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

    clearThings();

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
    console.log(data);

    if (map != undefined) { map.remove(); }

    var map3 = d3.select("#crimemap");
    map3.html("<div id='map' style='width: 100%; height: 400px;'></div>");

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    id: "mapbox.light",
    maxzoom: 15,
    accessToken: 'pk.eyJ1Ijoia2NtaWxsaWUiLCJhIjoiY2pvNjRobG1zMGd0NjNrcW04b2VxMmU5NyJ9._JbgNG2YppKmyeEcZenRPA'
    });

    var lat0 = data.latitude[0];
    var long0 = data.longitude[0];

    // Create the map object with options
    var map = L.map("map", {
    center: [lat0, long0] ,
    zoom: 10,
    });

    lightmap.addTo(map);

    var num = data.total_results;
    var highCount = 0;
    var medCount = 0;
    var lowCount = 0;
    console.log(num);
    for (i = 0; i < num; i++) { 
        // var point = data.zipcode[i];
        pointlat = data.latitude[i];
        pointlng = data.longitude[i];

        if (typeof(pointlat) != "undefined"){
            crime = data.Predictions[i];
            if (crime == 'high'){
                highCount = highCount + 1;
                shade = 'red';
            } else if (crime == 'medium'){
                shade = 'orange';
                medCount = medCount + 1;
            } else{
                shade = 'green';
                lowCount = lowCount + 1;
            }
            console.log(shade)

            var circle = L.circle([pointlat, pointlng], {
                color: shade,
                fillColor: shade,
                fillOpacity: 0.5,
                radius: 500
            }).addTo(map);

            circle.bindPopup(data.zipcode[i]);
        }
        else{ console.log("undefined found!!")}
        
    }

    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
        
        categories = ['high','medium','low'];

        for (var i = 0; i < categories.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(categories[i]) + '"></i> ' +
                 (categories[i] ? categories[i] + '<br>' : '+');
    }

    return div;
    }
    console.log(legend)
    legend.addTo(map);

    var title = d3.select('h2').text('Results');

    var summary = d3.select('ul').html("");
    var word = ['High: ','Medium: ','Low: ']
    summary.append('li').attr("class", "predict_results").text(word[0].concat(highCount.toString()));
    summary.append('li').attr("class", "predict_results").text(word[1].concat(medCount.toString()));
    summary.append('li').attr("class", "predict_results").text(word[2].concat(lowCount.toString()));

};

function getColor(category) {
    return (category == 'low') ? 'green' :
           (category == 'medium')  ? 'orange' :
           'red';
}

function myFunction(){
    event.preventDefault();

    var city = document.getElementById("myForm").elements.namedItem("cityInput").value;
    var state = document.getElementById("myForm").elements.namedItem("stateInput").value;
    var location = city.concat('-', state);
    console.log(location);

    d3.json(`/citystate/${String(location)}`).then(function(data) {
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
        .attr("class", "inputform")
        .attr('type','text')
        .attr('name','cityInput');

    var nextline = form.append().html("<br>Input a State:<br>");

    var input2 = nextline.append("input")
        .attr("class", "inputform")
        .attr('type','text')
        .attr('name','stateInput');

    var nextline = form.append().html("<br><br>");

    var button = nextline.append("input")
        .attr('type',"submit")
        .html("<br>");

    // var nextline = form.append().
    //     html("<br> <span class='stoplight'>Crime Rating: </span>\
    //         <span class='stoplight' style='color: red;'>High</span>,\
    //         <span class='stoplight' style='color: orange;'>Medium</span>,\
    //         <span class='stoplight'style='color: green;'>Low</span>");

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


function processSVM(i) {

    clearThings();

    console.log('in processSVM: ');
    var title = d3.select("h2");
    title.html("SVM - Score Results")

    var testX = [];
    var testY = [];

    d3.json(`/SVM`).then(function(data) {
        console.log('in processSVM: data ', data); 

        var table = d3.select("table");
        var tbody = table.select("tbody");
        var row = tbody.append("tr");
        row.append("td").text("SVM Score");
        row.append("td").text(data.SVM_score);

        var row = tbody.append("tr");
        row.append("td").text("Best Grid Parameters(C, gamma)");
        row.append("td").text(Object.values(data.Best_Grid_Params));

        var row = tbody.append("tr");
        row.append("td").text("Best Grid Score");
        row.append("td").text(data.Best_Grid_Score);

        var color = [];

        // console.log(data.PlotY);

        for (var l = 0; l < data.PlotY.length; l++){
            switch (data.PlotY[l]) {
                case (-1):
                   color.push("blue");
                   break;
                case (0):
                   color.push("red");
                   break;
                case (1):
                   color.push("yellow");
                   break;
            }

        }
        var class_name = "SVM"

        console.log(data.PlotX);
        console.log(data.PlotY);
        console.log(color);
        trace1 = {
            type: "scatter",
            mode: "markers",
            name: class_name,
            x: data.PlotX,
            y: data.PlotY,
            marker: {
               color: color,
               size: 10
            }
        };


        data1 = [trace1];

        layout = {
           title: "Crime Rate/" + class_name,
           xaxis: { title: class_name },
           yaxis: {title: "Crime Rate"}
        };


        // Plotly.newPlot("graph1", data1, layout); 

    });
    // var class_name = "SVM"

    // console.log(testX);
    // console.log(testY);

    // trace1 = {
    //     type: "scatter",
    //     mode: "markers",
    //     name: class_name,
    //     x: testX,
    //     y: testY,
    //     marker: {
    //        color: color,
    //        size: 10
    //     }
    // };


    // data1 = [trace1];

    // layout = {
    //    title: "Crime Rate/" + class_name,
    //    xaxis: { title: class_name },
    //    yaxis: {title: "Crime Rate"}
    // };


    // Plotly.newPlot("graph1", data1, layout);    

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
        case "SVM":
            processSVM();
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
        .text('SVM')
        .property("value", 'SVM');
    selector
        .append("option")
        .text('Prediction')
        .property("value", 'Prediction');

}  

init();
