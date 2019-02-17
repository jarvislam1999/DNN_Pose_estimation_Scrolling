// ml5 has pre-made machine learning libraries to use
// posenet is a library in ml5 and is a machine learning model
// allows for real-time human-pose estimation

let video;
let poseNet;
let pointX = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
let pointY = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
let pointX_1 = [0, 0];
let pointY_1 = [0, 0];
let time = 0;
const q_9 = new Queue();
const q_10 = new Queue();


function Queue() {
  this.data = [];
}

Queue.prototype.add = function(record) {
  this.data.unshift(record);
}
Queue.prototype.remove = function() {
  this.data.pop();
}

Queue.prototype.first = function() {
  return this.data[0];
}
Queue.prototype.last = function() {
  return this.data[this.data.length - 1];
}
Queue.prototype.size = function() {
  return this.data.length;
}

function setup() { 
  createCanvas(640, 480);
  // adds a webcam image under the canvas
  video = createCapture(VIDEO);
  // hide the video element to only show the video on the canvas
	video.hide();
  // takes time for this to run - loads poseNet model
  poseNet = ml5.poseNet(video, modelReady);
  // pose event - array of all pose information
  //console.time("concatenation");
  poseNet.on('pose', gotPoses);

}

// callback event for when poseNet has detected a pose
function gotPoses(poses){
  //console.log(poses[0].pose.keypoints[9].score);
	// console.log(concatenation);
	// console.time("concatenation");
	//console.timeEnd("concatenation");
  
  // make sure there is at least one pose

  if (poses.length > 0) {
	  const start = window.performance.now();
    /*
    for (let i=0 ; i<17 ; i++) {
      let posx= poses[0].pose.keypoints[i].position.x;
      let posy= poses[0].pose.keypoints[i].position.y;
      // linear interpolation - finding a point in between
			// two other points  -- this will smooth out the choppiness
      pointX[i] = lerp(pointX[i], posx, 0.5);
      pointY[i] = lerp(pointY[i], posy, 0.5);  
    }
    */
		let posx = poses[0].pose.keypoints[9].position.x;
    let posy = poses[0].pose.keypoints[9].position.y;
    if (poses[0].pose.keypoints[9].score >= 0.002){
    	pointX[9] = lerp(pointX[9], posx, 0.5);
    	pointY[9] = lerp(pointY[9], posy, 0.5);
    }
    
  	posx = poses[0].pose.keypoints[10].position.x;
    posy = poses[0].pose.keypoints[10].position.y;
    if (poses[0].pose.keypoints[10].score >= 0.002){
    	pointX[10] = lerp(pointX[10], posx, 0.5);
    	pointY[10] = lerp(pointY[10], posy, 0.5);
    }
    const end = window.performance.now();
    time += (end - start);
    console.log(time);
    
		if (time <= 0.1){
    	q_9.add(pointY[9]);
      q_10.add(pointY[10]);
    } else {
      q_9.add(pointY[9]);
      q_9.remove();
      q_10.add(pointY[10]);
      q_10.remove();
      console.log(q_9.first() - q_9.last());
      if (q_9.first() - q_9.last() > 200){
        window.scrollBy(0, -1000);
        for (let i = 0; i < q_9.size(); i++){
          q_9.add(pointY[9]);
          q_9.remove();
        }
    	}
      if (q_10.first() - q_10.last() < -150){
        window.scrollBy(0, 1000);
        for (let i = 0; i < q_10.size(); i++){
          q_10.add(pointY[10]);
          q_10.remove();
        }
    	}
    }

  }
}

// callback event that tells us when ml5 is finished running model
function modelReady() {
  console.log("model ready");
}

function draw() {
  background(220);
  // draw the image from the webcam onto the canvas to add animation
  image(video, 0, 0);
  fill (255, 0,0);
  
	// detect distance from the camera
  //let d = dist(noseX, noseY, eyelX, eyelY);
  for(let i=0 ; i<17 ; i++) {
    if (i == 9 || i ==10){
   		ellipse(pointX[i], pointY[i], 10); 
    }
  }
}