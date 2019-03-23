var i = 0;
var interval = 500; //ms

function timedCount() {
  i = i + 1;
  postMessage(i);
  setTimeout("timedCount()",interval);
}

timedCount();