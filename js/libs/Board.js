'use strict'
//import * as d3 from "../vendors/d3.min.js";

function drawSpiral(context, canvas) {
  var radius = 0;
  var angle = 0;
  // var resolution = 50;
  // var rotations = 5;
  context.lineWidth = 1;
  context.strokeStyle = "#C0C0C0"; // blue-ish color
  context.beginPath();
  var squareLength = 1000;
  var x = (canvas.width / 2) - (squareLength / 2);
  var y = (canvas.height / 2) - (squareLength / 2);

  // context.moveTo(canvas.width / 2, canvas.height / 2);

  // draw square
  for (var n = 0; n < squareLength * 4; n++) {
    // top line
    if (parseInt(n / squareLength) == 0) {
      context.lineTo(x++, y);
    }
    // right line
    else if (parseInt(n / squareLength) == 1) {
      context.lineTo(x, y++);
    }
    // bottom line
    else if (parseInt(n / squareLength) == 2) {
      context.lineTo(x--, y);
    }
    // left line
    else {
      context.lineTo(x, y--);
    }

  }
  context.stroke();

  // draw x in the middle
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  context.lineWidth = 10;

  context.beginPath();
  context.moveTo(centerX + 10, centerY + 10);
  context.lineTo(centerX - 10, centerY - 10);
  context.stroke();

  context.beginPath();
  context.moveTo(centerX + 10, centerY - 10);
  context.lineTo(centerX - 10, centerY + 10);
  context.stroke();
};

function generateCSVForDownload(json) {
  var fields = Object.keys(json[0])
  var formatNums = function (key, value) { return typeof value == "number" ? parseFloat(parseFloat(value).toFixed(4)) : value }
  var csv = json.map(function (row) {
    return fields.map(function (fieldName) {
      return JSON.stringify(row[fieldName], formatNums)
    }).join(',')
  })
  csv.unshift(fields.join(',')) // add header column
  csv = csv.join('\r\n');
  let csvContent = "data:text/csv;charset=utf-8," + csv;
  return csvContent;
}

function generateMATLABForDownload(json) { // returns contents of the txt file expected by the backend
  var fields = Object.keys(json[0])
  var formatNums = function (key, value) { return typeof value == "number" ? parseFloat(parseFloat(value).toFixed(2)) : value }
  var header = getMATLABFileHeader();
  var txtfile = json.map(function (row) {
    return fields.map(function (fieldName) {
      return JSON.stringify(row[fieldName], formatNums)
    }).join('\t')
  })
  txtfile.unshift(fields.join('\t')) //adds the fields at the beginning of txtfile
  txtfile = txtfile.join('\n'); //turns txtfile into a string
  var footer = getMATLABFileFooter(json);
  txtfile = header + txtfile + footer;
  let txtfileContent = txtfile;
  return txtfileContent;
}

function getMATLABFileHeader() { // gives MATLAB file header/initial info as string
  const date = new Date();
  let year = date.getFullYear().toString();
  year = year.substring(2, year.length);
  let date_string = date.getMonth() + '/' + date.getDate() + '/' + year;
  let time_hours = date.getHours();
  let day_section = 'PM';
  if (time_hours > 12) {
    time_hours = time_hours - 12;
    let day_section = 'PM';
  }
  else {
    day_section = 'AM';
  }

  let mins_int = date.getMinutes();
  let mins_string = mins_int.toString();
  if (mins_int < 10) { //this needs to be tested at the beginning of an hour
    mins_string = '0' + mins_string;
  }
  let time_string = time_hours + ':' + mins_string + ' ' + day_section;

  return '.version\n' + 'Spiral Acquisition 0.1 CopyRight(c) 2002\n'
    + 'All rights reserved.\n\n' + '.subject\n' + 'Last name: InsertHere\n'
    + 'First name: InsertHere\n' + 'Age: InsertHere\n' + 'Gender: InsertHere\n'
    + 'Handedness: InsertHere\n' + 'Category: InsertHere\n' + 'Clinical: InsertHere\n'
    + '\n.test\n' + 'Date: ' + date_string + '\n' + 'Time: ' + time_string + '\n'
    + 'Hand: InsertHere\n' + '\n.data\n';
}

function getMATLABFileFooter(json) { // gives MATLAB file footer/ending info as string
  return '\n\n.extra\n' + 'xo= ' + json[0].x.toFixed(2) + '\nyo= ' + json[0].y.toFixed(2) + '\nfirst=1'
    + '\nlast=' + json[Object.keys(json).length - 1].n + '\n';
}

function plot(json) {
  document.getElementById("test").innerHTML = "Please work!!!";


}

function download(json) {
  document.getElementById("DOSindex").innerHTML = "";

  // scaling x and y values so that diameter is 10 cm
  //why is this commented out? do we not need to scale? does it happen elsewhere now?
  /*
  let xvals = json.map(a => a.x);
  let yvals = json.map(b => b.y);

  let sizeX = Math.max.apply(null, xvals) - Math.min.apply(null, xvals);
  let sizeY = Math.max.apply(null, yvals) - Math.min.apply(null, yvals);
  console.log("sizex: ", sizeX);
  console.log("sizey: ", sizeY);

  for (let i = 0; i < xvals.length; i++) {
    console.log("before: ", json[i]["x"]);
    json[i]["x"] = (json[i]["x"] / sizeX) * 100;
    json[i]["y"] = (json[i]["y"] / sizeY) * 100;
    console.log("after: ", json[i]["x"]);
  }
*/
  // making txt file
  //let txtfileContent = generateMATLABForDownload(json);
  //localStorage.setItem("txtContent", txtfileContent);

  //const data = { txt: txtfileContent };

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    body: JSON.stringify(json),
  }
  console.log(payload)

  //fetch('http://localhost:8080/run_spiral', payload)
  fetch('https://spiral-qihf6vxbsq-ue.a.run.app/run_spiral', payload)
    .then(response => {
      response.text().then(function (text) {
        if (text == '"error"') {
          document.getElementById("DOSindex").innerHTML = " ";
          document.getElementById("redraw").style.visibility = "visible";
          document.getElementById("spinning-wheel").innerHTML = " ";
        }
        else {
          document.getElementById("DOSindex").innerHTML = "Analysis result: " + text;
          localStorage.setItem("dos", text);
          console.log('response: ', text);
          document.getElementById("spinning-wheel").innerHTML = " ";
        }
      })
    })
    .then(data => {
      console.log('Success:', data);
      //window.location.replace("./graphs.html");
    })
    .catch((error) => {
      console.error('Error:', error);
    });

}

var counter = 0;
var spiralLength = [];
var Board = (function () {
  var boardObject = {
    resolution: 2,
    dom: null,
    ctx: null,
    domMem: null,
    ctxMem: null,
    bgColor: '#ffffff',
    pos: {
      x: 0,
      y: 0
    },
    dataArray: null,
    loadToMemory: function loadToMemory(event) {
      var imageObj = event.target;
      this.domMem.width = imageObj.width;
      this.domMem.height = imageObj.height;
      this.ctxMem.drawImage(imageObj, 0, 0);
      this.ctx.drawImage(imageObj, 0, 0);
    },
    init: function init(canvasId) {
      this.dom = document.getElementById(canvasId);
      this.ctx = this.dom.getContext('2d', { desynchronized: true });

      // Additional Configuration
      this.ctx.imageSmoothingEnabled = true;

      // Create buffer
      this.domMem = document.createElement('canvas');
      this.ctxMem = this.domMem.getContext('2d');
      this.ctxMem.fillStyle = this.bgColor;
      this.ctxMem.fillRect(0, 0, this.domMem.width, this.domMem.height);

      // Set up sizing
      fitToWindow.bind(this)();
      window.addEventListener('resize', fitToWindow.bind(this));

      // Load canvas from local storage
      if (localStorage.dataURL) {
        var img = new window.Image();
        img.addEventListener('load', this.loadToMemory.bind(this));
        img.setAttribute('src', localStorage.dataURL);
      }

      // Draw spiral template
      drawSpiral(this.ctx, this.dom);

    },
    getPointerPos: function getPointerPos(event) {
      return {
        x: (event.pageX - this.pos.x) * this.resolution,
        y: (event.pageY - this.pos.y) * this.resolution
      }
    },
    storeMemory: function storeMemory() {
      this.ctxMem.drawImage(this.dom, 0, 0);
      localStorage.setItem('dataURL', this.domMem.toDataURL());
    },

    clearBoard: function clearBoard() {
      localStorage.clear();
      this.ctx.fillStyle = this.bgColor;
      this.ctx.fillRect(0, 0, this.dom.width, this.dom.height);
      this.domMem.width = this.dom.width;
      this.domMem.height = this.dom.height;
      this.ctxMem.fillStyle = this.bgColor;
      this.ctxMem.fillRect(0, 0, this.dom.width, this.dom.height);
      //dataArray = [];
      dataArray.splice(0, dataArray.length);
      localStorage.removeItem('spiral');
      drawSpiral(this.ctx, this.dom);
    },

    clearMemory: function clearMemory() {
      if (miniSelection == 1) {
        this.dataArray = this.dataArray.slice(0, spiralLength[0] - 10);
        var N = Array.from({ length: this.dataArray.length }, (_, index) => index + 1);
        for (var i = 0; i < N.length; i++) {
          this.dataArray[i].n = N[i];
        }

      }
      else if (miniSelection == 2) {
        this.dataArray = this.dataArray.slice(spiralLength[0], spiralLength[1] - 10);
        var N = Array.from({ length: this.dataArray.length }, (_, index) => index + 1);
        for (var i = 0; i < N.length; i++) {
          this.dataArray[i].n = N[i];
        }

      }
      else if (miniSelection == 3) {
        this.dataArray = this.dataArray.slice(spiralLength[1], spiralLength[2] - 10);
        var N = Array.from({ length: this.dataArray.length }, (_, index) => index + 1);
        for (var i = 0; i < N.length; i++) {
          this.dataArray[i].n = N[i];
        }

      }
      //window.open("./graphs.html");
      window.location.replace("./graphs2.html");
      localStorage.clear();
      this.ctx.fillStyle = this.bgColor;
      this.ctx.fillRect(0, 0, this.dom.width, this.dom.height);
      this.domMem.width = this.dom.width;
      this.domMem.height = this.dom.height;
      this.ctxMem.fillStyle = this.bgColor;
      this.ctxMem.fillRect(0, 0, this.dom.width, this.dom.height);
      if (dataArray.length > 0) {
        //download(dataArray);
        localStorage.setItem('spiral', JSON.stringify(this.dataArray));
        dataArray = [];
      }
      drawSpiral(this.ctx, this.dom);
    },


    graphMiniature: function graphMiniature() {
      var png = ['#png1', '#png2', '#png3'];
      var miniSpiral = ['miniSpiral1', 'miniSpiral2', 'miniSpiral3'];
      var spiralData = ["spiral1", "spiral2", "spiral3"];

      spiralLength.push(this.dataArray.length);

      localStorage.clear();
      this.ctx.fillStyle = this.bgColor;
      this.ctx.fillRect(0, 0, this.dom.width, this.dom.height);
      this.domMem.width = this.dom.width;
      this.domMem.height = this.dom.height;
      this.ctxMem.fillStyle = this.bgColor;
      this.ctxMem.fillRect(0, 0, this.dom.width, this.dom.height);
      if (counter == 0) {
        spiralData[counter] = this.dataArray.slice(0, -10);

      }
      else {
        spiralData[counter] = this.dataArray.slice(spiralLength[counter - 1], -10);
        var number = counter + 1;
      }

      var x = spiralData[counter].map(a => a.x);
      var y = spiralData[counter].map(a => a.y);

      var d3 = Plotly.d3;
      var img_png = d3.select(png[counter]);

      var OriginalSpiral = {
        type: 'scatter',
        x: x,
        y: y
      }
      Plotly.newPlot(miniSpiral[counter], [OriginalSpiral], {
        width: 400,
        height: 400
      });

      Plotly.toImage(miniSpiral[counter], [OriginalSpiral], {
        width: 400,
        height: 400
      }).then(function (dataURL) {
        img_png.attr("src", dataURL);
      });

      localStorage.setItem('spiral', JSON.stringify(spiralData[counter]));
      drawSpiral(this.ctx, this.dom);
      counter++;
      return counter;
    },
  };

  var fitToWindow = function fitToWindow() {
    var marginX = 10;
    var marginY = 10;

    var heightCss = window.innerHeight - marginY;
    var heightCanvas = heightCss * this.resolution;
    var widthCss = window.innerWidth - marginX;
    var widthCanvas = widthCss * this.resolution;

    // If new size is larger than memory
    if (widthCanvas > this.domMem.width || heightCanvas > this.domMem.height) {
      // Create buffer
      var bufferCanvas = document.createElement('canvas');
      var bufferCtx = bufferCanvas.getContext('2d');

      bufferCanvas.width = this.domMem.width;
      bufferCanvas.height = this.domMem.height;

      // Clear buffer
      bufferCtx.fillStyle = this.bgColor;
      bufferCtx.fillRect(0, 0, widthCanvas, heightCanvas);

      // Save canvas to buffer
      bufferCtx.drawImage(this.dom, 0, 0);

      // Resize memory
      if (this.domMem.width < widthCanvas) this.domMem.width = widthCanvas;
      if (this.domMem.height < heightCanvas) this.domMem.height = heightCanvas;
      this.ctxMem.drawImage(bufferCanvas, 0, 0);
    } else {
      this.ctxMem.drawImage(this.dom, 0, 0);
    }

    // resize current canvas
    this.dom.style.height = heightCss + 'px';
    this.dom.style.width = widthCss + 'px';
    this.dom.width = widthCanvas;
    this.dom.height = heightCanvas;
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fillRect(0, 0, this.dom.width, this.dom.height);
    this.ctx.drawImage(this.domMem, 0, 0);

    this.pos.x = this.dom.offsetLeft;
    this.pos.y = this.dom.offsetTop;
  }

  return boardObject;
})();
