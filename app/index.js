import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const homeTime = document.getElementById("homeTime");

// Get a handle on the <text> element
const worldTime = document.getElementById("worldTime");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let ampm = 'AM';
  let worldampm = 'AM';
  let today = evt.date;
  let hours = today.getHours();
  let worldhours = (today.getHours()+8) % 24;
  //do some modulus math here to allow for localtime being PM, and worldtime being AM
  
   if (hours > 12) { 
     ampm = 'PM'; 
   }
   if (worldhours >12) {
     worldampm = "PM"; 
   }
 
  if (preferences.clockDisplay === "12h") {
    hours = hours % 12 || 12;
    worldhours = worldhours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
    worldhours = util.zeroPad(worldhours);
  }
  let mins = util.zeroPad(today.getMinutes());
  
 if (preferences.clockDisplay === "12h") { 
  homeTime.text = `${hours}:${mins} ${ampm}`;
  worldTime.text = `${worldhours}:${mins} ${worldampm}`;
 } else {
  homeTime.text = `${hours}:${mins}`;
  worldTime.text = `${worldhours}:${mins}`;
 }
}
