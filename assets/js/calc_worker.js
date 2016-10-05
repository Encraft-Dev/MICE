importScripts('data.js');
//importScripts("https://github.com/downloads/kpozin/jquery-nodom/jquery.nodom.js")

self.addEventListener('message', function(e) {

var  i={}
i=e.data
 
//get cluster data

    var out=[];
    out.Scenario = [];
    out.Cluster=getClusterData(i.Cluster)
    //get property type data
    out.Geometry={
            "GIA": i.GIA,
            "#Stories": i.NoStories,
            "PV_Roof": i.PV_Roof,
            "PV_Pitch": i.PV_Pitch,
            "PV_Orientation": i.PV_Orientation,
            "PV_X_Out": i.PV_X_Out,
            "PV_X_Peak": i.PV_X_Peak,
            "DH_Int":i.DH_Int,
            "# of Properties": i.No_of_Properties,
            "Occupancy type":i.Occupancy_type,
             }
    //for each scenario /benchmark
    // 
    out.Scenario[0] = {
            "Benchmark": getBenchmarkData(i.Benchmark,i.Type),
            "Fuel": i.Fuel,
            "E_Billing": i.E_Billing,
            "S_E_Capacity": i.S_E_Capacity,
            "Fabric": {
                "Type": "EWI",
                "Cost": i.Upgrade_unit
                }
        }

       out.Scenario[1] = {
            "Benchmark": getBenchmarkData(i.Final_Benchmark,i.Final_Type),
            "Fuel": i.Final_Fuel,
            "E_Billing": i.Final_E_Billing,
            "S_E_Capacity": i.Final_S_E_Capacity,
            "Fabric": {
                "Type": "EWI",
                "Cost": i.Final_Upgrade_unit
                }
        }  
console.log(out)
        //get climate data from encraft api...
        //
        out.Climate ={}


        data =API_SAP2012 
       data.location.postcode.value=out.Cluster.Postcode
       
	var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api-encraft.rhcloud.com/sap2012");
    //xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
    		d = JSON.parse(xhr.responseText)
    		console.log(d)
         out.Climate = getClimateData(d.location.zone_number.value)
         self.postMessage(out);
    };
    xhr.send(JSON.stringify(data));


// ajax("https://api-encraft.rhcloud.com/sap2012", data, function(data) {
//    //do something with the data like:
//      out.Climate = getClimateData(out.location.zone_number.value)
//    self.postMessage(out);
// }, 'POST');

        //out.Climate = getClimateData(getclimateRegion(out.Cluster.Postcode))
   
       // output.push(out)
            //next scenario
    
        //do column check to ensure good data..
        //
        //do all ajax calls together
        //
        
//console.log(out)
  //self.postMessage(out);
}, false)



function getClusterData(i){//match one
var o
  for(c in cluster_Data){
   if(i==cluster_Data[c].Name){o=cluster_Data[c]}
}
   
return o;
}

    //with each input row do...
function getBenchmarkData(a,b){ //match two
  var o ={}
  var y=benchmark_Data;
  for (x in y){
        if (y[x].Benchmark_Type==a && y[x].Benchmark_ID==b ){o = y[x]}
  }

  return o;
}



function getClimateData(reg){
out={}

for (x in climate_Data){
     if(climate_Data[x].Region==reg){out= climate_Data[data]}
}
return out
}


var ax = function(){

	 var xhr = new XMLHttpRequest();
    xhr.open("GET", "lengthytaskhandler.ashx");
    xhr.onload = function () {
       ;
    };
    xhr.send();
}



var ajax = function(url, data, callback, type) {
  var data_array, data_string, idx, req, value;
  if (data == null) {
    data = {};
  }
  if (callback == null) {
    callback = function() {};
  }
  if (type == null) {
    //default to a GET request
    type = 'GET';
  }
  data_array = [];
  for (idx in data) {
    value = data[idx];
    data_array.push("" + idx + "=" + value);
  }
  data_string = data_array.join("&");
  req = new XMLHttpRequest();
  req.open(type, url, false);
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  req.onreadystatechange = function() {
    if (req.readyState === 4 && req.status === 200) {
      return callback(req.responseText);
    }
  };
  req.send(data_string);
  return req;
};