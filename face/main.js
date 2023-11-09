window.addEventListener('DOMContentLoaded', (event) => {
  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
  ]).then(start); // 모델 로드가 완료되면 start 함수 호출

  function start() {
    // 업로드한 이미지에서 얼굴 감지 및 시각화
    function detectAndDrawFaces(imgElement) {
      // 캔버스 생성
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');

      // 이미지 크기에 맞게 캔버스 설정
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;

      // 캔버스에 이미지 그리기
      context.drawImage(imgElement, 0, 0);

      // 얼굴 감지
      faceapi.detectAllFaces(imgElement)
        .then(function (faces) {
          // 감지된 얼굴 처리
          if (faces.length > 0) {
            console.log('업로드한 이미지에서 얼굴을 감지했습니다.');
            
            // 감지된 얼굴에 대해 사각형 그리기
            faces.forEach((face) => {
              var { x, y, width, height } = face.box;

              context.lineWidth = 2;
              context.strokeStyle = 'red';
              context.fillStyle = 'red';
              context.fillRect(x, y, width, height);
              context.strokeRect(x, y, width, height);

              // 얼굴 랜드마크 표시
              faceapi.draw.drawFaceLandmarks(canvas, face.landmarks, { drawLines: true });
            });
            
            // 캔버스를 이미지 요소로 교체
            imgElement.parentNode.replaceChild(canvas, imgElement);
          } else {
            console.log('업로드한 이미지에서 얼굴을 찾을 수 없습니다.');
          }
        })
        .catch(function (error) {
          console.log('얼굴 감지 중에 오류가 발생했습니다.', error);
        });
    }

    // 이미지 업로드 후 호출되는 함수
    function showImage(event) {
      var input = event.target;
      var reader = new FileReader();

      reader.onload = function() {
        var imgElement = document.getElementById('preview');
        imgElement.src = reader.result;

        // 업로드한 이미지에서 얼굴 감지 및 시각화
        detectAndDrawFaces(imgElement);
      };

      reader.readAsDataURL(input.files[0]);
    }

    // 이미지 업로드 이벤트 리스너
   var uploadInput = document.getElementById('upload-input');
   uploadInput.addEventListener('change', showImage);

    }
    });