import cv2
import sys
import math
sys.path.append('build/python')
from openpose import pyopenpose as op
from engine import Engine
import time

exercises = []

"""def printScores(fileName, keyPoints, frontString, outputName, feedbackName):
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
    return output[outputName]"""

"""def squatPostureSideViewOld(keyPoints):

    #Side view functions:
    #hips have to go downwards, backwards and outwards
    score1 = printScores('squatSideViewHipPosition.txt', keyPoints, "Back posture", "backOutput", "backFeedback")
    score2 = printScores('squatSideViewHipPosition.txt', keyPoints, "Hip posture", "hipOutput", "hipFeedback")

    #knees should not go ahead of the toes
    score3 = printScores('squatSideViewKneePosition.txt', keyPoints, "Right knee position", "rightOutput", "rightFeedback")
    score4 = printScores('squatSideViewKneePosition.txt', keyPoints, "Left knee position", "leftOutput", "leftFeedback")

    #Heels glued to the floor
    #score5 = printScores('squatSideViewHeels.txt', keyPoints, "Heels", "output", "feedback")

    print ("Average score: " + str(round((score1+score2+score3+score4)/4,2)))"""

def analyse_frame(opencv_frame, exercise):
    datum = op.Datum()
    datum.cvInputData = opencv_frame
    opWrapper.emplaceAndPop(op.VectorDatum([datum]))
    return exercise(datum.poseKeypoints)

def analyse_video(opencv_video, exercise):
    while (opencv_video.isOpened()):
        ret, frame = opencv_video.read()
        #print (int(opencv_video.get(cv2.CAP_PROP_FRAME_COUNT)))
        for i in range(int(opencv_video.get(cv2.CAP_PROP_FRAME_COUNT))):
            if ret==True:
                print(i)
                x = analyse_frame(frame, exercise)
                x['frame'] = i
                exercises.append(x)
                print (exercises)
            else:
                break

def squatSideView(keyPoints):
    x = Engine("test_engine")
    x['kp'] = keyPoints
    x.run('squatSideView.txt')
    output = x.output_dict()
    """print (output['rightKneeResult'])
    print (output['leftKneeResult'])
    print (output['backResult'])
    print (output['hipResult'])
    print (output['average'])"""
    score = {'rightKnee': output['rightKneeScore'], 'leftKnee': output['leftKneeScore'], 'back': output['backScore'], 'hip': output['hipScore'], 'average': output['averageVal']}
    feedback = {'rightKnee': output['rightKneeFeedback'], 'leftKnee': output['leftKneeFeedback'], 'back': output['backFeedback'], 'hip': output['hipFeedback']}
    return({'type':squatSideView, 'frame': 0, 'scores': score, 'feedbacks': feedback})

def squatPostureFrontViewOld(keyPoints):
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


"""def lungePostureSideViewOld(keyPoints):
    #Knees at 90
    score1 = printScores('lungeSideViewKneeAngle.txt', keyPoints, "Right Knee", "rightOutput", "rightFeedback")
    score2 = printScores('lungeSideViewKneeAngle.txt', keyPoints, "Left Knee", "leftOutput", "leftFeedback")

    #front knee shouldn't go beyond the ankel
    score3 = printScores('lungeSideViewKneeToe.txt', keyPoints, "Front knee", "Output", "Feedback")

    #Back is bent forward
    score4 = printScores('lungeSideViewBack.txt', keyPoints, "Back", "Output", "Feedback")
    #Front leg should be parallel to ground -> front thigh angle to ground near 0
    print ("Average score: " + str(round((score1+score2+score3+score4)/4,2)))"""


def lungeSideView(keyPoints):
    x = Engine("test_engine")
    x['kp'] = keyPoints
    x.run('lungeSideView.txt')
    output = x.output_dict()
    score = {'rightKnee': output['rightKneeScore'], 'leftKnee': output['leftKneeScore'],'back': output['backScore'], 'frontKnee': output['frontKneeScore'], 'average': output['averageVal']}
    feedback = {'rightKnee': output['rightKneeFeedback'], 'leftKnee': output['leftKneeFeedback'],'back': output['backFeedback'], 'frontKnee': output['frontKneeFeedback']}
    return({'type':sideLungeFrontView, 'frame': 0, 'scores': score, 'feedbacks': feedback})


"""def sideLungePostureFrontViewOld(keyPoints):

    #knee doesn't cross toes
    score1 = printScores('sideLungeFrontViewKneeToe.txt', keyPoints, "knee position", "Output", "feedback")

    #toe angle to vertical is fine
    score2 = printScores('sideLungeFrontViewAngle.txt', keyPoints, "Foot Angle", "Output", "Feedback")

    print ("Average score: " + str(round((score1+score2)/2,2)))"""
    
def sideLungeFrontView(keyPoints):
    x = Engine("test_engine")
    x['kp'] = keyPoints
    x.run('sideLungeFrontView.txt')
    output = x.output_dict()
    score = {'footAngle': output['angleScore'], 'kneePosition': output['kneeScore'], 'average': output['averageVal']}
    feedback = {'footAngle': output['angleFeedback'], 'kneePosition': output['kneeFeedback']}
    return({'type':sideLungeFrontView, 'frame': 0, 'scores': score, 'feedbacks': feedback})


opWrapper = op.WrapperPython()
opWrapper.configure({"model_pose": "BODY_25"})
opWrapper.start()

#Video code start
"""cap = cv2.VideoCapture("refPics/squatSide.mp4")
print('FPS: ' + str(int(cap.get(5))))
frame_counter = 0
sum = 0
start_time = time.time()
drawn_frame_list = []
while (cap.isOpened()):
    ret, frame = cap.read()
    frame_counter += 1
    if ret==True:
        datum = op.Datum()
        datum.cvInputData = frame
        opWrapper.emplaceAndPop(op.VectorDatum([datum]))
        print('Frame: ' + str(frame_counter))
        sum += squatSideView(datum.poseKeypoints)
        print()
        drawn_frame_list.append(datum.cvOutputData)
        #cv2.imshow("Analysis Preview", datum.cvOutputData)
        if cv2.waitKey(25) & 0xFF == ord('q'):
            break
    else:
        break
print (time.time()-start_time)
print ('Total average: ' + str(sum/frame_counter))
#cap.release()
frame_width = int(cap.get(3)) 
frame_height = int(cap.get(4)) 
size = (frame_width, frame_height) 
result = cv2.VideoWriter('refPics/result.mp4',cv2.VideoWriter_fourcc(*'X264'), int(cap.get(5)) , size)
for i in range(len(drawn_frame_list)):
    # writing to a image array
    result.write(drawn_frame_list[i])
result.release()
cap.release() 
    
# Closes all the frames 
cv2.destroyAllWindows()"""

#Video code end

cap = cv2.VideoCapture("refPics/squatSideEdited2.mp4")
analyse_video(cap,lungeSideView)
print (exercises)

#Image code start
"""img = cv2.imread('refPics/sidelungeBad.jpg')
datum = op.Datum()
datum.cvInputData = img
opWrapper.emplaceAndPop(op.VectorDatum([datum]))"""
#print("Body keypoints: \n" + str(datum.poseKeypoints))
#print(datum.poseKeypoints)

#avg = squatSideView(datum.poseKeypoints)
#avg = lungeSideView(datum.poseKeypoints)
"""avg = sideLungeFrontView(datum.poseKeypoints)


cv2.imshow('Analysis Preview', datum.cvOutputData)
cv2.waitKey(0)
cv2.destroyAllWindows()"""
#Image code end


#username, filename, file -> store in postures as posture/userName/fileName //search up saving file in flask + python