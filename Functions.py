import cv2
import sys
import math
sys.path.append('python')
from openpose import pyopenpose as op
from engine import Engine
import time
import asyncio
import numpy

#shift this to another util file later on
class LoopBreak(Exception):
    pass

opWrapper = op.WrapperPython()
opWrapper.configure({"model_pose": "BODY_25"})
opWrapper.start()

engine = Engine("upload-image-test-engine")

# Openpose: Will need to change to alphapose
def analyse_frame_sync(opencv_frame: numpy.ndarray, exercise: str, orientation: str):
    datum = op.Datum()
    datum.cvInputData = opencv_frame
    opWrapper.emplaceAndPop(op.VectorDatum([datum]))
    exercise = inbuilt_exercises[exercise]
    return exercise.analyse(engine, datum.poseKeypoints, orientation=orientation), datum.poseKeypoints

def analyse_video_sync(opencv_video: cv2.VideoCapture, exercise: str, orientation: str):
    exercises = []
    keypoints = []
    while (opencv_video.isOpened()):
        ret, frame = opencv_video.read()
        frame = cv2.resize(frame, (368,368))
        sum = 0
        for i in range(int(opencv_video.get(cv2.CAP_PROP_FRAME_COUNT))):
            if ret==True:
                print('frame:' + str(i))
                x, keypoint_frame = analyse_frame_sync(frame, exercise, orientation)
                x['frame'] = i
                sum = sum + x['scores']['average']
                exercises.append(x)
                keypoints.append({'frame': i, 'keypoints': keypoint_frame.tolist()})
            else:
                break
        cv2.waitKey(0)
        cv2.destroyAllWindows()
        avg = round(sum/int(opencv_video.get(cv2.CAP_PROP_FRAME_COUNT)),0)
        return {'keypoints': keypoints, 'analysis': exercises, 'avgscore': avg}

# Openpose: Will need to change to alphapose
async def analyse_frame(opencv_frame: numpy.ndarray, exercise: str, orientation: str, frame: int):
    print("async analyse_frame called")
    datum = op.Datum()
    datum.cvInputData = opencv_frame
    opWrapper.emplaceAndPop(op.VectorDatum([datum]))
    return exercise.analyse(engine, datum.poseKeypoints, orientation = orientation), datum.poseKeypoints, frame

async def analyse_video(opencv_video: cv2.VideoCapture, exercise: str, orientation: str):
    exercises, keypoints = [], []
    while (opencv_video.isOpened()):
        ret, frame = opencv_video.read()
        frame, sum, tasks = cv2.resize(frame, (368,368)), 0, []
        try: 
            for i in range(int(opencv_video.get(cv2.CAP_PROP_FRAME_COUNT))):
                if ret==True:
                    print('frame:' + str(i))
                    tasks.append(asyncio.create_task(analyse_frame(frame, inbuilt_exercises[exercise], orientation, i)))
                else:
                    raise LoopBreak("exiting for loop [for i in range(int(opencv_video.get(cv2.CAP_PROP_FRAME_COUNT))):]")
        except LoopBreak: 
            pass
        returns = await asyncio.gather(*tasks)
        for (x,keypoint_frame, i) in returns:
            x['frame'], sum = i, sum + x['scores']['average']
            exercises.append(x)
            keypoints.append({'frame': i, 'keypoints': keypoint_frame.tolist()})
        cv2.waitKey(0)
        cv2.destroyAllWindows()
        return {
            'keypoints': keypoints, 
            'analysis': exercises, 
            'avgscore': round(sum/int(opencv_video.get(cv2.CAP_PROP_FRAME_COUNT)),0)
            }

# TODO: separate class file
class InvalidExerciseFormat(Exception):
    pass

class ExerciseAnalyser: 
    def analyse(self, engine: Engine, keypoints: dict, *args, **kwargs): 
        raise NotImplementedError

    def statistics(self, analysis_dict: dict, *args, **kwargs):
        raise NotImplementedError

class Lunge(ExerciseAnalyser):
    def analyse(self, engine: Engine, keypoints: dict, *args, **kwargs): 
        if not 'orientation' in kwargs: 
            raise InvalidExerciseFormat("Orientation not found")
        engine['kp'] = keypoints
        # TODO: rename files to given format
        engine.run('lunge' + kwargs['orientation'].capitalize() + 'View')
        output = engine.output_dict()
        return {
            'type': self, 
            'frame': 0, 
            'scores': {
                'rightKnee': output['rightKneeScore'], 
                'leftKnee': output['leftKneeScore'],
                'back': output['backScore'], 
                'frontKnee': output['frontKneeScore'], 
                'average': output['averageVal']
                }, 
            'feedbacks': {
                'rightKnee': output['rightKneeFeedback'], 
                'leftKnee': output['leftKneeFeedback'],
                'back': output['backFeedback'], 
                'frontKnee': output['frontKneeFeedback']
                }
            }

class SideLunge(ExerciseAnalyser):
    def analyse(self, engine: Engine, keypoints: dict, *args, **kwargs):
        if not 'orientation' in kwargs:
            raise InvalidExerciseFormat("Orientation not found")
        engine['kp'] = keypoints
        #TODO: rename files to given format
        engine.run('sideLunge' + kwargs['orientation'].capitalize() + 'View')
        output = engine.output_dict()
        return {
            'type': self, 
            'frame': 0, 
            'scores': {
                'rightKnee': output['rightKneeScore'], 
                'leftKnee': output['leftKneeScore'],
                'back': output['backScore'], 
                'frontKnee': output['frontKneeScore'], 
                'average': output['averageVal']
                }, 
            'feedbacks': {
                'rightKnee': output['rightKneeFeedback'], 
                'leftKnee': output['leftKneeFeedback'],
                'back': output['backFeedback'], 
                'frontKnee': output['frontKneeFeedback']
                }
            }

class Squat(ExerciseAnalyser):
    def analyse(self, engine: Engine, keypoints: dict, *args, **kwargs):
        if not 'orientation' in kwargs:
            raise InvalidExerciseFormat("Orientation not found")
        else: 
            orientation = kwargs['orientation']
        engine['kp'] = keypoints
        #TODO: rename files to given format
        engine.run('squat' + kwargs['orientation'].capitalize() + 'View')
        output = engine.output_dict()
        return {
            'type': self, 
            'frame': 0, 
            'scores': {
                'rightKnee': output['rightKneeScore'], 
                'leftKnee': output['leftKneeScore'], 
                'back': output['backScore'], 
                'hip': output['hipScore'], 
                'average': output['averageVal']
                } if orientation == 'side' else {

                }, 
            'feedbacks': {
                'rightKnee': output['rightKneeFeedback'],
                'leftKnee': output['leftKneeFeedback'], 
                'back': output['backFeedback'], 
                'hip': output['hipFeedback']
                } if orientation == 'side' else {

                }
            }

inbuilt_exercises = {'squat': Squat(), 'sideLunge': SideLunge(), 'lunge': Lunge()}