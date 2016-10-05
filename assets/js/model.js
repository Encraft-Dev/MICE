//TODO 
//add maximum roof top PV on residential???
//fabric upgrade cost per KWH saved.
//add in ajax error capture
//
//include battery,smart controls etc switches in scenarios also...
//
//
//
//process.... input baseline properties...
//>>>>save as scenario[0]
//make changes - >>save as scenario[1]
//make more changes >> save as scenario [2]
//etc.

var debug=true
//flow capture for debug and visual updates
var errors=[];
var stat=[];
function logError(err,func,obj){errors.push({err,func,obj}); console.log(errors[errors.length-1])};
function logStatus(txt){
				stat.push([txt]); 
					if(debug==true){
						console.log(txt);
						window.status = txt;
						updateStatus(txt)}
				};


function updateStatus(txt){$("#status").html(txt)}

var fetchAPI = function(data,API){//quick access to API objects
        return $.ajax({
        dataType: "json",
        method:"POST",
        url: "https://api-encraft.rhcloud.com/" + API,
        data:data
    });
}

var fetchDATA = function(data){//quick access to API objects
        return $.ajax({
        dataType: "json",
        method:"POST",
        url: "data/" + data + ".json",
    });
}

var input;
var cluster_Data;


$(document).ajaxStart(function(){$("#loading").show()});
$(document).ajaxStop(function(){$("#loading").hide()});
//document load


$(document).ready(function(){

//   $('#data_input').DataTable( {
//         data: input,
//        columns: getColumns(input)
//     } );
getInputData()


 });




//  -----------------  do ajax related



function showDataTable(inp){
    
   var container = document.getElementById('data_input');
var hot = new Handsontable(container,
 {
   data: inp
  });
	//   $('#data_input').DataTable( {
    //     data: input,
    //    columns: getColumns(input)
    // } );

}

//---begin data functions ----
//
function getInputData(){
logStatus(arguments.callee.name + " Start")
var aInput_data= fetchDATA("input_data")
var aCluster_data = fetchDATA("cluster_data")
var aprofile_data = fetchDATA("profile_data")

// get static profiles
//Electricity


$.when (aInput_data,aCluster_data).then(function(dInput,dCluster){
		console.log(dInput);
        input = dInput[0];
        showDataTable(input);
        cluster_Data=dCluster[0];
        logStatus("getInputData End")
       //next step
       console.log(aprofile_data)
       getClusterClimate()
    
    });
}


function getClusterClimate(){
logStatus("getClusterClimate Begin")
var deferreds=[]; //setup array for ajax promises



fetchAPI([],"sap2012").done(
    
    function(data){
    //create each ajax call 
    $.each(cluster_Data,function(c){
        var cluster=cluster_Data[c]
	        data.location.postcode.value=cluster.Postcode
            var ajax =  fetchAPI(data,"sap2012").done(function(d){
                cluster.Climate = getClimateData(d.location.zone_number.value);
            });
            deferreds.push(ajax)//push ajax promises into array
        });

    $.when.apply($,deferreds).then(function(){ //ajax and do next when complete
        logStatus("getClusterClimate End")
       doRowData();
    });
});

}

function doRowData(){

logStatus("dorowdata Begin")

rowData = dataCollation(input)//not async
rowData = dataAnnualDemand(rowData)//not async

logStatus("dorowdata End")

generationPV(rowData) //async

}



function dataCollation(i){//gather all data from appropriate sources, no calculations as this stage
   // logError("help","data_collation",i)
    logStatus("data_collation begin")

var output = [];
var work=[];

$.each(i,function(o){
    logStatus("data_collation row " + o)
    var out=[];
    out.Scenario = [];
    //add cluster Data
    out.Cluster=getClusterData(i[o].Cluster)
    //get property type data
    out.UID=o
   
    out.Geometry={
            "GIA": i[o].GIA,
            "No_Stories": i[o].NoStories,
            "PV_Roof": i[o].PV_Roof,
            "PV_Pitch": i[o].PV_Pitch,
            "PV_Orientation": i[o].PV_Orientation,
            "PV_X_Out": i[o].PV_X_Out,
            "PV_X_Peak": i[o].PV_X_Peak,
            "DH_Int":i[o].DH_Int,
            "No_of_Properties": i[o].No_of_Properties,
            "Occupancy type":i[o].Occupancy_type,
             }
    //for each scenario /benchmark
    // 
    out.Scenario[0] = {
            "Benchmark": getBenchmarkData(i[o].Benchmark,i[o].Type),
            "Fuel": i[o].Fuel,
            "E_Billing": i[o].E_Billing,
            "S_E_Capacity": i[o].S_E_Capacity,
            "Fabric": {
                "Type": "EWI",
                "Cost": i[o].Upgrade_unit
                }
        }

       out.Scenario[1] = {
            "Benchmark": getBenchmarkData(i[o].Final_Benchmark,i[o].Final_Type),
            "Fuel": i[o].Final_Fuel,
            "E_Billing": i[o].Final_E_Billing,
            "S_E_Capacity": i[o].Final_S_E_Capacity,
            "Fabric": {
                "Type": "EWI",
                "Cost": i[o].Final_Upgrade_unit
                }
        }  

   
        output.push(out)
       
            //next scenario
        });
        //do column check to ensure good data..
        //
         return output
}

function dataAnnualDemand(i){//do all calcs for demand to get annual values
    var out={}
    //for each scenario
    $.each(i, function(x){//each row
        $.each(i[x].Scenario,function(y){//each scenario
            //set up structure
            z=i[x].Scenario[y]
            z.Demand = {"Electricity":null,"Heat":null,"DHW":null,"Cool":null} //TODO adjust for climate
            z.Generation = {"Electricity":{},"Heat":{}}
            //Heat
            z.Demand.Heat = z.Benchmark.FEE * i[x].Geometry.GIA 
            
            //check type = switch used to enable more types to be used with default to numbers
            ////Electricity
            switch (z.Benchmark.Elec) {
                case "SAP2012":
                 z.Demand.Electricity = SAP2012(i[x].Geometry.GIA).Lighting + SAP2012(i[x].Geometry.GIA).Appliances
                break;
                default:
                z.Demand.Electricity=z.Benchmark.Elec * i[x].Geometry.GIA
            }

             //DHW
              switch (z.Benchmark.DHW) {
                case "SAP2012":
                z.Demand.DHW = SAP2012(i[x].Geometry.GIA).DHW
                break;
                default:
                z.Demand.DHW = z.Demand.Heat * z.Benchmark.DWH
            }
        });
    });
return i
}


function generationPV(i){


	MCS24_api={}
    logStatus("PV Calc")
	

    var deferreds=[]; //setup array for ajax promises

fetchAPI([],"MCS24").done(
      function(data){
            $.each(i,function(r){
                
                i[r].Generation={}
                //calc roof area....
                area=(i[r].Geometry.GIA/i[r].Geometry.No_Stories)*i[r].Geometry.PV_Roof
              
                PVpeak=area/1.6
                i[r].Generation.PVpeak = PVpeak.toFixed(2)
                
           
                data.location.postcode.value=i[r].Cluster.Postcode
                data.panels[0].electrical_rating.value=PVpeak*1000
                data.panels[0].orientation.azimuth=i[r].Geometry.PV_Orientation
                data.panels[0].pitch.value=i[r].Geometry.PV_Pitch
                data.panels[0].panel_count.value=1      
                //console.log(rMCS)
                    //check if existing PV and get output
                
                var ajax=fetchAPI(data,"MCS24").done(function(d){
                 i[r].Generation.PV=d.annual_electrical_output.value.toFixed(2)
                 })
                deferreds.push(ajax)
                });//each
 
    $.when.apply($,deferreds).then(function(data){ //ajax and do next when complete
      getProfiles(i) ; console.log(i)
        });
});
   
}

function getProfiles(){
// get all demand profiles here..
//heat,dhw, electricity,PV 

//demand profile data
var aPVProfile_data
var aHProfile_data
var aHWprofile_data
var aEprofile_data


}
	// //load api json payload
	// $.ajax({
	//   	dataType: "json",
	//   	url: "https://api-encraft.rhcloud.com/MCS24",
	//   	async:true,
	//     success: function(j){
	//     	MCS24_api=j

	//     	$.each(i,function(r){
	// 			i[r].Generation={}
				
	// 			//calc roof area....
	// 			area=(i[r].Geometry.GIA/i[r].Geometry.No_Stories)*i[r].Geometry.PV_Roof
	// 			PVpeak=area/1.6
	// 			i[r].Generation.PVpeak = PVpeak.toFixed(2)
	// 			logStatus("MCS24 row" + r)
	// 			rMCS=MCS24_api
	// 			rMCS.location.postcode.value=i[r].Cluster.Postcode
	// 			rMCS.panels[0].electrical_rating.value=PVpeak*1000
	// 			rMCS.panels[0].orientation.azimuth=i[r].Geometry.PV_Orientation
	// 			rMCS.panels[0].pitch.value=i[r].Geometry.PV_Pitch
	// 			rMCS.panels[0].panel_count.value=1		
	// 			//console.log(rMCS)
	// 		 		//check if existing PV and get output
	// 		 	$.ajax({
	// 		 		url:"https://api-encraft.rhcloud.com/MCS24",
	// 		 		data:rMCS,
	// 		 		method:"POST",
	// 				async:true,
	// 				success:function(d){
	// 						i[r].Generation.PV=d.annual_electrical_output.value.toFixed(2)
	// 						icheck++;
	// 						if(icheck==i.length){nxtfunc(i)}
	// 					}
	// 				});
	// 		 	});

	//     }
	// });





// var deferreds=[]; //setup array for ajax promises

// fetchAPI([],"sap2012").done(
//     function(data){
//     //create each ajax call 
//     $.each(cluster_Data,function(c){
//         var cluster=cluster_Data[c]
//             data.location.postcode.value=cluster.Postcode
//             var ajax =  $.ajax({
//                             dataType: "json",
//                             method:"POST",
//                             url: "https://api-encraft.rhcloud.com/sap2012",
//                             data:data
//             }).done(function(d){
//                 cluster.Climate = getClimateData(d.location.zone_number.value);
//             });
//             deferreds.push(ajax)//push ajax promises into array
//         });

//     $.when.apply($,deferreds).then(function(){ //ajax and do next when complete
//         logStatus("getClusterClimate End")
//        doRowData();
//     });
// });









function fuelDemand(i){//get required denad by fuel type

}


function dataProfiles(i){//do all hourly profiles calcs for interactions  

}


function getClusterData(i){//match one
var o
$.each(cluster_Data,function(x){
    if(cluster_Data[x].Name==i){
       o = cluster_Data[x]
        }
    });


//get postcode related data...eg climate



return o;
}

function getBenchmarkData(a,b){ //match two
  var o ={}
  var y=benchmark_Data;
  $.each(y,function(x){
    if (y[x].Benchmark_Type==a && y[x].Benchmark_ID==b ){
        o = y[x]
        
        }
  });  
  return o;
}

function getColumns(d){//return columns list for datatable output
    var out = []
    $.each(d[0], function(value){
        out.push({"data":value,"title":value})
    });
    return out
}


function getclimateRegion(id,pcode){//async  need to change calc to be multithread asyncrous...
 

  out="no"
        data =API_SAP2012 
        data.location.postcode.value=pcode
        $.ajax({
            dataType: "json",
            method:"POST",
            url: "https://api-encraft.rhcloud.com/sap2012",
            data:data,
            async:false,
            success: function(d){out=d}
            });
  
return out.location.zone_number.value
}


function getClimateData(reg){
out={}
 $.each(climate_Data,function(data){
 		if(climate_Data[data].Region==reg){out= climate_Data[data]}
	 });

return out
}

function SAP2012(gia){
//get number of occupants
var out={};
var occ = (gia<13.9) ? 1 : 1 + (1.76 * (1 - Math.exp(-0.000349 * Math.pow((gia-13.9),2)) + (0.0013 * (gia-13.9))))
     out = {
        "Lighting":59.73 * Math.pow(gia * occ,0.4714),
        "Appliances":207.8 * Math.pow(gia * occ,0.4714),
        "DHW":SAP2012_DHW(occ)
    }
return out
}

function SAP2012_DHW(occ){
    var DHW=0
    var avHW=(25 * occ) + 36
            $.each(months, function(d,i){    
                DHW+=1.15 * (monthly_Data.DHW_Factors[i]*avHW*4.18*monthly_Data.Days_in_month[i]*monthly_Data.DHW_Temp_Rise[i])/3600
            });   
        return DHW
}







// Sub Data_calculation2()
// updateStatus ("...and we are off...")
// 'set error log to zero...

// Set errorLog = New Collection
// Application.Calculation = xlCalculationManual
// 'move selction to somewhere safe - due to VBA and excel tables being a bit bum if a table is left selected
// Sheets("Data_Out").Activate
// range("A1").Select
// Sheets("Data").Activate
// Sheets("Data").range("output_status").Select

// 'On Error GoTo 0

// 'cclear output
// 'Sheets("tmp_out").Cells.Clear

// 'sap outputs for hot water and electrial use...
// updateStatus ("Setting up tables")

// Dim m As ListObject
// Dim mc As ListColumns

// Dim bl As ListObject
// Dim bc As ListColumns

// Dim allData As Collection
// Set allData = New Collection

// Dim clusterData As Dictionary
// Set clusterData = New Dictionary

// 'get list of properties
// Dim l As ListObject
// Dim c As ListColumns
// Set l = Sheets("data").ListObjects("input_data")
// Set c = l.ListColumns

// 'get benchmarks
// 'this must be done inside the row loop

// 'get profiles info
// Dim pl As ListObject
// Dim pc As ListColumns
// Set pl = Sheets("Profiles").ListObjects("Profile_Sources")
// Set pc = pl.ListColumns


// 'get list of clusters
// Dim cl As ListObject
// Dim cc As ListColumns
// Set cl = Sheets("Clusters").ListObjects("cluster_list")
// Set cc = cl.ListColumns

// 'get fuel profile object
// Dim fpl As ListObject
// Dim fpc As ListColumns
// Set fpl = Sheets("Clusters").ListObjects("fuel_profiles")
// Set fpc = fpl.ListColumns


// updateStatus "Reticulating Splines"
// j = 0
// RowCount = 0

// 'On Error GoTo Err1:

// 'clear output table

// With l 'data table
// updateStatus "Starting loop through data table"
// 'provide way of identifying first item in each cluster


//     For Each r In .DataBodyRange.Rows ' each data row
        
//         Do 'provide ability to exit row if error encountered..
//             updateStatus "Starting row loop", RowCount
//             RowCount = RowCount + 1
            
//             If r.Cells(1, c("Cluster").Index) = "" And r.Cells(1, c("ID").Index) = "" Then
//                 addToErrorLog "Row Check", "Blank Row", RowCount
//                 Exit Do ' next row if no data.
//             End If
            
//             Dim rowData As Dictionary 'for output
//             'get associated cluster data from Cluster worksheet
//             Set rowData = New Dictionary
           
//            'check data for missing...
//             'list required cells
            
            
                        
//              Dim required As Collection
//              Set required = New Collection
//              required.Add "Cluster"
//              required.Add "ID"
//              required.Add "# of Properties"
//              required.Add "Occupancy type"
//              required.Add "GIA"
//              required.Add "Fuel"
//              required.Add "Benchmark"
//              required.Add "Type"
                         
//              For Each Req In required
//                 If r.Cells(1, c(Req).Index) = "" Then
//                     addToErrorLog "Missing Data", CStr(Req), RowCount
//                 End If
//              Next Req
              
//             'add existing data to row object
//             rowData.Add "Cluster", r.Cells(1, c("Cluster").Index)
            
            
//             If clusterData.Exists(CStr(rowData("Cluster"))) Then
//                  clusterData(CStr(rowData("Cluster"))) = 2
//             Else
//                  clusterData.Add CStr(rowData("Cluster")), 1
//             End If
            
            
//             rowData.Add "ID", r.Cells(1, c("ID").Index)
//             rowData.Add "#", r.Cells(1, c("# of Properties").Index)
//             rowData.Add "Profile", r.Cells(1, c("Occupancy type").Index)
//             rowData.Add "TFA", r.Cells(1, c("GIA").Index)
//             rowData.Add "DH_Int", r.Cells(1, c("DH_Int").Index)
//             rowData.Add "Fabric_Cost", r.Cells(1, c("£_Upgrade_unit").Index)
            
//            
            
//             'get associated profiles
//                'get associated original benchmark data
//              updateStatus "Getting initial benchmark data", RowCount
//              rowData.Add "Benchmark", r.Cells(1, c("Benchmark").Index)
//              rowData.Add "Benchmark_type", r.Cells(1, c("Type").Index)
//              rowData.Add "Fuel", r.Cells(1, c("Fuel").Index)
// '
            
//              rowData.Add "E_Bill", r.Cells(1, c("E_Billing").Index)
            
// ' ----------------------PV---------------------------------
        
//         'do pv for each item
//              updateStatus "Getting PV Results", RowCount
//         'sort out bad data
//             '#stories
//             rowData.Add "#Stories", IIf(r.Cells(1, c("#Stories").Index) = "", 1, r.Cells(1, c("#Stories").Index))
//             '#pvroof proportion
//             rowData.Add "PV_%roof", IIf(r.Cells(1, c("PV_%Roof").Index) = "", 0, r.Cells(1, c("PV_%Roof").Index))
//             '#pv orientation
//             rowData.Add "PV_Orientation", IIf(r.Cells(1, c("PV_Orientation").Index) = "", 0, r.Cells(1, c("PV_Orientation").Index))
//             'pv roof pitch
//             rowData.Add "PV_pitch", IIf(r.Cells(1, c("PV_Pitch").Index) = "", 0, r.Cells(1, c("PV_Pitch").Index))
//             'pv existing
//             rowData.Add "PV_X_Out", IIf(r.Cells(1, c("PV_X_Out").Index) = "", 0, r.Cells(1, c("PV_X_Out").Index))
//             rowData.Add "PV_X_Peak", IIf(r.Cells(1, c("PV_X_Peak").Index) = "", 0, r.Cells(1, c("PV_X_Peak").Index))
  
                         
//              G_E_PV = 0 ' pv output for savings and export
//              PV_PK = 0 ' peak for size
//              T_PV_PK = 0 'peak for capital/install
//              T_G_PV = 0 'gen for tariff
             
//              Final_G_E_PV = 0 ' pv output for savings and export
//              Final_PV_PK = 0 ' peak for size
//              Final_T_PV_PK = 0 'peak for capital/install
//              Final_T_G_PV = 0 'gen for tariff
             
//             If rowData("PV") = "Yes" Then
//                     'PV_PK is used for installation costs.

//                     'check if existing PV and use these figures
//                     If rowData("PV_X_Out") <> 0 Then
//                         'if exist baseline only uses output for calcs, not for financial
    
//                         G_E_PV = r.Cells(1, c("PV_X_Out").Index) ' pv output for savings and export
//                         PV_PK = r.Cells(1, c("PV_X_Peak").Index) ' peak for size
//                         T_PV_PK = 0 'peak for capital/install
//                         T_G_PV = 0 'gen for tariff
                        
//                         Final_G_E_PV = r.Cells(1, c("PV_X_Out").Index) ' pv output for savings and export
//                         Final_PV_PK = r.Cells(1, c("PV_X_Peak").Index) ' peak for size
//                         Final_T_PV_PK = 0 'peak for capital/install
//                         Final_T_G_PV = 0 'gen for tariff
  
//                     Else ' use calculated figures

//                         Pv_area = (rowData("TFA") * rowData("PV_%roof")) / rowData("#Stories")
//                         PV_peak = CLng(rowData("#") * (Pv_area / range("pv_panel_area")) * (CLng(range("pv_panel_power")) / 1000))
//                         PV_out = 0
 
//                          'get pv output from Encraft API
//                         If IEAvailable = True Then 'check if connection is available
//                              PV_out = MCS24(CStr(rowData("Postcode")), 1000, PV_peak, CInt(rowData("PV_pitch")), CInt(rowData("PV_Orientation")), 0)
//                         Else
//                              addToErrorLog "PV", "No Internet", RowCount
//                         End If
                        
//                         G_E_PV = 0 ' pv output for savings and export
//                         PV_PK = 0 ' peak for size
//                         T_PV_PK = 0 'peak for capital/install
//                         T_G_PV = 0  'gen for tariff
                        
//                         Final_G_E_PV = PV_out ' pv output for savings and export
//                         Final_PV_PK = PV_peak
//                         Final_T_PV_PK = PV_peak 'peak for capital/install
//                         Final_T_G_PV = PV_out 'gen for tariff
                            
//                    End If

//             End If ' PV = YES
            
//             'add some sort of before after switch for PV
//             'initial pk
            
//              rowData.Add "G_E_PV", G_E_PV ' pv output for savings and export
//              rowData.Add "PV_PK", PV_PK ' peak for size
//              rowData.Add "T_PV_PK", T_PV_PK 'peak for capital/install
//              rowData.Add "T_G_PV", T_G_PV  'gen for tariff
             
//              rowData.Add "Final_G_E_PV", Final_G_E_PV ' pv output for savings and export
//              rowData.Add "Final_PV_PK", Final_PV_PK ' peak for size
//              rowData.Add "Final_T_PV_PK", Final_T_PV_PK 'peak for capital/install
//              rowData.Add "Final_T_G_PV", Final_T_G_PV 'gen for tariff

//              updateStatus "Getting PV profile", RowCount
//              Set rowData = getProfiledata("Profile_PV", "P_PV", rowData)
//     '------------------calculate PV export per building type------
//          '   Set rowData = calculatePVExport(rowData)
      
//              updateStatus "Calculating energy use figures", RowCount
                     
//             ftext = "" ' string to allow adding final to benchmark for second time through
//             For fl = 1 To 2
//                   If fl = 2 Then
//                       ftext = "Final_"
//                         'check for final benchmark options  and copy baseline if not present
//                         rowData.Add "Final_Benchmark", IIf(r.Cells(1, c("Final_Benchmark").Index) = "", rowData("Benchmark"), r.Cells(1, c("Final_Benchmark").Index))
//                         rowData.Add "Final_Benchmark_type", IIf(r.Cells(1, c("Final_Type").Index) = "", rowData("Benchmark_type"), r.Cells(1, c("Final_Type").Index))
                        
//                          'capture if final fuel has changed
//                         rowData.Add ("Final_Fuel_Capital"), IIf(r.Cells(1, c("Final_Fuel").Index) = "", 0, 1)
//                         rowData.Add "Final_Fuel", IIf(r.Cells(1, c("Final_Fuel").Index) = "", rowData("Fuel"), r.Cells(1, c("Final_Fuel").Index))
//                         rowData.Add "Final_E_Bill", IIf(r.Cells(1, c("Final_E_Billing").Index) = "", rowData("E_Bill"), r.Cells(1, c("Final_E_Billing").Index))
//                   End If
                  
//                   'get fuel profile data.
//                   With fpl
//                     For Each fuel In .DataBodyRange.Rows
//                         If fuel.Cells(1, fpc("Fuel").Index) = rowData(ftext & "Fuel") Then
                            
                            
//                             'get Fuel options
//                             rowData.Add ftext & "Fuel_E", IIf(fuel.Cells(1, fpc("Electricity").Index) = "", 0, fuel.Cells(1, fpc("Electricity").Index))
//                             rowData.Add ftext & "Fuel_G", IIf(fuel.Cells(1, fpc("Gas").Index) = "", 0, fuel.Cells(1, fpc("Gas").Index))
//                             rowData.Add ftext & "Fuel_O", IIf(fuel.Cells(1, fpc("Oil").Index) = "", 0, fuel.Cells(1, fpc("Oil").Index))
//                             rowData.Add ftext & "Fuel_B", IIf(fuel.Cells(1, fpc("Biomass").Index) = "", 0, fuel.Cells(1, fpc("Biomass").Index))
//                             rowData.Add ftext & "Fuel_GSHP", IIf(fuel.Cells(1, fpc("GSHP").Index) = "", 0, fuel.Cells(1, fpc("GSHP").Index))
//                             rowData.Add ftext & "Fuel_ASHP", IIf(fuel.Cells(1, fpc("ASHP").Index) = "", 0, fuel.Cells(1, fpc("ASHP").Index))
//                             rowData.Add ftext & "Fuel_CHP", IIf(fuel.Cells(1, fpc("CHP-T").Index) = "", 0, fuel.Cells(1, fpc("CHP-T").Index))
//                             'get District heat options
//                             rowData.Add ftext & "DH", IIf(fuel.Cells(1, fpc("DH").Index) = True, 1, 0)
//                             rowData.Add ftext & "DH_LF", IIf(fuel.Cells(1, fpc("DH").Index) = True, 1 + range("DH_losses"), 1)
//                             rowData.Add ftext & "DH_E", IIf(fuel.Cells(1, fpc("DH").Index) = True, range("dh_Elec_use"), 0)
                            
//                             'get billing/charging profile
//                             rowData.Add ftext & "E_Tariff_Profile", IIf(fuel.Cells(1, fpc("Fuel_tariff_profile").Index) = "", "Flat rate", fuel.Cells(1, fpc("Fuel_tariff_profile").Index))
//                             'Debug.Print (fuel.Cells(1, fpc("Fuel_tariff_profile").Index))
                            
                            
//                             'get profile variant before gettting heating and electricity profiles
//                              rowData.Add ftext & "P_Variant", IIf(fuel.Cells(1, fpc("Profile_Variant").Index) <> "", fuel.Cells(1, fpc("Profile_Variant").Index), "Basic")
//                             'get tariff profile data
                            
//                             'Debug.Print (rowData(ftext & "E_Tariff_Profile"))
//                             Set rowData = getProfiledata("profile_Energy_Tariffs", ftext & "E_Tariff_Profile", rowData, "Tariff")
//                             'get electricity billing type
                            
//                         End If
//                     Next fuel
//                   End With
                  
//                    updateStatus "Getting demand profile data", RowCount
//                      With pl
//                          For Each profile In .DataBodyRange.Rows
        
//                              If profile.Cells(1, pc("Group").Index) = rowData("Profile") And profile.Cells(1, pc("Variant").Index) = rowData(ftext & "P_Variant") Then
//                                 rowData.Add ftext & "Profile_Elec", profile.Cells(1, pc("Electricity").Index)
//                                 rowData.Add ftext & "Profile_Heat", profile.Cells(1, pc("Heating").Index)
//                                 rowData.Add ftext & "Profile_DHW", profile.Cells(1, pc("DHW").Index)
//                                 rowData.Add ftext & "Profile_recharge", profile.Cells(1, pc("Type").Index)
//                              End If
//                          Next profile
//                      End With
                      
     
                     
            
//                     ' get profile data? needs to be by fuel type and occupancy
//                   Set rowData = getProfiledata(rowData(ftext & "Profile_Elec"), ftext & "P_E", rowData)
//                   Set rowData = getProfiledata(rowData(ftext & "Profile_Heat"), ftext & "P_H", rowData)
//                   Set rowData = getProfiledata(rowData(ftext & "Profile_DHW"), ftext & "P_W", rowData)
                      
//                   'get benchmarking info
//                   Set bl = Sheets("Benchmarks").ListObjects(CStr(rowData(ftext & "Benchmark"))) 'select correct benchmark table
//                   Set bc = bl.ListColumns
              
//                   FEE = ""
//                   Elec = ""
//                   Fuel_Scale = ""
//                   DHW = ""
//                   loc_uplift = ""
            
//                 'get benchmark figures
//                   With bl
//                       For Each bench In .DataBodyRange.Rows
//                              If bench.Cells(1, bc("Type").Index) = rowData(ftext & "Benchmark_type") Then
//                                     FEE = bench.Cells(1, bc("FEE").Index)
//                                     Elec = bench.Cells(1, bc("Elec").Index)
//                                     DHW = bench.Cells(1, bc("DHW%").Index)
//                                     loc_uplift = bench.Cells(1, bc("Loc_Uplift").Index)
//                              End If
//                       Next bench
//                   End With
                      
               
//                  rowData.Add ftext & "Benchmark_Elec", Elec
//                  'Benchmark elec and hotwater outputs
                  
//                   Select Case rowData(ftext & "Benchmark_Elec")
//                       Case "SAP2012" 'does all including DHW
//                          updateStatus "Calculating SAP 2012 Electricity figures", RowCount
                         
//                           Set SAP = SAP2012(rowData("TFA"))
                          
//                           rowData.Add ftext & "Energy_Electrical_total", CLng(SAP("Electrical_usage") * rowData("#"))
//                           rowData.Add ftext & "Energy_Electrical_lighting", CLng(SAP("Lighting") * rowData("#"))
//                           rowData.Add ftext & "Energy_Electrical_appliances", CLng(SAP("Appliances") * rowData("#"))
//                       Case Else
//                           range("output_status").Value = "Using Benchmark figures"
//                           rowData.Add ftext & "Energy_Electrical_total", CLng(rowData("TFA") * rowData(ftext & "Benchmark_Elec") * rowData("#"))
//                           rowData.Add ftext & "Energy_Electrical_lighting", 0
//                           rowData.Add ftext & "Energy_Electrical_appliances", 0
                          
//                   End Select
//                  'check if FEE benchmark requires uplift
//                  o = IIf(loc_uplift = True, range("Uplift"), 1)
              
//                  FEE = FEE * o
                     
//                 'now do DHW
//                  Select Case DHW
//                       Case "SAP2012" 'does all including DHW
//                          updateStatus "Calculating SAP 2012 DHW figures", RowCount
//                            rowData.Add ftext & "Benchmark_DHW", DHW
//                            Set SAP = SAP2012(rowData("TFA"))
//                            DHW = SAP("dhw") * rowData("#")
//                       Case Else
//                           updateStatus "Using Benchmark figures for hot water", RowCount
//                            DHW = FEE * DHW
//                            FEE = FEE - DHW
//                            rowData.Add ftext & "Benchmark_DHW", DHW
//                            DHW = DHW * rowData("#") * rowData("TFA")
//                  End Select
               
//                  rowData.Add ftext & "Energy_DHW", CLng(DHW)
//                  rowData.Add ftext & "Benchmark_FEE", FEE
//                  rowData.Add ftext & "Energy_heating", FEE * rowData("#") * rowData("TFA")
                  
//                   updateStatus "Getting fuel bands", RowCount
             
//                  'get fuel charging band..
                 
//                  Set rowData = getProfiledata("profile_fuel_bands", ftext & "Fuel_band", rowData, "Fuel_band")
                                   
//                  'get battery capacity data..
//                  'static battery
//                  rowData.Add ftext & "S_E_Cap", IIf(r.Cells(1, c(ftext & "S_E_Capacity").Index) <> "", rowData("#") * r.Cells(1, c(ftext & "S_E_Capacity").Index), 0)
//                  'vehicle battery
                 
                                   
//             Next fl

//  '-----------------Do calcs and get billable totals -----------
//             updateStatus "Doing calcs", RowCount
//             Set rowData = Allcalcs(rowData)
//             Set rowData = Allcalcs(rowData, "Final_")
//  '-------------------Add to output data set-------------------------------
//              updateStatus "Add to Final Data set", RowCount
     
//              allData.Add rowData

//         Loop While False ' do loop
//     Next r
// End With 'l

// '----------do data write out--------
// updateStatus ("Writing Out")

// 'get each cluster data,process and copy data.
// clearClusterSheets
// With cl
//              For Each cluster In .DataBodyRange.Rows
//                 If cluster.Cells(1, cc("Active").Index) = True Then
//                     writeOutData allData, cluster.Cells(1, cc("Name").Index)
//                     'this = AnnualCashflow(Range("project_lifetime"), "all")
//                 End If
//              Next cluster
// End With

// 'finish with allData
// writeOutData allData, "all"
// 'do financial calcs for all clusters.
// 'this = AnnualCashflow(Range("project_lifetime"), "all")
// Sheets("data").Activate


// 'run_financials (Range("project_lifetime"))
// Application.ScreenUpdating = True
// updateStatus ("Done")

// '----------Deal with errors and final output--------------

// finstring = "Finished with " & errorLog.count & " errors." & vbNewLine & vbNewLine
// finstring = finstring & "--------- Errors ---------"

// For Each entry In errorLog
//  finstring = finstring & vbNewLine & "Row: " & entry(2) & " | Error: " & entry(1) & " | Status: " & entry(3)
// Next entry


// Application.Calculation = xlCalculationAutomatic
// outputRangetoTxtFile

// MsgBox (finstring)


// Exit Sub
// Err1: myError (RowCount)
// End
// 
// 
// 
// 
// 
// 
// 
// 
// ---------------DATA for offline use.----------------
// 





//-------testing new data sets
//

// var new_input = [
// {"Cluster":"Health Centre","ID":"1 bed bungalow Bryant Wallframe","# of Properties":14,"Occupancy type":"Domestic-ERC","GIA":48,"#Stories":1,"PV_%Roof":0.4,"PV_Pitch":35,"PV_Orientation":0,"DH_Int":null,"Benchmark":[{"List":"Project","Type":"Bungalow Semi","Fuel":"Gas","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":500,"Final_Benchmark":"Project","Final_Type":"Bungalow cavity wall","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":2},
// {"Cluster":"Health Centre","ID":"1 bed bungalow Morris & Jacob Timberframe","# of Properties":13,"Occupancy type":"Domestic-ERC","GIA":40,"#Stories":1,"PV_%Roof":0.264,"PV_Pitch":35,"PV_Orientation":0,"DH_Int":null,"Benchmark":"Project","Type":"Bungalow Semi","Fuel":"Gas","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":500,"Final_Benchmark":"Project","Final_Type":"Bungalow cavity wall","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":2},
// {"Cluster":"Health Centre","ID":"1 bed bungalow Morris & Jacob Timberframe","# of Properties":1,"Occupancy type":"Domestic-ERC","GIA":40,"#Stories":1,"PV_%Roof":0.4,"PV_Pitch":35,"PV_Orientation":0,"DH_Int":null,"Benchmark":"Project","Type":"Bungalow Semi","Fuel":"Electricity E7","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":500,"Final_Benchmark":"Project","Final_Type":"Bungalow cavity wall","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":2},
// {"Cluster":"Health Centre","ID":"3 bed house (1972) Bryant Wallframe","# of Properties":1,"Occupancy type":"Domestic-ERC","GIA":78,"#Stories":2,"PV_%Roof":0.264,"PV_Pitch":35,"PV_Orientation":0,"DH_Int":null,"Benchmark":"Project","Type":"Semi-detached","Fuel":"Gas","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":500,"Final_Benchmark":"Project","Final_Type":"House cavity wall insulation","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":2},
// {"Cluster":"Health Centre","ID":"3 bed house (1976) Bryant Wallframe","# of Properties":1,"Occupancy type":"Domestic-ERC","GIA":78,"#Stories":2,"PV_%Roof":0.264,"PV_Pitch":35,"PV_Orientation":0,"DH_Int":null,"Benchmark":"Project","Type":"Semi-detached","Fuel":"Gas","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":500,"Final_Benchmark":"Project","Final_Type":"House cavity wall insulation","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":2},
// {"Cluster":"Health Centre","ID":"3 bed house Bryant Wallframe","# of Properties":38,"Occupancy type":"Domestic-ERC","GIA":78,"#Stories":2,"PV_%Roof":0.264,"PV_Pitch":35,"PV_Orientation":0,"DH_Int":null,"Benchmark":"Project","Type":"Semi-detached","Fuel":"Gas","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":500,"Final_Benchmark":"Project","Final_Type":"House cavity wall insulation","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":2},
// {"Cluster":"Health Centre","ID":"3 bed house Morris & Jacob Timberframe","# of Properties":4,"Occupancy type":"Domestic-ERC","GIA":78,"#Stories":2,"PV_%Roof":0.264,"PV_Pitch":35,"PV_Orientation":0,"DH_Int":null,"Benchmark":"Project","Type":"Semi-detached","Fuel":"Gas","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":500,"Final_Benchmark":"Project","Final_Type":"House cavity wall insulation","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":2},
// {"Cluster":"Health Centre","ID":"3 bed house Stubbings Timberframe","# of Properties":1,"Occupancy type":"Domestic-ERC","GIA":78,"#Stories":2,"PV_%Roof":0.264,"PV_Pitch":35,"PV_Orientation":0,"DH_Int":null,"Benchmark":"Project","Type":"Semi-detached","Fuel":"Gas","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":500,"Final_Benchmark":"Project","Final_Type":"House cavity wall insulation","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":2},
// {"Cluster":"Health Centre","ID":"3 bed house Stubbings Timberframe","# of Properties":1,"Occupancy type":"Domestic-ERC","GIA":78,"#Stories":2,"PV_%Roof":0.264,"PV_Pitch":35,"PV_Orientation":0,"DH_Int":null,"Benchmark":"Project","Type":"Semi-detached","Fuel":"Gas","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":500,"Final_Benchmark":"Project","Final_Type":"House cavity wall insulation","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":2},
// {"Cluster":"Health Centre","ID":"4 bed house (1976) Bryant Wallframe","# of Properties":1,"Occupancy type":"Domestic-ERC","GIA":100,"#Stories":2,"PV_%Roof":0.264,"PV_Pitch":35,"PV_Orientation":0,"DH_Int":null,"Benchmark":"Project","Type":"Semi-detached","Fuel":"Gas","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":500,"Final_Benchmark":"Project","Final_Type":"House cavity wall insulation","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":2},
// {"Cluster":"Health Centre","ID":"4 bed house Bryant Wallframe","# of Properties":2,"Occupancy type":"Domestic-ERC","GIA":100,"#Stories":2,"PV_%Roof":0.264,"PV_Pitch":35,"PV_Orientation":0,"DH_Int":null,"Benchmark":"Project","Type":"Semi-detached","Fuel":"Gas","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":500,"Final_Benchmark":"Project","Final_Type":"House cavity wall insulation","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":2},
// {"Cluster":"Health Centre","ID":"Health Centre","# of Properties":1,"Occupancy type":"Commercial_6","GIA":2930,"#Stories":3,"PV_%Roof":0.5,"PV_Pitch":10,"PV_Orientation":0,"DH_Int":10,"Benchmark":"Project","Type":"Health Centre","Fuel":"Gas","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":null,"Final_Benchmark":"","Final_Type":"","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":0},
// {"Cluster":"Health Centre","ID":"HR 1 bed flat - Balliol","# of Properties":21,"Occupancy type":"Domestic-ERC","GIA":45.8,"#Stories":11,"PV_%Roof":null,"PV_Pitch":0,"PV_Orientation":null,"DH_Int":10,"Benchmark":"Project","Type":"Tower block post insulation","Fuel":"Electricity E7","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":null,"Final_Benchmark":"","Final_Type":"","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":0},
// {"Cluster":"Central","ID":"HR 1 bed flat - Linacre","# of Properties":21,"Occupancy type":"Domestic-ERC","GIA":45.8,"#Stories":11,"PV_%Roof":null,"PV_Pitch":0,"PV_Orientation":null,"DH_Int":10,"Benchmark":"Project","Type":"Tower block post insulation","Fuel":"Electricity E7","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":null,"Final_Benchmark":"","Final_Type":"","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":0},
// {"Cluster":"Health Centre","ID":"HR 1 bed flat - Merton","# of Properties":22,"Occupancy type":"Domestic-ERC","GIA":45.8,"#Stories":11,"PV_%Roof":null,"PV_Pitch":0,"PV_Orientation":null,"DH_Int":10,"Benchmark":"Project","Type":"Tower block post insulation","Fuel":"Electricity E7","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":null,"Final_Benchmark":"","Final_Type":"","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":0},
// {"Cluster":"North","ID":"HR 1 bed flat - Oriel","# of Properties":22,"Occupancy type":"Domestic-ERC","GIA":45.8,"#Stories":11,"PV_%Roof":null,"PV_Pitch":0,"PV_Orientation":null,"DH_Int":10,"Benchmark":"Project","Type":"Tower block post insulation","Fuel":"Electricity E7","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":null,"Final_Benchmark":"","Final_Type":"","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":0},
// {"Cluster":"Health Centre","ID":"HR 2 bed flat - Balliol","# of Properties":19,"Occupancy type":"Domestic-ERC","GIA":70.4,"#Stories":11,"PV_%Roof":null,"PV_Pitch":0,"PV_Orientation":null,"DH_Int":10,"Benchmark":"Project","Type":"Tower block post insulation","Fuel":"Electricity E7","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":null,"Final_Benchmark":"","Final_Type":"","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":0},
// {"Cluster":"Central","ID":"HR 2 bed flat - Linacre","# of Properties":20,"Occupancy type":"Domestic-ERC","GIA":70.4,"#Stories":11,"PV_%Roof":null,"PV_Pitch":0,"PV_Orientation":null,"DH_Int":10,"Benchmark":"Project","Type":"Tower block 2 bed","Fuel":"Electricity E7","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":null,"Final_Benchmark":"","Final_Type":"","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":0},
// {"Cluster":"Health Centre","ID":"HR 2 bed flat - Merton","# of Properties":20,"Occupancy type":"Domestic-ERC","GIA":70.4,"#Stories":11,"PV_%Roof":null,"PV_Pitch":0,"PV_Orientation":null,"DH_Int":10,"Benchmark":"Project","Type":"Tower block post insulation","Fuel":"Electricity E7","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":null,"Final_Benchmark":"","Final_Type":"","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":0},
// {"Cluster":"North","ID":"HR 2 bed flat - Oriel","# of Properties":20,"Occupancy type":"Domestic-ERC","GIA":70.4,"#Stories":11,"PV_%Roof":null,"PV_Pitch":0,"PV_Orientation":null,"DH_Int":10,"Benchmark":"Project","Type":"Tower block post insulation","Fuel":"Electricity E7","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":null,"Final_Benchmark":"","Final_Type":"","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":0},
// {"Cluster":"Health Centre","ID":"LR 1 bed flat Bryant Wallframe","# of Properties":1,"Occupancy type":"Domestic-ERC","GIA":48,"#Stories":3,"PV_%Roof":0.335,"PV_Pitch":10,"PV_Orientation":0,"DH_Int":null,"Benchmark":"Project","Type":"Low rise flats","Fuel":"Gas","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":35000,"Final_Benchmark":"Project","Final_Type":"Low rise retrofit","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":2},
// {"Cluster":"Health Centre","ID":"LR 1 bed flat Bryant Wallframe","# of Properties":8,"Occupancy type":"Domestic-ERC","GIA":48,"#Stories":3,"PV_%Roof":0.335,"PV_Pitch":10,"PV_Orientation":0,"DH_Int":null,"Benchmark":"Project","Type":"Low rise flats","Fuel":"Gas","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":35000,"Final_Benchmark":"Project","Final_Type":"Low rise retrofit","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":2},
// {"Cluster":"Health Centre","ID":"LR 1 bed flat Morris & Jacob Timberframe","# of Properties":7,"Occupancy type":"Domestic-ERC","GIA":48,"#Stories":3,"PV_%Roof":0.335,"PV_Pitch":10,"PV_Orientation":0,"DH_Int":null,"Benchmark":"Project","Type":"Low rise flats","Fuel":"Gas","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":35000,"Final_Benchmark":"Project","Final_Type":"Low rise retrofit","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":2},
// {"Cluster":"Health Centre","ID":"LR 2 bed flat Bryant Wallframe","# of Properties":34,"Occupancy type":"Domestic-ERC","GIA":75,"#Stories":3,"PV_%Roof":0.335,"PV_Pitch":10,"PV_Orientation":0,"DH_Int":null,"Benchmark":"Project","Type":"Low rise flats","Fuel":"Gas","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":35000,"Final_Benchmark":"Project","Final_Type":"Low rise retrofit","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":2},
// {"Cluster":"Health Centre","ID":"LR 3 bed flat Bryant Wallframe","# of Properties":1,"Occupancy type":"Domestic-ERC","GIA":75,"#Stories":3,"PV_%Roof":0.335,"PV_Pitch":10,"PV_Orientation":0,"DH_Int":null,"Benchmark":"Project","Type":"Low rise flats","Fuel":"Gas","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":35000,"Final_Benchmark":"Project","Final_Type":"Low rise retrofit","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":2},
// {"Cluster":"Health Centre","ID":"LR 3 bed flat Bryant Wallframe","# of Properties":6,"Occupancy type":"Domestic-ERC","GIA":75,"#Stories":3,"PV_%Roof":0.335,"PV_Pitch":10,"PV_Orientation":0,"DH_Int":null,"Benchmark":"Project","Type":"Low rise flats","Fuel":"Gas","E_Billing":"Own","S_E_Capacity":null,"PV_X_Out":null,"PV_X_Peak":null,"£_Upgrade_unit":35000,"Final_Benchmark":"Project","Final_Type":"Low rise retrofit","Final_Fuel":"DH2","Final_E_Billing":"Group","Final_S_E_Capacity":2}
// ]