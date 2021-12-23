

function average(a,b){
    return (a+b)/2
}


function averageKeypoints(kp1, kp2) {
    let x1=kp1['x']
    let x2=kp2['x']
    let y1=kp1['y']
    let y2=kp2['y']
    return {x: (x1+x2)/2, y:(y1+y2)/2, z:(kp1['z']+kp2['z'])/2}
}

function calcAngle(opp, adj){
    return Math.atan(opp/adj)
}

function angleToHori(kp1,kp2){
    let x1=kp1['x']
    let x2=kp2['x']
    let y1=kp1['y']
    let y2=kp2['y']
    
    //console.log("Angle To Hori:", kp1, kp2, x1, x2, y1, y2);
    return (Math.atan(Math.abs(y2-y1)/Math.abs(x2-x1)))* 180 / Math.PI
}

function angleToVert(kp1,kp2){
    let x1=kp1['x']
    let x2=kp2['x']
    let y1=kp1['y']
    let y2=kp2['y']
    return (Math.atan(Math.abs(x2-x1)/Math.abs(y2-y1)))* 180 / Math.PI
}

function angleScoreCalc(angle, idealAngle, halfRange){
    let diff = 10/halfRange * Math.abs(idealAngle - angle)
    return Math.round((idealAngle-diff)/idealAngle * 100)
}
function distScoreCalc(dist, refDist){
    return Math.round((refDist-dist)/refDist * 100)
}
function gtScoreCalc(val1, val2){
    if (val2>val1) {
        if (val2-val1<val2) {
            return Math.round((val2 - Math.abs(val1-val2))/val2 * 100,0);
        }
        else {
            return Math.round((val2-val1)/(val1+val2) * 100,0);
        }
    }
    else return 100.0
}
function ltScoreCalc(val1, val2){
    if (val2<val1){
        if (val1-val2<val2) return Math.round((val2 - Math.abs(val1-val2))/val2 * 100,0)
        else return Math.round((val1-val2)/(val1+val2) * 100,0)
    }
    else return 100.0
}

function distance(kp1, kp2){
    return ((kp2['x']-kp1['x'])**2 + (kp2['y']-kp1['y'])**2)**0.5
}
function angleBetweenThreePoints(kp1,kp2,kp3){
        //finds angle at middle point
        let x1=kp1['x']
        let x2=kp2['x']
        let x3=kp3['x']
        let y1=kp1['y']
        let y2=kp2['y']
        let y3=kp3['y']
        let dist12 = ((x2-x1)**2 + (y2-y1)**2)**0.5
        let dist23 = ((x2-x3)**2 + (y2-y3)**2)**0.5
        let dist13 = ((x3-x1)**2 + (y3-y1)**2)**0.5
        return Math.acos((dist23**2+dist12**2-dist13**2)/(2*dist23*dist12)) * 180/Math.PI
}

export {average, calcAngle, angleToHori, averageKeypoints, angleToVert, angleScoreCalc, distScoreCalc, ltScoreCalc, gtScoreCalc,angleBetweenThreePoints, distance}