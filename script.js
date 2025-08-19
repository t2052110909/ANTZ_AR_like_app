// カメラ起動
const video = document.getElementById("camera");
const captureBtn = document.getElementById("captureBtn");
const canvas = document.getElementById("canvas");
const resultImg = document.getElementById("result");
const character = document.getElementById("character");

navigator.mediaDevices.getUserMedia({ video: {facingMode:"environment"} })
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
captureBtn.addEventListener("click", () => {
  const ctx = canvas.getContext("2d");

  // canvasサイズをvideoと合わせる
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // 1. カメラ映像を描画
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // 2. キャラ画像を重ねる(naturalWidth/Heightを使う)
  const scale = 3;
  ctx.drawImage(character, 
                50, 50,
                character.naturalwidth * scale,
                character.naturalheight * scale
            );

  // 3. JPEGに変換して保存用URLを作成
  const dataURL = canvas.toDataURL("image/jpeg", 0.9);
  resultImg.src = dataURL;

  const win = window.open();
  win.document.write(`
    <html>
        <head><title>保存用画像</title></head>
        <body style=:margin:0;display:flex;justify-content:center;align-items:center;background:#000;">
            <img src="${dataURL}" style="max-width:100%;max-height:100vh;object-fit:contain;">
        </body>
    </html>
    `);
  //win.document.write(`<img src="${dataURL}" style="width:100%">`)
  win.document.close();

});

  /*// ダウンロードリンクとして保存する場合：
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "capture.png";
  link.click();
});*/