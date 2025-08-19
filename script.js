// カメラ起動
const video = document.getElementById("camera");
const captureBtn = document.getElementById("captureBtn");
const canvas = document.getElementById("canvas");
const resultImg = document.getElementById("result");

const charImg = new Image();
charImg.src = "imgs/deoki_trans.png";

// キャラクター画像のロード完了フラグ
let charLoaded = false;
character.onload = () => { charLoaded = true; };

navigator.mediaDevices.getUserMedia({ video: {facingMode:"environment"} })
  .then(stream => {
    video.srcObject = stream;
    video.onloadedmetadata = () => { // ios対策　明示的に呼び出す
        video.play().catch(err => {
            console.error("自動再生エラー:", err);
        });
    };
  })
  .catch(err => {
    console.error("カメラを起動できません:", err);
  });

// canvas描画
function render() {
    const ctx = canvas.getContext("2d");
    // canvasをvideoサイズに合わせる
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // カメラ映像
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // キャラクター重ね描き
    if (charLoaded) {
        const charW = 100;
        const charH = charImg.naturalHeight / charImg.naturalWidth * charW;
        const posX = (canvas.width - charW) / 2;
        const posY = (canvas.height - charH) / 2;
        ctx.drawImage(charImg, posX, posY, charW, charH);
    }

    requestAnimationFrame(render);
}

// video準備できたら描画開始
video.addEventListener("play", () => {
    render();
});

// シャッター処理
captureBtn.addEventListener("click", () => {
    if (!charLoaded) {
        alert("キャラクター画像が読み込まれていません．少し待ってからもう一度押してくださいね！");
        return;
    }

  // const ctx = canvas.getContext("2d");

  // canvasサイズをvideoと合わせる
  // const videoRect = video.getBoundingClientRect();
  // canvas.width = videoRect.width;
  // canvas.height = videoRect.height;
  //canvas.width = video.videoWidth;
  //canvas.height = video.videoHeight;

  // 1. カメラ映像を描画
  // ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // 2. キャラ画像を重ねる(naturalWidth/Heightを使う)
  // const scale = 1;
  // const charW = character.naturalWidth * scale;
  // const charH = character.naturalHeight * scale;
  //const charRect = character.getBoundingClientRect();
  //const charW = charRect.width;
  //const charH = charRect.height;
  //const scaleX = canvas.width / videoRect.width * 3;
  //const scaleY = canvas.height / videoRect.height * 3;

  //const posX = charRect.left - videoRect.left * scaleX;
  //const posY = charRect.top - videoRect.top * scaleY;
  //const charW_scaled = charW * scaleX;
  //const charH_scaled = charH * scaleY;

  //ctx.drawImage(character, posX, posY, charW_scaled, charH_scaled);

  // 3. JPEGに変換して保存用URLを作成
  const dataURL = canvas.toDataURL("image/jpeg", 1.0);

  // ページ内プレビュー
  resultImg.src = dataURL;

  // 新しいtab表示
  const win = window.open();
  win.document.write(`
    <html>
        <head><title>保存用画像</title></head>
        <body style=":margin:0;display:flex;justify-content:center;align-items:center;background:#000;">
            <img src="${dataURL}" style="width:auto;height:auto;object-fit:contain;">
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