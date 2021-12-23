import {average, angleBetweenThreePoints, angleToHori, angleScoreCalc, ltScoreCalc, distance, averageKeypoints} from './exercise_utils.js';
//import engine from './engine.js';

export default function lungeAnalyse(engine){
    //console.log(engine);
    let keypoints = engine.getKeyPoints();
    //console.log(keypoints)

    let output = {features:[], averageScore: 0};
    let rightKneeFeedback = ""
    let leftKneeFeedback = ""
    let backFeedback = ""
    let frontKneeFeedback = ""
    let frontKnee = ""
    let rightKneeScore = 0
    let leftKneeScore = 0
    let backScore = 0
    let frontKneeScore = 0

    let upperLimit = 95;
    let lowerLimit = 85;
    let idealAngle = average(upperLimit, lowerLimit);
    let range = Math.abs(upperLimit-lowerLimit)/2;
    let rightAngle = angleBetweenThreePoints(keypoints[24], keypoints[26],keypoints[28])
    let leftAngle = angleBetweenThreePoints(keypoints[23], keypoints[25],keypoints[27])
    rightKneeScore = angleScoreCalc(rightAngle, idealAngle, range)
    leftKneeScore = angleScoreCalc(leftAngle, idealAngle, range)

    //if any used undefined -> return feedback saying unable to identity and score=-1
    
    if (rightAngle>=lowerLimit && rightAngle<=upperLimit) rightKneeFeedback='Good'
    else {
        if (rightAngle>upperLimit) rightKneeFeedback='forming an angle greater than 90' 
        else rightKneeFeedback='forming an angle lesser than 90'
    }
    if (leftAngle>=lowerLimit && leftAngle<=upperLimit) rightKneeFeedback='Good' 
    else {
        if (leftAngle>upperLimit) leftKneeFeedback='forming an angle greater than 90' 
        else leftKneeFeedback='forming an angle lesser than 90'
    }
    if (keypoints[24]===undefined || keypoints[26]===undefined || keypoints[28]===undefined){
        rightKneeFeedback = "Unable to detect required points"
        rightKneeScore = -1
    }
    if (keypoints[23]===undefined || keypoints[25]===undefined || keypoints[27]===undefined){
        leftKneeFeedback = "Unable to detect required points"
        leftKneeScore = -1
    }
    output['features'].push({attr: "Left Knee", feedback:leftKneeFeedback, score:leftKneeScore});
    output['features'].push({attr: "Right Knee", feedback:rightKneeFeedback, score:rightKneeScore});


    upperLimit = 95
    lowerLimit = 80
    idealAngle = average(upperLimit, lowerLimit)
    range = Math.abs(upperLimit-lowerLimit)/2;
    let backAngle = angleToHori(keypoints[0],averageKeypoints(keypoints[23],keypoints[24]))
    backScore = angleScoreCalc(backAngle, idealAngle, range)
    if (backAngle >= lowerLimit && backAngle <= upperLimit) backFeedback='Good' 
    else {
        if (backAngle>upperLimit) backFeedback='your back is too upright' 
        else backFeedback='your back is too close to your knees'
    }
    if (keypoints[0]===undefined || keypoints[23]===undefined || keypoints[24]===undefined){
        backFeedback = "Unable to detect required points"
        backScore = -1
    }
    output['features'].push({attr: "Back", feedback:backFeedback, score:backScore});

    if (keypoints[25]['y']>keypoints[26]['y']) frontKnee=keypoints[25] 
    else frontKnee=keypoints[26]
    if (frontKnee===keypoints[25]) {
        if (keypoints[25]['x']- keypoints[31]['x']<=distance(keypoints[28],keypoints[30])) frontKneeFeedback = 'Good' 
        else frontKneeFeedback='your knee is going over your toes'
    }
    if (frontKnee===keypoints[26]) {
        if (keypoints[26]['x'] -keypoints[32]['x']<=distance(keypoints[28],keypoints[30])) frontKneeFeedback = 'Good' 
        else frontKneeFeedback='your knee is going over your toes'
        frontKneeScore=ltScoreCalc(keypoints[32]['x']-keypoints[26]['x'], distance(keypoints[28],keypoints[30])) 
    }
    if (frontKnee===keypoints[25]) {
        if (keypoints[25]['x'] -keypoints[31]['x']<=distance(keypoints[28],keypoints[30])) frontKneeFeedback = 'Good' 
        else frontKneeFeedback='your knee is going over your toes'
        frontKneeScore=ltScoreCalc(keypoints[31]['x']-keypoints[25]['x'], distance(keypoints[27],keypoints[29])) 
    }
    if (keypoints[25]===undefined || keypoints[26]===undefined || keypoints[31]===undefined|| keypoints[28]===undefined|| keypoints[30]===undefined|| keypoints[32]===undefined|| keypoints[27]===undefined|| keypoints[29]===undefined){
        frontKneeFeedback = "Unable to detect required points"
        frontKneeScore = -1
    }
    output['features'].push({attr: "Front Knee", feedback:frontKneeFeedback, score:frontKneeScore});
    output['averageScore'] = (frontKneeScore+backScore+rightKneeScore+leftKneeScore)/4;
    engine.updateOutput(output)

                        // process my stuff with the algos on the google doc
                        // update the outputs: engine.updateOutput({....})
                        /* output template:
                        {
                            features: [
                                {
                                    attr: string,
                                    feedback : string,
                                    score: float,
                                },
                                {
                                    attr: string,
                                    feedback : string,
                                    score: float
                                },
                                {
                                    attr: string,
                                    feedback : string,
                                    score: float
                                }
                            ]
                        }
                        */
}