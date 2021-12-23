import {average, angleToHori, angleScoreCalc, ltScoreCalc, distance, averageKeypoints, gtScoreCalc} from './exercise_utils.js';
//import engine from './engine.js';

export default function Squatanalyse(engine){
    let keypoints = engine.getKeyPoints();
    let output = {features:[], averageScore: 0};

    let leftFeedback = ""
    let leftScore = 0
    let rightFeedback = ""
    let rightScore = 0
    let backFeedback = ""
    let backScore = 0
    let hipFeedback = ""
    let hipScore = 0

    if (keypoints[31]['x']- keypoints[25]['x']<=distance(keypoints[27], keypoints[29])) leftFeedback = 'Good, not going over toes' 
    else leftFeedback = 'Your left knee is going over your toes'
    leftScore = ltScoreCalc(keypoints[31]['x'] -keypoints[25]['x'], distance(keypoints[27],keypoints[29]))
    if (keypoints[32]['x']-keypoints[26]['x'] <= distance(keypoints[28], keypoints[30])) rightFeedback = 'Good, not going over toes' 
    else rightFeedback = 'Your right knee is going over your toes'
    rightScore = ltScoreCalc(keypoints[32]['x']-keypoints[26]['x'], distance(keypoints[28],keypoints[30]))
    output['features'].push({attr: "Left Knee", feedback:leftFeedback, score:leftScore});
    output['features'].push({attr: "Right Knee", feedback:rightFeedback, score:rightScore});

    let upperLimit = 65
    let lowerLimit = 55
    let angle = angleToHori(averageKeypoints(keypoints[11], keypoints[12]), averageKeypoints(keypoints[23],keypoints[24]))
    let idealAngle = average(upperLimit, lowerLimit)
    let range = Math.abs(upperLimit-lowerLimit)/2
    backScore = angleScoreCalc(angle, idealAngle, range)
    if (angle >= lowerLimit && angle <= upperLimit) backFeedback = 'Good' 
    else {
        if (angle > upperLimit) backFeedback = 'Your back is too upright' 
        else backFeedback = 'Your back is too close to your knees'
    }
    output['features'].push({attr: "Back", feedback:backFeedback, score:backScore});

    let hipScore1 = gtScoreCalc(averageKeypoints(keypoints[23],keypoints[24])[0],keypoints[29][0])
    let hipScore2 = gtScoreCalc(averageKeypoints(keypoints[23],keypoints[24])[0],[24][0])
    if (hipScore1 < hipScore2) hipScore = hipScore1 
    else hipScore = hipScore2
    if (averageKeypoints(keypoints[23],keypoints[24])['x'] >= keypoints[29][0] || averageKeypoints(keypoints[23],keypoints[24])['x'] >= keypoints[30]['x']) hipFeedback = 'Good' 
    else hipFeedback = 'Move your hip outwards'
    output['features'].push({attr: "Hip", feedback:hipFeedback, score:hipScore});
    output['averageScore'] = (rightScore + leftScore + backScore + hipScore)/4;
    engine.updateOutput(output)
}