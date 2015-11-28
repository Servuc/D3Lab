/**
 * Created by thomas on 20/11/15.
 */

$(document).ready(function()
{
  //Eure.JS

  var myObjEure = [];
  var myJsonContent = {buildings: [], naturals: [], highways: [], amenities: []};

  $.get('data/eure.json').success(function(data){
    myObjEure = data;
    myJsonContent = {buildings: [], naturals: [], highways: [], amenities: []};
    for (var cpt = 0; cpt < myObjEure.length; cpt++) {
      var tmpObject = myObjEure[cpt];

      if (tmpObject.hasOwnProperty("building") && tmpObject.building)
        myJsonContent.buildings.push(window.Shapes.createBuilding(tmpObject));
      else {
        if (tmpObject.hasOwnProperty("natural"))
          myJsonContent.naturals.push(window.Shapes.createNatural(tmpObject));
        else if (tmpObject.hasOwnProperty("highway"))
          myJsonContent.highways.push(window.Shapes.createRoad(tmpObject));
        else if (tmpObject.hasOwnProperty("amenity"))
          myJsonContent.amenities.push(window.Shapes.createAmenity(tmpObject));
      }
    }

    draw();
  });

  //Draw
  function draw() {
    var myWidth = $(window).width();
    var myHeight = $(window).height();

    var margin = {top: -5, right: -5, bottom: -5, left: -5};

    var mySvg = d3.select("body").append("svg")
      .attr("width", myWidth)
      .attr("height", myHeight)
      .call(d3.behavior.zoom().on("zoom", function () {
        mySvg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
      }))
      .append("g")


    //Append JSON
    //mySvg.append("text").attr("x", "10").attr("y", "30").attr("style", "font-size:25px").text("Le Havre - Quartier de l'Eure").attr("stroke", "white").attr("fill", "white");;
    for (var cpt = 0; cpt < myJsonContent.naturals.length; cpt++)
      mySvg.append("path").attr("d", myJsonContent.naturals[cpt].toSvgPath()).attr("stroke", "navy").attr("fill", "darkcyan");

    for (var cpt = 0; cpt < myJsonContent.highways.length; cpt++)
      mySvg.append("path").attr("d", myJsonContent.highways[cpt].toSvgPath()).attr("stroke", "white").attr("fill", "none");

    for (var cpt = 0; cpt < myJsonContent.buildings.length; cpt++)
      mySvg.append("path").attr("d", myJsonContent.buildings[cpt].toSvgPath()).attr("stroke", "purple").attr("fill", "darkorange").attr("id", cpt).attr("data", "building");

    for (var cpt = 0; cpt < myJsonContent.amenities.length; cpt++)
      mySvg.append("path").attr("d", myJsonContent.amenities[cpt].toSvgPath()).attr("stroke", "red").attr("fill", "lightgrey");


    d3.selectAll("[data='building']").on("mouseenter", function()
    {
      d3.select(this).attr("fill", "yellow");
    }).on("mouseout", function()
    {
      d3.select(this).attr("fill", "darkorange");
      $("#info").css("display","none");
    }).on("click", function()
    {
      var myCpt = d3.select(this).attr("id");
      $("#info > h3").text("ID : " + myJsonContent.buildings[myCpt].id);
      $("#info > p").text(myJsonContent.buildings[myCpt].toString());
      $("#info").css("display","block");
    });
  }
});
