import QrCodeReader from 'qrcode-reader';

const qrCodeReader = new QrCodeReader();
const qrCodeContainer = document.querySelector('.qr-code-container');
const qrCodeImg = qrCodeContainer.querySelector('img');
const qrCodeCanvas = qrCodeContainer.querySelector('canvas');
const readQRCodeButton = document.querySelector('#read-qr-code-button');

readQRCodeButton.addEventListener('click', async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
  const video = document.createElement('video');
  video.srcObject = stream;
  video.setAttribute('playinline', true);
  video.play();

  const qrCode = new Promise((resolve) => {
    const tick = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        qrCodeCanvas.height = video.videoHeight;
        qrCodeCanvas.width = video.videoWidth;
        qrCodeCanvas.getContext('2d').drawImage(video, 0, 0, qrCodeCanvas.width, qrCodeCanvas.height);
        const imageData = qrCodeCanvas.getContext('2d').getImageData(0, 0, qrCodeCanvas.width, qrCodeCanvas.height);
        const code = qrCodeReader.decode(imageData.data, imageData.width, imageData.height);
        if (code) {
          qrCodeReader.clear();
          video.srcObject.getTracks().forEach(track => track.stop());
          qrCodeImg.src = code;
          window.open(code, '_blank');
          resolve();
        }
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  });

  qrCode.then(() => {
    qrCodeContainer.classList.remove('active');
  });

  qrCodeContainer.classList.add('active');
});