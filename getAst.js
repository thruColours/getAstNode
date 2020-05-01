
const fetch = require('node-fetch');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

//for specific days
// const api_url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=2020-02-26&end_date=2020-02-26&api_key=oc2osS1PDgSZWDOphc4r10HtzpHVZacT59v3drpp';

//auto today
const api_url = 'https://api.nasa.gov/neo/rest/v1/feed/today?detail=true&api_key=oc2osS1PDgSZWDOphc4r10HtzpHVZacT59v3drpp';
//rate limit once per second

const port = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });
const parser = port.pipe(new Readline());

const alert = "error";

async function getAst() {
  const response = await fetch(api_url);
  const data = await response.json();
  const { element_count, near_earth_objects } = data;

  const currentDate = Object.keys(near_earth_objects)[0];
  const displayDate = Object.keys(near_earth_objects)[0];

  let totalHaz = 0;

  let astTimes = [];
  let hazTimes = [];

  let allId = [];
  let hazId = [];

  let hazString = hazId.toString();
  let hazTimeDisplay = [];
  let hazTimeBr = [];
  // let hazTimeDisHours = Date.hazTimeDisplay.getHours();

  // const fakeAst = [{
  //   unixTime: 1580921024000,
  //   is_potentially_hazardous_asteroid: true
  // }];

  //slice just time from each element in array????
  // hazTimeDisplay.forEach(item  =>
  //   item.slice( 5 , 10 ));
  //   hazTimeBr.push();
  // console.log(hazTimeBr);

  // console.log(near_earth_objects);
  console.log(element_count);

  //make sure to use '===' or atleast '==' you numpty!
  near_earth_objects[currentDate].forEach((item) => {

    astTimes.push(item.close_approach_data[0].epoch_date_close_approach);
    allId.push(item.id);


    if (item.is_potentially_hazardous_asteroid === true) {
    totalHaz++;
    hazId.push(item.id);
    hazTimes.push(item.close_approach_data[0].epoch_date_close_approach);
    hazTimeDisplay.push(item.close_approach_data[0].close_approach_date_full);
    // hazTimeDisplay.push(item.close_approach_data[0].close_approach_date_full.replace(",", "<br />"));
    // console.log(item.id);
    }
    console.log(item.is_potentially_hazardous_asteroid);
    }
    );

  //add(push) the combined string of hazardous asteroid IDs to the complete set of asteroid IDs
  // allId.push(hazString);

  console.log(astTimes);

  // allId.push("420");
  // console.log(allId);

  // hazId.push("420");
  // console.log(hazId);

  //turn milliseconds into seconds (coeff) and use this to round current time to nearest minute
  //so can check if time of hazardous asteroid falls within the current minute
  let coeff = 1000 * 60;
  let date = new Date();
  let rounded = new Date(Math.round(date.getTime()/ coeff) * coeff);

  // astTimes.push(rounded+6000); // in the future (+)
  astTimes.push(1583342100000); // in the future (+)
  hazTimes.push(1583342160000);

  // differenceMs = [hazTimes - rounded];
  // displayDistMins = differenceMs/60000;
  // console.log(displayDistMins);
  // console.log(differenceMs);
  //get the time now in Unix
  // console.log(date.getTime());

  //create array with time til close approach in minutes (do for both Haz and nonHaz)
  hazCalc = x => (x - rounded)/60000;
  hazDistance = hazTimes.map(hazCalc);
  // console.log(hazDistance);

  // //send approach time to arduino/LED strip
  // hazCalc2 = x => 30 - x;
  // hazSend = hazDistance.map(hazCalc2);
  // console.log(hazSend);

  // hazSend.forEach((item) => {
  //   port.write('')
  // });

  // port.write(10);

  // astTimes.includes(rounded.getTime())&&
  //convert id of hazardous to string, add to allId array and check the existence of string correlates with time
  if (hazTimes.includes(rounded.getTime())) {
    console.log("potentially hazardous animation");
    port.write('b');
  }
  else if (astTimes.includes(rounded.getTime())){
    console.log("normal animation");
    port.write('a');
  }
  else {
    console.log("no animation");
  };

  // //works, but better check needed
  // if (astTimes.includes(rounded.getTime())&&hazId.includes("420")) {
  //   console.log("animation");
  // }
  // else {
  //   console.log("no animation");
  // };

  // //fake try 1
  // if (astTimes.includes(rounded.getTime())&&fakeAst.is_potentially_hazardous_asteroid === true) {
  //   console.log("animation");
  // }
  // else {
  //   console.log("no animation");
  // };

  }

  getAst().catch(alert);

  setInterval(getAst, 60000);

