function processLSD(filename) {

    console.log('in processLSD: ');

    d3.json(`/lsd/${filename}`).then(function(data) {

        console.log('after procLSD', data);

    } );   


}


function optionChanged(newFile) {

    console.log('dis b da file: ', newFile);
    switch (newFile) {
        case "lsd.csv":
          processLSD(newFile);
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
        .text('lsd.csv')
        .property("value", 'lsd.csv');
}  

init();
