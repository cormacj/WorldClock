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

const testUtc = document.getElementById("testUtc");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  
  //console.log(dutc);
  let ampm = 'AM';
  let worldampm = 'AM';
  let today = evt.date;
  let hours = today.getHours();
  let worldhours = (today.getHours()+8) % 24;
  console.log(`today is ${today}`);
  //make today a string, so we can parse it
  var transition = today.toString();
  var date = transition.split(" ");
  var utcOffset = date[5];
  //by now dutctime is something like "GMT-8:00" so we need to:
  //strip off the ":00"
  //strip off the "GMT"
  
  //lets reuse transition
  transition = utcOffset.split("");
  utcOffset = transition[3]+transition[4]+transition[5];
  //this gives us "-08"
  //TODO
  //yes I know there are 30 minute zones too, thats for later. 
  //right now I want to get this working

  /*
  the today variable is using RFC 2822 format so:
               The zone specifies the offset from Coordinated Universal Time (UTC,
               formerly referred to as "Greenwich Mean Time") that the date and
               time-of-day represent.  The "+" or "-" indicates whether the
               time-of-day is ahead of (i.e., east of) or behind (i.e., west of)
               Universal Time.  The first two digits indicate the number of hours
               difference from Universal Time, and the last two digits indicate the
               number of minutes difference from Universal Time.  (Hence, +hhmm
               means +(hh * 60 + mm) minutes, and -hhmm means -(hh * 60 + mm)
               minutes).  The form "+0000" SHOULD be used to indicate a time zone at
               Universal Time.  Though "-0000" also indicates Universal Time, it is
               used to indicate that the time was generated on a system that may be
               in a local time zone other than Universal Time and therefore
               indicates that the date-time contains no information about the local
               time zone.
   
   The oddness here is that this format means that CET is showing as +0100
   
   So: 
     UTC=2300
     CET=0000
     PST=1500

  RFC time is shown as:
  UTC:  UTC+0000 (or UTC-0000)
  CET:  UTC+0100
  PST:  UTC-0800
   
  So we can get away by subtracting this offset from localtime. 
   */
  
  
  
  transition = parseInt(utcOffset);
  utcOffset = transition;
  //console.log(`battery level: ${batteryLevel}%`);
  console.log(`utcOffset is: ${utcOffset}`);
  let utchours = hours - utcOffset;
  console.log(`current hour is: ${hours} and utc adjusted hours is: ${utchours}`);
  
  //do some modulus math here to allow for localtime being PM, and worldtime being AM
  if (worldhours < 0) {
    //clock math is hard here, if a time adjustment goes minus, then we add the minus to 24 to roll it back to the correct hour
    // eg 04 am - 8 hours gives us a -4 hour
    // so 24+(-4) which is 20:00 or 8am
    worldhours = 24+worldhours;
  }
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
  
  testUtc.text = `${utchours}:${mins}`;
 if (preferences.clockDisplay === "12h") { 
  homeTime.text = `${hours}:${mins} ${ampm}`;
  worldTime.text = `${worldhours}:${mins} ${worldampm}`;
 } else {
  homeTime.text = `${hours}:${mins}`;
  worldTime.text = `${worldhours}:${mins}`;
 }
}
