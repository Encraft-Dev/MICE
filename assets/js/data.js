





var monthly_Data ={
"DHW_Factors": {Jan:1.1, Feb:1.06, Mar:1.02, Apr:0.98, May:0.94, Jun:0.9, Jul:0.9, Aug:0.94, Sep:0.98, Oct:1.02, Nov:1.06, Dec:1.1},
"DHW_Temp_Rise": { Jan:41.2, Feb:41.4, Mar:40.1, Apr:37.6, May:36.4, Jun:33.9, Jul:30.4, Aug:33.4, Sep:33.5, Oct:36.3, Nov:39.4, Dec:39.7},
"Days_in_month": { Jan:31, Feb:28, Mar:31, Apr:30, May:31, Jun:30, Jul:31, Aug:31, Sep:30, Oct:31, Nov:30, Dec:31},
"DHW_perc": { Jan:10.17, Feb:9.85, Mar:9.18, Apr:8.27, May:7.68, Jun:6.85, Jul:6.14, Aug:7.04, Sep:7.37, Oct:8.31, Nov:9.37, Dec:9.80}
}

var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

var climate_Data=[
{"Region":0,"Name":"UK Average",Jan:"16.45","Feb":"15.57","Mar":"13.22","Apr":"9.69","May":"5.58","Jun":"1.32","Jul":"0.00","Aug":"0.00","Sep":"2.06","Oct":"7.20","Nov":"12.33","Dec":"16.59","Uplift":1.000},
{"Region":1,"Name":"Thames","Jan":"17.75","Feb":"16.89","Mar":"13.82","Apr":"9.56","May":"4.27","Jun":"0.00","Jul":"0.00","Aug":"0.00","Sep":"0.51","Oct":"6.66","Nov":"12.80","Dec":"17.75","Uplift":0.850},
{"Region":2,"Name":"South East England","Jan":"17.50","Feb":"16.83","Mar":"14.00","Apr":"10.00","May":"4.83","Jun":"0.17","Jul":"0.00","Aug":"0.00","Sep":"0.83","Oct":"6.33","Nov":"12.33","Dec":"17.17","Uplift":1.000},
{"Region":3,"Name":"Southern England","Jan":"17.32","Feb":"16.81","Mar":"14.07","Apr":"10.12","May":"4.97","Jun":"0.17","Jul":"0.00","Aug":"0.00","Sep":"0.86","Oct":"6.35","Nov":"12.18","Dec":"17.15","Uplift":0.950},
{"Region":4,"Name":"South West England","Jan":"16.35","Feb":"15.83","Mar":"13.91","Apr":"10.78","May":"6.26","Jun":"1.74","Jul":"0.00","Aug":"0.00","Sep":"1.57","Oct":"6.43","Nov":"11.30","Dec":"15.83","Uplift":0.820},
{"Region":5,"Name":"Severn Wales/Severn England","Jan":"16.80","Feb":"16.16","Mar":"13.47","Apr":"9.83","May":"5.23","Jun":"0.79","Jul":"0.00","Aug":"0.00","Sep":"1.74","Oct":"6.97","Nov":"12.20","Dec":"16.80","Uplift":0.880},
{"Region":6,"Name":"Midlands","Jan":"16.49","Feb":"15.76","Mar":"13.11","Apr":"9.57","May":"5.45","Jun":"1.03","Jul":"0.00","Aug":"0.00","Sep":"2.21","Oct":"7.36","Nov":"12.37","Dec":"16.64","Uplift":1.030},
{"Region":7,"Name":"West Pennines Wales/West Pennines England","Jan":"16.44","Feb":"15.68","Mar":"13.39","Apr":"9.74","May":"5.33","Jun":"1.22","Jul":"0.00","Aug":"0.00","Sep":"2.13","Oct":"7.31","Nov":"12.18","Dec":"16.59","Uplift":1.010},
{"Region":8,"Name":"Northwest England, Southwest Scotland","Jan":"14.89","Feb":"14.38","Mar":"12.71","Apr":"9.76","May":"6.16","Jun":"2.95","Jul":"0.77","Aug":"0.90","Sep":"3.47","Oct":"7.45","Nov":"11.42","Dec":"15.15","Uplift":1.130},
{"Region":9,"Name":"Borders Scotland/Borders England","Jan":"14.99","Feb":"14.34","Mar":"12.65","Apr":"9.91","May":"6.65","Jun":"2.87","Jul":"0.39","Aug":"0.52","Sep":"3.13","Oct":"7.56","Nov":"11.60","Dec":"15.38","Uplift":1.120},
{"Region":10,"Name":"North East England","Jan":"15.71","Feb":"14.89","Mar":"12.84","Apr":"9.84","May":"6.28","Jun":"2.32","Jul":"0.00","Aug":"0.00","Sep":"2.73","Oct":"7.38","Nov":"12.02","Dec":"15.98","Uplift":1.110},
{"Region":11,"Name":"East Pennines","Jan":"16.45","Feb":"15.57","Mar":"13.22","Apr":"9.69","May":"5.58","Jun":"1.32","Jul":"0.00","Aug":"0.00","Sep":"2.06","Oct":"7.20","Nov":"12.33","Dec":"16.59","Uplift":1.020},
{"Region":12,"Name":"East Anglia","Jan":"17.45","Feb":"16.64","Mar":"13.73","Apr":"9.69","May":"4.85","Jun":"0.16","Jul":"0.00","Aug":"0.00","Sep":"0.81","Oct":"6.62","Nov":"12.60","Dec":"17.45","Uplift":1.040},
{"Region":13,"Name":"Wales","Jan":"15.44","Feb":"15.00","Mar":"13.24","Apr":"10.29","May":"6.32","Jun":"2.65","Jul":"0.29","Aug":"0.29","Sep":"2.94","Oct":"7.06","Nov":"11.32","Dec":"15.15","Uplift":0.970},
{"Region":14,"Name":"West Scotland","Jan":"14.43","Feb":"13.93","Mar":"12.42","Apr":"9.54","May":"6.40","Jun":"3.14","Jul":"1.25","Aug":"1.38","Sep":"3.76","Oct":"7.78","Nov":"11.29","Dec":"14.68","Uplift":1.120},
{"Region":15,"Name":"East Scotland","Jan":"14.48","Feb":"13.99","Mar":"12.29","Apr":"9.49","May":"6.57","Jun":"3.16","Jul":"1.09","Aug":"1.22","Sep":"3.65","Oct":"7.66","Nov":"11.44","Dec":"14.96","Uplift":1.120},
{"Region":16,"Name":"North East Scotland","Jan":"13.83","Feb":"13.49","Mar":"11.90","Apr":"9.52","May":"7.03","Jun":"3.74","Jul":"1.70","Aug":"1.81","Sep":"3.97","Oct":"7.60","Nov":"11.11","Dec":"14.29","Uplift":1.120},
{"Region":17,"Name":"Highland","Jan":"13.12","Feb":"13.02","Mar":"11.75","Apr":"9.42","May":"6.98","Jun":"4.34","Jul":"2.43","Aug":"2.54","Sep":"4.44","Oct":"7.72","Nov":"10.69","Dec":"13.54","Uplift":1.120},
{"Region":18,"Name":"Western Isles","Jan":"12.92","Feb":"13.17","Mar":"12.17","Apr":"9.91","May":"7.28","Jun":"4.64","Jul":"2.63","Aug":"2.38","Sep":"4.27","Oct":"7.40","Nov":"10.29","Dec":"12.92","Uplift":1.120},
{"Region":19,"Name":"Orkney","Jan":"12.71","Feb":"12.94","Mar":"12.03","Apr":"9.74","May":"7.56","Jun":"4.93","Jul":"2.75","Aug":"2.63","Sep":"4.35","Oct":"7.33","Nov":"10.19","Dec":"12.83","Uplift":1.120},
{"Region":20,"Name":"Shetland","Jan":"12.00","Feb":"12.56","Mar":"11.89","Apr":"9.91","May":"7.93","Jun":"5.51","Jul":"3.41","Aug":"2.97","Sep":"4.52","Oct":"7.38","Nov":"9.91","Dec":"12.00","Uplift":1.120},
{"Region":21,"Name":"Northern","Jan":"14.88","Feb":"14.33","Mar":"12.66","Apr":"9.87","May":"6.40","Jun":"2.78","Jul":"0.70","Aug":"0.83","Sep":"3.34","Oct":"7.65","Nov":"11.54","Dec":"15.02","Uplift":1.070}
]





var benchmark_Data=[
  { "Benchmark_Type":"Project",
    "Benchmark_ID":"Tower block 1 bed",
    "FEE":108.8,
    "Elec":"SAP2012",
    "Fuel_Price":"",
    "DHW":"SAP2012",
    "Loc_Uplift":"FALSE"
  },
  {
    "Benchmark_Type":"Project",
    "Benchmark_ID":"Tower block 2 bed",
    "FEE":79.4,
    "Elec":"SAP2012",
    "Fuel_Price":"",
    "DHW":"SAP2012",
    "Loc_Uplift":"FALSE"
  },
  {
    "Benchmark_Type":"Project",
    "Benchmark_ID":"FEE70",
    "FEE":70,
    "Elec":"SAP2012",
    "Fuel_Price":"",
    "DHW":"SAP2012",
    "Loc_Uplift":"FALSE"
  },
  {
    "Benchmark_Type":"Project",
    "Benchmark_ID":"Bungalow Semi",
    "FEE":170,
    "Elec":"SAP2012",
    "Fuel_Price":"",
    "DHW":"SAP2012",
    "Loc_Uplift":"FALSE"
  },
  {
    "Benchmark_Type":"Project",
    "Benchmark_ID":"Low rise flats",
    "FEE":160,
    "Elec":"SAP2012",
    "Fuel_Price":"",
    "DHW":"SAP2012",
    "Loc_Uplift":"FALSE"
  },
  {
    "Benchmark_Type":"Project",
    "Benchmark_ID":"Low rise retrofit",
    "FEE":46,
    "Elec":"SAP2012",
    "Fuel_Price":"",
    "DHW":"SAP2012",
    "Loc_Uplift":"FALSE"
  },
  {
    "Benchmark_Type":"Project",
    "Benchmark_ID":"Semi-detached",
    "FEE":135,
    "Elec":"SAP2012",
    "Fuel_Price":"",
    "DHW":"SAP2012",
    "Loc_Uplift":"FALSE"
  },
  {
    "Benchmark_Type":"Project",
    "Benchmark_ID":"House cavity wall insulation",
    "FEE":100,
    "Elec":"SAP2012",
    "Fuel_Price":"",
    "DHW":"SAP2012",
    "Loc_Uplift":"FALSE"
  },
  {
    "Benchmark_Type":"Project",
    "Benchmark_ID":"Health Centre",
    "FEE":196,
    "Elec":"70",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"FALSE"
  },
  {
    "Benchmark_Type":"Project",
    "Benchmark_ID":"Tower block post insulation",
    "FEE":48,
    "Elec":"SAP2012",
    "Fuel_Price":"",
    "DHW":"SAP2012",
    "Loc_Uplift":"FALSE"
  },
  {
    "Benchmark_Type":"Project",
    "Benchmark_ID":"Bungalow cavity wall",
    "FEE":125,
    "Elec":"SAP2012",
    "Fuel_Price":"",
    "DHW":"SAP2012",
    "Loc_Uplift":"FALSE"
  },
  {
    "Benchmark_Type":"BREEAM Estimate (80 TM46)",
    "Benchmark_ID":"Swimming Pool Centre",
    "FEE":904,
    "Elec":"196",
    "Fuel_Price":"small",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"BREEAM Estimate (80 TM46)",
    "Benchmark_ID":"Dry Sports",
    "FEE":264,
    "Elec":"76",
    "Fuel_Price":"medium",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"BREEAM Estimate (80 TM46)",
    "Benchmark_ID":"General Retail",
    "FEE":120,
    "Elec":"132",
    "Fuel_Price":"small",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"BREEAM Estimate (80 TM46)",
    "Benchmark_ID":"Large Food Store",
    "FEE":84,
    "Elec":"320",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"BREEAM Estimate (80 TM46)",
    "Benchmark_ID":"School",
    "FEE":120,
    "Elec":"32",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"BREEAM Estimate (80 TM46)",
    "Benchmark_ID":"General Office",
    "FEE":96,
    "Elec":"76",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"BREEAM Estimate (80 TM46)",
    "Benchmark_ID":"Large non-food shop",
    "FEE":136,
    "Elec":"56",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"BREEAM Estimate (80 TM46)",
    "Benchmark_ID":"Restaurant",
    "FEE":296,
    "Elec":"72",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"BREEAM Estimate (80 TM46)",
    "Benchmark_ID":"Bar/pub",
    "FEE":280,
    "Elec":"104",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"BREEAM Estimate (80 TM46)",
    "Benchmark_ID":"Hotel",
    "FEE":264,
    "Elec":"84",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"BREEAM Estimate (80 TM46)",
    "Benchmark_ID":"Hospital",
    "FEE":336,
    "Elec":"72",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"BREEAM Estimate (80 TM46)",
    "Benchmark_ID":"Long term residential",
    "FEE":336,
    "Elec":"52",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"Domestic",
    "Benchmark_ID":"Code 5-Mid Terrace/Apartment",
    "FEE":39,
    "Elec":"SAP2012",
    "Fuel_Price":"",
    "DHW":"SAP2012",
    "Loc_Uplift":"FALSE"
  },
  {
    "Benchmark_Type":"Domestic",
    "Benchmark_ID":"Code 5-Semi/detached",
    "FEE":46,
    "Elec":"SAP2012",
    "Fuel_Price":"",
    "DHW":"SAP2012",
    "Loc_Uplift":"FALSE"
  },
  {
    "Benchmark_Type":"Domestic",
    "Benchmark_ID":"PassivHaus",
    "FEE":10,
    "Elec":"SAP2012",
    "Fuel_Price":"",
    "DHW":"SAP2012",
    "Loc_Uplift":"FALSE"
  },
  {
    "Benchmark_Type":"Domestic",
    "Benchmark_ID":"Pt L- Mid Terrance/Apartment",
    "FEE":43,
    "Elec":"SAP2012",
    "Fuel_Price":"",
    "DHW":"SAP2012",
    "Loc_Uplift":"FALSE"
  },
  {
    "Benchmark_Type":"Domestic",
    "Benchmark_ID":"Pt L-Semi/Detached",
    "FEE":52,
    "Elec":"SAP2012",
    "Fuel_Price":"",
    "DHW":"SAP2012",
    "Loc_Uplift":"FALSE"
  },
  {
    "Benchmark_Type":"CIBSE TM46",
    "Benchmark_ID":"Swimming Pool Centre",
    "FEE":1130,
    "Elec":"245",
    "Fuel_Price":"",
    "DHW":"0.2",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"CIBSE TM46",
    "Benchmark_ID":"Dry Sports",
    "FEE":330,
    "Elec":"95",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"CIBSE TM46",
    "Benchmark_ID":"General Retail",
    "FEE":150,
    "Elec":"165",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"CIBSE TM46",
    "Benchmark_ID":"Large Food Store",
    "FEE":105,
    "Elec":"400",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"CIBSE TM46",
    "Benchmark_ID":"School",
    "FEE":150,
    "Elec":"40",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"CIBSE TM46",
    "Benchmark_ID":"General Office",
    "FEE":120,
    "Elec":"95",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"CIBSE TM46",
    "Benchmark_ID":"Large non-food shop",
    "FEE":170,
    "Elec":"70",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"CIBSE TM46",
    "Benchmark_ID":"Restaurant",
    "FEE":370,
    "Elec":"90",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"CIBSE TM46",
    "Benchmark_ID":"Bar/pub",
    "FEE":350,
    "Elec":"130",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"CIBSE TM46",
    "Benchmark_ID":"Hotel",
    "FEE":330,
    "Elec":"105",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"CIBSE TM46",
    "Benchmark_ID":"Hospital",
    "FEE":420,
    "Elec":"90",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"CIBSE TM46",
    "Benchmark_ID":"Long term residential",
    "FEE":420,
    "Elec":"65",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  },
  {
    "Benchmark_Type":"CIBSE TM46",
    "Benchmark_ID":"Laundry",
    "FEE":100,
    "Elec":"1",
    "Fuel_Price":"",
    "DHW":"0.1",
    "Loc_Uplift":"TRUE"
  }
]

//API json models to avoid multiple AJAX requests, will probably pull these in ASYNC eventually when i have web workers etc.
var API_SAP2012={data:{boiler_efficiency:{customer:{condensing_boiler:{less_10_years:{gas_lpg:"0.83",oil:"0.83",electricity:"1"},more_10_years:{gas_lpg:"0.83",oil:"0.83",electricity:"1"}},not_condensing_boiler:{less_10_years:{gas_lpg:"0.73",oil:"0.79",electricity:"1"},more_10_years:{gas_lpg:"0.65",oil:"0.7",electricity:"1"}}},installer:{regular_boiler:{gas_condensing_post_1998:{name:"Condensing with automatic ignition, post 1998",fuel:"gas",efficiency:"0.768"},gas_non_condensing_post_1998:{name:"Non-condensing with automatic ignition, post 1998",efficiency:"0.668"},gas_pre_1998:{name:"Fan flue, pre 1998",fuel:"gas",efficiency:"0.618"},gas_1979_1997:{name:"Open or balanced flue, floor mounted, 1979 - 1997",fuel:"gas",efficiency:"0.588"},gas_pre_1979:{name:"Open or balanced flue, floor mounted, pre 1979",fuel:"gas",efficiency:"0.488"},oil_condensing:{name:"Condensing ",fuel:"oil",efficiency:"0.754"},oil_post_1998:{name:"Standard, post 1998 ",fuel:"oil",efficiency:"0.714"},oil_1985_1997:{name:"Standard, 1985 - 1997",fuel:"oil",efficiency:"0.624"},oil_pre_1985:{name:"Standard, pre 1985",fuel:"oil",efficiency:"0.574"}},combi_boiler:{gas_condensing_post_1998:{name:"Condensing with automatic ignition, post 1998",fuel:"gas",efficiency:"0.775"},gas_non_condensing_post_1998:{name:"Non-condensing with automatic ignition, post 1998",fuel:"gas",efficiency:"0.675"},gas_pre_1998:{name:"Fan flue, pre 1998",fuel:"gas",efficiency:"0.645"},oil_pre_1998:{name:"Pre 1998 ",fuel:"oil",efficiency:"0.645"},oil_post_1998:{name:"Post 1998 ",fuel:"oil",efficiency:"0.705"}},other_heaters:{wood:{name:"Wood chip/pellet independent boiler",fuel:"wood",efficiency:"0.63"},boiler_to_radiators:{name:"Closed room heater with boiler to radiators",fuel:"",efficiency:"0.65"},manual_boiler:{name:"Manual feed independent boiler",fuel:"",efficiency:"0.55"},immersion_heater:{name:"Immersion heater within DHW tank back up heating zone",fuel:"electricity",efficiency:"1"},electric_boiler:{name:"Electric boiler separate from DHW tank ",fuel:"electricity",efficiency:"0.85"},GSHP:{name:"Ground to water heat pump ",fuel:"electricity",efficiency:"1.5"},ASHP:{name:"Air to water heat pump",fuel:"electricity",efficiency:"1.43"}}}}},location:{postcode:{definition:"",message:"",value:""},irradiance_region:{definition:"Calculated by API",message:"",value:0},zone_number:{definition:"Calculated by API",message:"",value:0}},occupancy:{definition:"",message:"Calculated by API but occupants array should be completed.",value:0,occupants:{definition:"Value should be an array of days per year per person. Eg [365,365,200,250] for 4 people, two full time, two part time.",message:"",value:[]},floor_space:{definition:"",message:"In m2",value:0},daily_hot_water_demand:{definition:"",message:"Calculated by API",value:0}},collectors:[{id:{definition:"",message:"",value:0},manufacturer:{definition:"",message:"",value:""},model:{definition:"",message:"",value:""},pitch:{definition:"",message:"",value:30},orientation:{definition:"",message:"",value:0,rounded_value:0},shade:{definition:"",message:"",value:1,options:{1:"None or very little",.8:"Modest 20% -60%",.65:"Significant 61% - 80%",.5:"Heavy"}},collector_count:{definition:"",message:"",value:0},aperture_area:{definition:"",message:"",value:0},total_area:{definition:"",message:"Calculated by API",value:0},zero_loss_efficiency:{definition:"",message:"",value:0},liner_heat_loss_coefficient_a1:{definition:"",message:"",value:0},liner_heat_loss_a2:{definition:"",message:"",value:0},performance_ratio:{definition:"",message:"Calculated by API",value:0},performance_factor:{definition:"",message:"Calculated by API",value:0},irradiance:{definition:"",message:"Calculated by API",value:0,a:0,b:0,c:0,monthly:[]},solar_energy:{definition:"",message:"Calculated by API",value:0}}],cylinder:{storage_type:{definition:"",message:"Expects a 0 or a 1",value:"",options:{0:"Combined",1:"Seperate"}},total_volume:{definition:"",message:"",value:0},dedicated_solar_volume:{definition:"",message:"",value:0},hot_water_use_adjustment_factor:{definition:"",message:"",value:0,options:{1:"Both electric and non-electric showers",1.29:"Non-electric showers only",.64:"Electric showers only",1.09:"No showers, bath only"}},water_efficient_adjustment_factor:{definition:"",message:"",value:1,options:{Yes:.95,No:1}},effective_solar_volume:{definition:"",message:"Calculated by API",value:0},energy_content_hot_water_usage:{definition:"",message:"Calculated by API",value:0},annual_heat_loss:{definition:"",message:"Calculated by API",value:0},modified_solar_load_ratio:{definition:"",message:"Calculated by API",value:0},utilisation_factor:{definition:"",message:"Calculated by API",value:0},dedicated_solar_storage:{definition:"",message:"Not used by API",value:0},volume_ratio:{definition:"",message:"Calculated by API",value:0},solar_storage_volume_factor:{definition:"",message:"Calculated by API",value:0},annual_solar_input_qs:{definition:"",message:"Calculated by API",value:0}},boiler:{solar_efficiency:{definition:"",message:"",value:0}},total_collector_area:{definition:"",message:"Calculated by API",value:0},irradiance:{definition:"",message:"Calculated by API",value:0},solar_energy:{definition:"",message:"Calculated by API",value:0},finance:{estimated_annual_savings:{definition:"",message:"Calculated by API",value:0}}};
var API_MCS24 = {location:{postcode:{definition:"",message:"",value:""},irradiance_region:{definition:"",message:"",value:0},zone_number:{definition:"",message:"",value:0}},panels:[{id:{definition:"",message:"",value:""},manufacturer:{definition:"",message:"",value:""},model:{definition:"",message:"",value:""},panel_count:{definition:"",message:"",value:0},electrical_rating:{definition:"",message:"",value:0},installed_capacity:{definition:"",message:"",value:0},area_required:{definition:"",message:"",value:0},area_available:{definition:"",message:"",value:0},pitch:{definition:"",message:"",value:30},orientation:{definition:"System uses azimuth, not value. Use value to store the acutal orientation but complete azimuth for calculations.",message:"",value:0,rounded_value:0,azimuth:0},annual_electrical_output:{definition:"",message:"",value:0},irradiance:{definition:"",message:"",value:0},shade:{number_of_segments:{definition:"",message:"",value:0},horizon:{definition:"",message:"",value:[]},factor:{definition:"",message:"",value:0}}}],annual_electrical_output:{definition:"",message:"",value:0},installed_capacity:{definition:"",message:"",value:0},irradiance:{definition:"",message:"",value:0},system:{lifespan:{definition:"",message:"",value:25}}};


//profiles
