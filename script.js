// カメラ起動
const video = document.getElementById("camera");
navigator.mediaDevices.getUserMedia({ video: {facingMode:"user"} })
  .then(stream => {
    video.srcObject = stream;
    // iOS対策：明示的に再生を呼び出す
    video.onloadmetadata = () => {
        video.play().catch(err => {
            console.error("自動再生エラー:", err);
        });
    };
  })
  .catch(err => {
    console.error("カメラを起動できません:", err);
  });

// シャッター処理
const captureBtn = document.getElementById("captureBtn");
const canvas = document.getElementById("canvas");
const resultImg = document.getElementById("result");
const character = document.getElementById("character");

captureBtn.addEventListener("click", () => {
  const ctx = canvas.getContext("2d");

  // canvasサイズをvideoと合わせる
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // 1. カメラ映像を描画
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // 2. キャラ画像を重ねる
  ctx.drawImage(character, 20, 20, character.width, character.height);

  // 3. PNG画像として保存
  const dataURL = canvas.toDataURL("image/png");
  resultImg.src = dataURL;

  // ダウンロードリンクとして保存する場合：
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "capture.png";
  link.click();
});