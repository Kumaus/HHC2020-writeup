// Sleigh operator controls
var accelSlider = document.getElementById("accel");
var accelOutput = document.getElementById("accelVal");
accelOutput.innerHTML = accelSlider.value;
accelSlider.oninput = function() {
  accelOutput.innerHTML = this.value;
}
var steerSlider = document.getElementById("steer");
var steerOutput = document.getElementById("steerVal");
steerOutput.innerHTML = steerSlider.value;
steerSlider.oninput = function() {
  steerOutput.innerHTML = this.value;
}
var brakeSlider = document.getElementById("brake");
var brakeOutput = document.getElementById("brakeVal");
brakeOutput.innerHTML = brakeSlider.value;
brakeSlider.oninput = function() {
  brakeOutput.innerHTML = this.value;
}
var lastNeedleUpdate = 0

const reader = new FileReader();
reader.addEventListener('loadend', (e) => {
  const text = e.srcElement.result;
  console.log(text);
});

// WS connector to CAN-D-bus
if (location.protocol == 'https:'){
  var ws = new WebSocket('wss://' + document.domain + ':' + location.port + '/ws');
}
else {
  var ws = new WebSocket('ws://' + document.domain + ':' + location.port + '/ws');
}

var speedometer_needle = document.getElementById("speedometer_needle")
var rpmdivalt = document.getElementById("rpm")

// connects tachometer to CAN-D bus output
function moveTachNeedle(rpm) {
  rpm = parseInt(rpm, 16);
  var perc = rpm / 9000
  var degrees = Math.min(135, 270 * perc - 135)
  let now = (new Date().getTime())
  rpmdivalt.textContent = rpm
  if (lastNeedleUpdate + 1000 < now) {  // the transition-duration for this is 1 second. So we want it to finish
    lastNeedleUpdate = now
    speedometer_needle.style.transform = "rotate("+degrees+"deg)"
  }
}

// handle CAN-D-bus messages over WS
ws.onmessage = function (event) {
  var messageIn = JSON.parse(event.data);
  if (messageIn.Type == "CAN-D-bus"){ // CAN-D-bus messages go to the textarea

    // document.getElementById("can-feed").textContent = "Epoch Time    ID  MESSAGE\n" + lines.join('\n');
    lines = document.getElementById("can-feed").textContent.split("\n");
    lines.shift();
    if (document.getElementById("can-feed").textContent.split("\n").length > 20) {
      lines.shift();
    }
    lines.push(Date.now() + ' ' + messageIn.Message);
    document.getElementById("can-feed").textContent = "Epoch Time    ID  MESSAGE\n" + lines.join('\n');

    if (messageIn.Message.slice(0, 3) == "244") { // update tachometer if this is a tach message
      moveTachNeedle(messageIn.Message.slice(4, 14));
    }
  }
  if (messageIn.Type == "Message") { // handles messages for operator
    wigwags(messageIn.Message);
    if (messageIn.Message.slice(0,7) == "NetWars") {
      document.getElementById("EnemyLookout").style.backgroundColor = "rgb(244, 0, 48)";
    }
  }
  if (messageIn.Type == "System") { // handles system messages
    console.log("Received system message: " + messageIn.Status);
  }
  if (messageIn.Type == "Redirect") { // handles system messages
    console.log("Received redirect: " + messageIn.Data);
    document.location=(messageIn.Location);
  }
  if (messageIn.Type == "FilterAdd") { // process approved filter from CAN-D-bus

    /*var table = document.getElementById("filters");
    var startingLength = table.rows.length;
    var row = table.insertRow(startingLength);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = messageIn.Filter[0];
    cell2.innerHTML = messageIn.Filter[1];
    cell3.innerHTML = messageIn.Filter[2];
    cell4.innerHTML = "<img src='/static/minus.png' alt='Click to remove this filter' onclick='removeFilter(this.parentElement.parentElement.rowIndex)'>";*/
    $("#filterbody").append('<div class="filterbottomrow"><span>'+messageIn.Filter[0].replace(/[^\w\d\s]/,'')+'</span><span>'+messageIn.Filter[1].replace(/[^\w\d\s]/,'')+'</span><span>'+messageIn.Filter[2].replace(/[^\w\d\s]/,'')+'</span><span>'+"<img class='removeimage' src='/static/minus.png' alt='Click to remove this filter' onclick='removeFilter(this.parentElement.parentElement)'>"+'</span></div>')
    
    // and clear out the filter adder
    document.getElementById("id").value = "";
    document.getElementById("type").value = "Equals";
    changeType("Equals");
    document.getElementById("criterion1").value = "00";
    document.getElementById("criterion2").value = "00";
    document.getElementById("criterion3").value = "00";
    document.getElementById("criterion4").value = "00";
    document.getElementById("criterion5").value = "00";
    document.getElementById("criterion6").value = "00";
  }
  if (messageIn.Type == "Victory") {
    console.log("About to post victory with token "+messageIn.Token+" which is a "+(typeof messageIn.Token));
    __POST_RESULTS__(JSON.parse(messageIn.Token));
  }
}

function changeType(type) { // operator may or may not need criterion
  console.log("changeType() with type "+type);
  if (type == "All") {
    document.getElementById("criterion1").style.visibility = "hidden";
    document.getElementById("criterion2").style.visibility = "hidden";
    document.getElementById("criterion3").style.visibility = "hidden";
    document.getElementById("criterion4").style.visibility = "hidden";
    document.getElementById("criterion5").style.visibility = "hidden";
    document.getElementById("criterion6").style.visibility = "hidden";
  } else {
    document.getElementById("criterion1").style.visibility = "visible";
    document.getElementById("criterion2").style.visibility = "visible";
    document.getElementById("criterion3").style.visibility = "visible";
    document.getElementById("criterion4").style.visibility = "visible";
    document.getElementById("criterion5").style.visibility = "visible";
    document.getElementById("criterion6").style.visibility = "visible";
  }
  if (type == "Contains") {
    document.getElementById("criterion1").value = "";
    document.getElementById("criterion2").value = "";
    document.getElementById("criterion3").value = "";
    document.getElementById("criterion4").value = "";
    document.getElementById("criterion5").value = "";
    document.getElementById("criterion6").value = "";
  } else {
    document.getElementById("criterion1").value = "00";
    document.getElementById("criterion2").value = "00";
    document.getElementById("criterion3").value = "00";
    document.getElementById("criterion4").value = "00";
    document.getElementById("criterion5").value = "00";
    document.getElementById("criterion6").value = "00";
  }
}

function changeControls(button) { // send updated control status to server
  lastNeedleUpdate = 0
  var accel = document.getElementById('accel').value;
  var brake = document.getElementById('brake').value;
  var steer = document.getElementById('steer').value;
  var start = 0;
  var stop = 0;
  var lock = 0;
  var unlock = 0;
  if (button == "Start"){start = 1;}
  if (button == "Stop" ){stop  = 1;}
  if (button == "Lock" ){lock  = 1;}
  if (button == "Unlock" ){unlock  = 1;}
  console.log("Controls changed; accel " + accel + ", brake " + brake + ", steer " + steer + ", start " + start + ", stop " + stop + ", lock " + lock + ", unlock " + unlock); // log controls to console
  ws.send('{"Type":"Controls","ABSSS":[' + accel + ', ' + brake + ', ' + steer + ', ' + start + ', ' + stop + ', ' + lock + ', ' + unlock + ' ]}'); // WS message across CAN-D-bus
  return;
}

ws.onopen = function (event) {
  console.log("Connected!");
  wigwags("Connected!");
  ws.send('{"Type":"System","Status":"Connecting"}'); // WS to CAN-D-bus to get messages flowing
}

ws.onclose = function (event) { // alert if websocket drops
  wigwags("Disconnected!");
  if (document.getElementById("can-feed").textContent.split("\n").length < 2) {
    alert("We're terribly sorry, but your browser didn't pass session information from the HTTPS session to the websocket. Please try in another mode or browser.");
  }
}

// on-screen feedback to operator
function wigwags(message) {
  if (message.slice(0,6)=="Filter" || message.slice(0,7)=="Connect") {
    var x = document.getElementById("wigwag");
    var timeOut = 3000;
  } else {
    var x = document.getElementById("bigwag");
    var timeOut = 10000;
  }
  x.className = "show";
  x.textContent = message;
  console.log(message)
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, timeOut);
}

// ask for filters for CAN-D-bus data
function addFilter() {
  var ID = document.getElementById("id").value;
  var type = document.getElementById("type").value;
  if (type != "Contains") { // "Contains" is more of a string match
    if (document.getElementById("criterion1").value == "") {document.getElementById("criterion1").value = "00";}
    if (document.getElementById("criterion2").value == "") {document.getElementById("criterion2").value = "00";}
    if (document.getElementById("criterion3").value == "") {document.getElementById("criterion3").value = "00";}
    if (document.getElementById("criterion4").value == "") {document.getElementById("criterion4").value = "00";}
    if (document.getElementById("criterion5").value == "") {document.getElementById("criterion5").value = "00";}
    if (document.getElementById("criterion6").value == "") {document.getElementById("criterion6").value = "00";}
  }
  var criterion = document.getElementById("criterion1").value + document.getElementById("criterion2").value + document.getElementById("criterion3").value +
    document.getElementById("criterion4").value + document.getElementById("criterion5").value + document.getElementById("criterion6").value;
  if (type == "All") {criterion = "";} // no criterion for "All"
  // send CAN-D-bus message to add the filter
  ws.send('{"Type":"FilterAdd","Filter":["'+ID+'","'+type+'","'+criterion+'"]}');
}

// remove filters for CAN-D-bus data
function removeFilter(rowelem) {
  let elem = $(rowelem)
  let children = elem.children();
  // put deleted row's data into fields in case operator is just editing
  var ID = $(children[0]).html();
  var type = $(children[1]).html();
  var criterion = $(children[2]).html();
  elem.remove();
  console.log('{"Type":"FilterDel","Filter":["'+ID+'","'+type+'","'+criterion+'"]}')
  document.getElementById("id").value = ID;
  document.getElementById("type").value = type;
  document.getElementById("criterion1").value = criterion.slice(0,2);
  document.getElementById("criterion2").value = criterion.slice(2,4);
  document.getElementById("criterion3").value = criterion.slice(4,6);
  document.getElementById("criterion4").value = criterion.slice(6,8);
  document.getElementById("criterion5").value = criterion.slice(8,10);
  document.getElementById("criterion6").value = criterion.slice(10,12);
  changeType(type);
  // ID and delete row
  /*
  var table = document.getElementById("filters");
  table.deleteRow(row);*/
  // send CAN-D-bus message to delete the filter
  ws.send('{"Type":"FilterDel","Filter":["'+ID+'","'+type+'","'+criterion+'"]}');
}
