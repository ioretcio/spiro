class Point {
    constructor(X, Y) {
        this.X = X;
        this.Y = Y;
    }
}


let iterator = 0;


let anglespeed1 = 34; 
let anglespeed2 = 76;
let anglespeed3 = 1;

let drawing_time = 360
let rotating_time = 405
let recording_time = 450



let points = []
let back_color = "#0d0d0d";
let line_color = "#b05279";
let point_color = "#ffffff";
var canvas = document.createElement("canvas")
document.body.style.margin = 0
document.body.style.padding = 0
document.body.appendChild(canvas)

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
var context = canvas.getContext("2d")


context.fillStyle = back_color
context.fillRect(0, 0, canvas.width, canvas.height)




let center = new Point(canvas.width/2, canvas.height/2);
let alpha = new Point(center.X, center.Y-150);
let beta = new Point(center.X, center.Y-300);


let angle1 = anglespeed1 * Math.PI / 180;
let angle2 = anglespeed2 * Math.PI / 180;
let angle3 = anglespeed3 * Math.PI / 180;


let mediaRecorder;
let recordedChunks = [];

function startRecording() {
    let stream = canvas.captureStream(30);
    mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp9'
    });

    mediaRecorder.ondataavailable = function (event) {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = function () {
        let blob = new Blob(recordedChunks, {
            type: 'video/webm'
        });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'canvas_recording.mp4';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    };

    mediaRecorder.start();
}

function stopRecording() {
    mediaRecorder.stop();
    recordedChunks = [];
}



function rotatePoints() {
    
    let newX = Math.cos(angle1) * (alpha.X - center.X) - Math.sin(angle1) * (alpha.Y - center.Y) + center.X;
    let newY = Math.sin(angle1) * (alpha.X - center.X) + Math.cos(angle1) * (alpha.Y - center.Y) + center.Y;
    alpha.X = newX;
    alpha.Y = newY;

    newX = Math.cos(angle1) * (beta.X - center.X) - Math.sin(angle1) * (beta.Y - center.Y) + center.X;
    newY = Math.sin(angle1) * (beta.X - center.X) + Math.cos(angle1) * (beta.Y - center.Y) + center.Y;
    beta.X = newX;
    beta.Y = newY;

    let newXBeta = Math.cos(angle2) * (beta.X - alpha.X) - Math.sin(angle2) * (beta.Y - alpha.Y) + alpha.X;
    let newYBeta = Math.sin(angle2) * (beta.X - alpha.X) + Math.cos(angle2) * (beta.Y - alpha.Y) + alpha.Y;
    beta.X = newXBeta;
    beta.Y = newYBeta;
}
canvas.addEventListener('click', function() {
    startRecording();
    function animate() {
        
        if (iterator <= recording_time) {

            rotatePoints();
        
            if(iterator<=drawing_time)
            {
                points.push(new Point(beta.X, beta.Y));
            }
            // else
            // {
            //     points.shift();
            // }
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            if(iterator<rotating_time-1)
            {
                points.forEach(point => {
                    let newX = Math.cos(angle3) * (point.X - center.X) - Math.sin(angle3) * (point.Y - center.Y) + center.X;
                    let newY = Math.sin(angle3) * (point.X - center.X) + Math.cos(angle3) * (point.Y - center.Y) + center.Y;
                    point.X = newX;
                    point.Y = newY;
                });
            }

            context.strokeStyle = point_color;
            context.lineWidth = 1.5;
            for (let i = 0; i < points.length - 1; i++) {
                let point1 = points[i];
                let point2 = points[i + 1];
                context.beginPath();
                context.moveTo(point1.X, point1.Y);
                context.lineTo(point2.X, point2.Y);
                context.stroke();
                context.fillStyle = back_color;
                context.fill();
            }

            if (iterator < drawing_time) {
                context.beginPath();
                context.lineWidth = 4;
                context.strokeStyle = "black";
                context.moveTo(center.X-2, center.Y-2);
                context.lineTo(alpha.X-2, alpha.Y-2);
                context.moveTo(alpha.X-2, alpha.Y-2);
                context.lineTo(beta.X-2, beta.Y-2);
                context.stroke();
                context.fill();

                context.beginPath();
                context.lineWidth = 4;
                context.strokeStyle = line_color;
                context.moveTo(center.X, center.Y);
                context.lineTo(alpha.X, alpha.Y);
                context.moveTo(alpha.X, alpha.Y);
                context.lineTo(beta.X, beta.Y);
                context.stroke();
                context.fill();
            }

            context.lineWidth = 4;
            context.strokeStyle = line_color;
            context.beginPath();
            context.moveTo(center.X, center.Y);
            context.arc(center.X, center.Y, 4, 0, 2 * Math.PI);
            context.stroke();
            context.fillStyle = back_color;
            context.fill();



            if (iterator == recording_time) {
                stopRecording();
            }
           


            console.log("Speed1: " + anglespeed1);
            console.log("Speed2: " + anglespeed2);
            console.log("Rotate: " + anglespeed3);
            console.log("Iterat: " + iterator);

            iterator += 1;
        }
        
        setTimeout(() => {
            window.requestAnimationFrame(animate);
            context.fillStyle = back_color;
        }, 20);
    }
    animate();
});
