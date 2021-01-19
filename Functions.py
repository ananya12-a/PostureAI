import cv2
import sys
import math
sys.path.append('build/python')
from openpose import pyopenpose as op
from engine import Engine

def printScores(fileName, keyPoints, frontString, outputName, feedbackName):
    x = Engine("test_engine")
    x['kp'] = keyPoints
    x.run(fileName)
    output = x.output_dict()
    if (output[feedbackName]=="Good"):
        if (output[outputName]>80):
            print(frontString + ": " + str(output[outputName]) + " Good")
        elif (output[outputName]>60):
            print(frontString + ": "+ str(output[outputName]) + " Okay")
        else:
            print(frontString + ": "+ str(output[outputName]) + " Bad")
    else:
        print(frontString + ": "+ str(output[outputName]) + " " +str(output[feedbackName]))
    return output[outputName]

def squatPostureSideView(keyPoints):

    #Side view functions:
    #hips have to go downwards, backwards and outwards
    score1 = printScores('squatSideViewHipPosition.txt', keyPoints, "Back posture", "backOutput", "backFeedback")
    score2 = printScores('squatSideViewHipPosition.txt', keyPoints, "Hip posture", "hipOutput", "hipFeedback")

    #knees should not go ahead of the toes
    score3 = printScores('squatSideViewKneePosition.txt', keyPoints, "Right knee position", "rightOutput", "rightFeedback")
    score4 = printScores('squatSideViewKneePosition.txt', keyPoints, "Left knee position", "leftOutput", "leftFeedback")

    #Heels glued to the floor
    score5 = printScores('squatSideViewHeels.txt', keyPoints, "Heels", "output", "feedback")

    print ("Average score: " + str(round((score1+score2+score3+score4+score5)/5,2)))

def squatPostureFrontView(keyPoints):
    x = Engine("test_engine")
    x['kp'] = keyPoints

    x.run('squatFrontViewKneePosture.txt')
    output = x.output_dict()
    print("Right knee posture: " + output['rightOutput'])
    print("Left knee posture: " + output['leftOutput'])

    x.run('squatFrontViewToePosition.txt')
    output = x.output_dict()
    print("Right foot posture: " + output['rightOutput'])
    print("Left foot posture: " + output['leftOutput'])
    
    x.run('squatFrontViewShoulderFeetDistances.txt')
    output = x.output_dict()
    if (output['name']=="Bad"):
        print("Distance check: " + output['improvement'])
    else:
        print("Distance check: " + output['name'])
    #Check to see if feet are anchored at the heel


def lungePostureSideView(keyPoints):
    #Knees at 90
    score1 = printScores('lungeSideViewKneeAngle.txt', keyPoints, "Right Knee", "rightOutput", "rightFeedback")
    score2 = printScores('lungeSideViewKneeAngle.txt', keyPoints, "Left Knee", "leftOutput", "leftFeedback")

    #front knee shouldn't go beyond the ankel
    score3 = printScores('lungeSideViewKneeToe.txt', keyPoints, "Front knee", "Output", "Feedback")

    #Back is bent forward
    score4 = printScores('lungeSideViewBack.txt', keyPoints, "Back", "Output", "Feedback")
    #Front leg should be parallel to ground -> front thigh angle to ground near 0
    print ("Average score: " + str(round((score1+score2+score3+score4)/4,2)))


def sideLungePostureFrontView(keyPoints):

    #knee doesn't cross toes
    score1 = printScores('sideLungeFrontViewKneeToe.txt', keyPoints, "knee position", "Output", "feedback")

    #toe angle to vertical is fine
    score2 = printScores('sideLungeFrontViewAngle.txt', keyPoints, "Foot Angle", "Output", "Feedback")

    print ("Average score: " + str(round((score1+score2)/2,2)))
    



opWrapper = op.WrapperPython()
opWrapper.configure({"model_pose": "BODY_25"})
opWrapper.start()

"""cap = cv2.VideoCapture("refPics/Squat side View.mp4")
while (cap.isOpened()):
    ret, frame = cap.read()
    if ret==True:
        datum = op.Datum()
        datum.cvInputData = frame
        opWrapper.emplaceAndPop(op.VectorDatum([datum]))
        squatPostureSideView(datum.poseKeypoints)
        cv2.imshow("Analysis Preview", datum.cvOutputData)
        if cv2.waitKey(25) & 0xFF == ord('q'):
            break
    else:
        break

cap.release()"""

img = cv2.imread('refPics/squatside.jpg')
datum = op.Datum()
datum.cvInputData = img
opWrapper.emplaceAndPop(op.VectorDatum([datum]))
#print("Body keypoints: \n" + str(datum.poseKeypoints))
#print(abs(datum.poseKeypoints[0][10][0]-datum.poseKeypoints[0][11][0]))
#print(datum.poseKeypoints)


squatPostureSideView(datum.poseKeypoints)
#lungePostureSideView(datum.poseKeypoints)
#sideLungePostureFrontView(datum.poseKeypoints)


cv2.imshow("Analysis Preview", datum.cvOutputData)
cv2.waitKey(0)
cv2.destroyAllWindows()