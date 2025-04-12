import cv2
from django.http import StreamingHttpResponse
from django.shortcuts import render
from ultralytics import YOLO

class RealTimeObjectTracker:
    def __init__(self, model_path='yolov8n.pt'):
        self.model = YOLO(model_path)
        self.model.fuse()
        self.target_classes = [24, 26, 28]  # Bag-related classes

    def process_frame(self, frame):
        frame_resized = cv2.resize(frame, (640, 360))
        results = self.model(frame_resized, conf=0.3, iou=0.5, max_det=5)

        for result in results[0].boxes:
            cls = int(result.cls[0])
            conf = result.conf[0].item()
            if cls in self.target_classes and conf > 0.3:
                x1, y1, x2, y2 = map(int, result.xyxy[0])
                color = (0, 255, 0)
                cv2.rectangle(frame_resized, (x1, y1), (x2, y2), color, 2)
                label = f"{self.model.names[cls]} ({conf:.2f})"
                cv2.putText(frame_resized, label, (x1, y1-10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        return frame_resized

def gen_frames():
    cap = cv2.VideoCapture("http://192.168.244.14:4747/video")
    tracker = RealTimeObjectTracker()

    while True:
        success, frame = cap.read()
        if not success:
            break

        processed_frame = tracker.process_frame(frame)
        ret, buffer = cv2.imencode('.jpg', processed_frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

def video_feed(request):
    return StreamingHttpResponse(gen_frames(),
                                 content_type='multipart/x-mixed-replace; boundary=frame')

def video_page(request):
    return render(request, 'video.html')
