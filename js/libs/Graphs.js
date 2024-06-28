'use strict'

var osthumb= document.getElementById('osthumb');
var ttthumb= document.getElementById('ttthumb');
var pxthumb= document.getElementById('pxthumb');
var pythumb= document.getElementById('pythumb');
var ptthumb= document.getElementById('ptthumb');

var spiral_data = JSON.parse(localStorage.getItem('spiral'));
localStorage.removeItem('spiral');
console.log(spiral_data);
var x = spiral_data.map(a => a.x);
var y = spiral_data.map(a => a.y);
var time = spiral_data.map(a => a.t);
var pressure = spiral_data.map(a => a.p);

// calculate sample rate
var sum = 0;
for (var i = 1; i<time.length; i++) {
    sum += time[i]-time[i-1];
}
var dur_sample = (sum/(time.length-1));
console.log("Sample Rate: ", (1000/dur_sample), "Hz");

var text = localStorage.getItem('dos');
document.getElementById("DOSindex").innerHTML = "Degree of Severity: " + text;

console.log(text);
console.log(x);
console.log(y);
console.log(time);

//var c = Array.from(Array(x.length).keys());

var TimeTrace = {
    type: 'scatter3d',
    mode: 'lines',
    x: x,
    y: y,
    z: time,
    opacity: 0.7,
    line: {
        width: 10,
        //color: c,
        color: pressure,
        colorscale: 'Viridis',
        colorbar: {
            thickness: 10,
            title: "Pressure"
        }
}
}

var OriginalSpiral = {
    type: 'scatter',
    x: x,
    y: y
}

var PressureX = {
    type: 'scatter',
    x: x,
    y: pressure
}

var PressureY = {
    type: 'scatter',
    x: y,
    y: pressure
}

var PressureTime = {
    type: 'scatter',
    x: time,
    y: pressure
}


var layoutOS = {
    width: 350,
    height: 350,

    title: {
        text: 'Original Spiral',
        font: {size:12}
    },
    xaxis: {
        automargin: true,
        trickangle: 90,
        title: {
            text: 'X',
            font: {size:12}
        }
    },
    yaxis: {
        automargin: true,
        trickangle: 90,
        title: {
            text: 'Y',
            font: {size:12}
        }
    },
    showlegend: false,
    paper_bgcolor: "efefef",
    plot_bgcolor: "efefef"
}

var layoutTT = {
    width: 350,
    height: 350,
    title: {
        text: 'Time vs. Trace',
        font: {size:12}
    },
    scene: {
		xaxis:{title: 'X', font: {size:12}},
		yaxis:{title: 'Y', font: {size:12}},
		zaxis:{title: 'Time', font: {size:12}},
	},
    showlegend: false,
    paper_bgcolor: "efefef",
    plot_bgcolor: "efefef"
}

var layoutPX = {
    width: 350,
    height: 350,
    title: {
        text: 'Pressure vs. X',
        font: {size:12}
    },
    xaxis: {
        automargin: true,
        trickangle: 90,
        title: {
            standoff: 20,
            text: 'X',
            font: {size:12} 
        }
    },
    yaxis: {
        automargin: true,
        trickangle: 90,
        title: {
            standoff: 20,
            text: 'Pressure',
            font: {size:12}
        }
    },
    showlegend: false,
    paper_bgcolor: "efefef",
    plot_bgcolor: "efefef"
}

var layoutPY = {
    width: 350,
    height: 350,
    title: {
        text: 'Pressure vs. Y',
        font: {size:12}
    },
    xaxis: {
        automargin: true,
        trickangle: 90,
        title: {
            standoff: 20,
            text: 'Y',
            font: {size:12}
        }
    },
    yaxis: {
        automargin: true,
        trickangle: 90,
        title: {
            standoff: 20,
            text: 'Pressure',
            font: {size:12}
        }
    },
    showlegend: false,
    paper_bgcolor: "efefef",
    plot_bgcolor: "efefef"
}

var layoutPT = {
    width: 350,
    height: 350,
    title: {
        text: 'Pressure vs. Time',
        font: {size:12}
    },
    xaxis: {
        automargin: true,
        trickangle: 90,
        title: {
            standoff: 20,
            text: 'Time in ms',
            font: {size:12}
        }
    },
    yaxis: {
        automargin: true,
        trickangle: 90,
        title: {
            standoff: 20,
            text: 'Pressure',
            font: {size:12}
        }
    },
    showlegend: false,
    paper_bgcolor: "efefef",
    plot_bgcolor: "efefef"
}

Plotly.newPlot('OS', [OriginalSpiral], layoutOS).then(
    function(gd) {
        Plotly.toImage(gd, {format: "png"}).then(
            function(url) {
                osthumb.setAttribute("data-thumb",url)
            }
        )
        document.body.appendChild(osthumb)
    }
);
Plotly.newPlot('TT', [TimeTrace], layoutTT).then(
    function(gd) {
        Plotly.toImage(gd, {format: "png"}).then(
            function(url) {
                ttthumb.setAttribute("data-thumb",url)
            }
        )
        document.body.appendChild(ttthumb)
    }
);
Plotly.newPlot('PX', [PressureX], layoutPX).then(
    function(gd) {
        Plotly.toImage(gd, {format: "png"}).then(
            function(url) {
                pxthumb.setAttribute("data-thumb",url)
            }
        )
        document.body.appendChild(pxthumb)
    }
);
Plotly.newPlot('PY', [PressureY], layoutPY).then(
    function(gd) {
        Plotly.toImage(gd, {format: "png"}).then(
            function(url) {
                pythumb.setAttribute("data-thumb",url)
            }
        )
        document.body.appendChild(pythumb)
    }
);
Plotly.newPlot('PT', [PressureTime], layoutPT).then(
    function(gd) {
        Plotly.toImage(gd, {format: "png"}).then(
            function(url) {
                ptthumb.setAttribute("data-thumb",url)
            }
        )
        document.body.appendChild(ptthumb)
    }
);

download(spiral_data);

let txtfileContent = localStorage.getItem("txtContent");
var filename = "cWeb-RH1";
var element = document.createElement('a');
element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURI(txtfileContent));
console.log(txtfileContent)
element.setAttribute('download', filename);
element.style.display = 'none';
document.body.appendChild(element);
element.click();
document.body.removeChild(element);