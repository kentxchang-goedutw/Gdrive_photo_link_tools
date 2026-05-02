/**
 * photo.js
 * [v7] 新增：鍵盤左右方向鍵切換圖片、全螢幕按鈕。
 * 基於 Swiper.js 函式庫，包含可收合工具列、縮圖列、大圖預覽。
 * @param {string[]} imageUrls - 提取到的圖片網址陣列。
 */
function generateSlideshowHtml(imageUrls) {
    if (typeof showStatus !== 'function') {
        console.error("錯誤: HTML 中缺少 showStatus 函式。");
        alert('程式碼錯誤：缺少狀態顯示函式 (showStatus)。');
        return;
    }

    if (!imageUrls || imageUrls.length === 0) {
        showStatus('相簿生成失敗！請先提取圖片網址。', 'error');
        return;
    }

    let mainSlidesHtml = '';
    imageUrls.forEach(src => {
        mainSlidesHtml += `
            <div class="swiper-slide">
                <img src="${src}" onclick="openModal('${src}')" />
            </div>`;
    });

    let thumbSlidesHtml = '';
    imageUrls.forEach(src => {
        thumbSlidesHtml += `
            <div class="swiper-slide">
                <img src="${src}" />
            </div>`;
    });

    const slideshowHtml = `
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Swiper.js 專業圖片相簿 (阿剛老師版)</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <style>
        html, body {
            position: relative;
            height: 100%;
            margin: 0;
            padding: 0;
            font-family: sans-serif;
            background-color: #000;
            overflow: hidden;
        }
        body {
            display: flex;
            flex-direction: column;
        }
        .swiper-container-wrapper {
            width: 100%;
            height: calc(100% - 100px);
            position: relative;
            overflow: hidden;
        }
        .swiper { width: 100%; height: 100%; }
        .swiper-slide {
            display: flex;
            justify-content: center;
            align-items: center;
            background: #000;
        }
        .swiper-slide img {
            display: block;
            width: auto;
            height: auto;
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            cursor: pointer;
        }
        .swiper-thumbs { height: 100px; box-sizing: border-box; padding: 10px 0; }
        .swiper-thumbs .swiper-slide { width: 80px; height: 80px; opacity: 0.5; transition: opacity 0.3s; cursor: pointer !important; }
        .swiper-thumbs .swiper-slide-thumb-active { opacity: 1; border: 3px solid #f7a738; }
        .swiper-thumbs .swiper-slide img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }

        .swiper-button-next, .swiper-button-prev { color: #ffffff; opacity: 0.7; transition: opacity 0.3s; }
        .swiper-button-next:hover, .swiper-button-prev:hover { opacity: 1; }

        .floating-btn {
            position: absolute;
            right: 15px;
            width: 50px;
            height: 50px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            border: 1px solid white;
            border-radius: 50%;
            font-size: 22px;
            cursor: pointer;
            z-index: 100;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: background-color 0.3s, transform 0.3s;
        }
        .floating-btn:hover { background-color: rgba(255, 255, 255, 0.2); }

        #controls-toggle { bottom: 115px; }
        #controls-toggle.is-open { transform: rotate(90deg); }
        #fullscreen-btn { bottom: 175px; }

        .control-bar {
            position: absolute;
            bottom: 0;
            width: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
            z-index: 50;
            box-sizing: border-box;
            transform: translateY(100%);
            transition: transform 0.4s ease-in-out;
        }
        .control-bar.is-open { transform: translateY(0); }
        .control-bar label, .control-bar button, .control-bar input, .control-bar select {
            font-size: 14px;
            color: #fff;
            background-color: rgba(0,0,0,0.4);
            border: 1px solid #fff;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .control-bar button:hover, .control-bar select:hover, .control-bar input:hover { background-color: rgba(255, 255, 255, 0.2); }
        .control-bar select option { background-color: #333; color: white; }

        .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.95); align-items: center; justify-content: center; }
        .modal-content { max-width: 90%; max-height: 90%; object-fit: contain; }
        .close { position: absolute; top: 10px; right: 25px; color: #fff; font-size: 50px; cursor: pointer; }

        .watermark {
            position: fixed;
            bottom: 15px;
            left: 15px;
            background-color: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            z-index: 90;
            pointer-events: none;
        }

        .key-hint {
            position: fixed;
            bottom: 115px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(255,255,255,0.12);
            color: rgba(255,255,255,0.5);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            z-index: 90;
            pointer-events: none;
            letter-spacing: 0.05em;
        }
    </style>
</head>
<body>
    <div class="swiper-container-wrapper">
        <div class="swiper swiper-main">
            <div class="swiper-wrapper">${mainSlidesHtml}</div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
        </div>
        <div class="control-bar" id="control-bar">
            <label for="transition-select">轉場效果:</label>
            <select id="transition-select" onchange="updateTransition()">
                <option value="slide">滑動 (Slide)</option>
                <option value="fade">淡入淡出 (Fade)</option>
                <option value="coverflow">封面流 (Coverflow)</option>
                <option value="cube">方塊 (Cube)</option>
                <option value="flip">翻轉 (Flip)</option>
            </select>
            <label for="interval-input">間隔(秒):</label>
            <input type="number" id="interval-input" value="5" min="1" max="60" onchange="updateInterval()">
            <button id="stop-button" onclick="stopSlideshow()">⏹️ 停止</button>
            <button id="start-button" onclick="startSlideshow()">▶️ 開始</button>
        </div>
        <button id="fullscreen-btn" class="floating-btn" onclick="toggleFullscreen()" title="全螢幕">⛶</button>
        <button id="controls-toggle" class="floating-btn" title="開啟設定">⚙️</button>
    </div>

    <div class="swiper swiper-thumbs">
        <div class="swiper-wrapper">${thumbSlidesHtml}</div>
    </div>

    <div class="watermark">Made by 阿剛老師</div>
    <div class="key-hint">← → 鍵盤切換</div>

    <div id="myModal" class="modal">
        <span class="close" id="modalClose">&times;</span>
        <img class="modal-content" id="img01">
    </div>

<script>
    let mainSwiper;
    let thumbsSwiper;
    const imageUrls = ${'[' + imageUrls.map(url => `'${url}'`).join(',') + ']'};

    function initSwiper(effect = 'slide') {
        if (mainSwiper) mainSwiper.destroy(true, true);

        thumbsSwiper = new Swiper('.swiper-thumbs', {
            spaceBetween: 10,
            slidesPerView: 'auto',
            freeMode: true,
            watchSlidesProgress: true,
        });

        mainSwiper = new Swiper('.swiper-main', {
            effect: effect,
            grabCursor: true,
            cubeEffect: { shadow: true, slideShadows: true, shadowOffset: 20, shadowScale: 0.94 },
            coverflowEffect: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true },
            autoplay: {
                delay: parseInt(document.getElementById('interval-input').value, 10) * 1000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            thumbs: { swiper: thumbsSwiper },
            loop: imageUrls.length > 1,
        });
    }

    function startSlideshow() {
        if (!mainSwiper) return;
        mainSwiper.autoplay.start();
        document.getElementById('stop-button').style.backgroundColor = '';
        document.getElementById('start-button').style.backgroundColor = 'green';
    }

    function stopSlideshow() {
        if (!mainSwiper) return;
        mainSwiper.autoplay.stop();
        document.getElementById('stop-button').style.backgroundColor = 'red';
        document.getElementById('start-button').style.backgroundColor = '';
    }

    function updateInterval() {
        if (!mainSwiper) return;
        const seconds = parseInt(document.getElementById('interval-input').value, 10);
        if (seconds >= 1 && seconds <= 60) {
            mainSwiper.params.autoplay.delay = seconds * 1000;
            if (mainSwiper.autoplay.running) {
                mainSwiper.autoplay.stop();
                mainSwiper.autoplay.start();
            }
        } else {
            alert('間隔時間必須在 1 到 60 秒之間！');
            document.getElementById('interval-input').value = mainSwiper.params.autoplay.delay / 1000;
        }
    }

    function updateTransition() {
        const selectedEffect = document.getElementById('transition-select').value;
        initSwiper(selectedEffect);
        startSlideshow();
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    document.addEventListener('fullscreenchange', () => {
        const btn = document.getElementById('fullscreen-btn');
        btn.textContent = document.fullscreenElement ? '✕' : '⛶';
        btn.title = document.fullscreenElement ? '離開全螢幕' : '全螢幕';
    });

    const modal = document.getElementById('myModal');
    const modalImg = document.getElementById('img01');
    const closeModal = document.getElementById('modalClose');

    function openModal(src) {
        stopSlideshow();
        modal.style.display = 'flex';
        modalImg.src = src;
    }
    closeModal.onclick = () => { modal.style.display = 'none'; startSlideshow(); };
    modal.onclick = (event) => {
        if (event.target !== modalImg) {
            modal.style.display = 'none';
            startSlideshow();
        }
    };

    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            if (e.key === 'Escape') { modal.style.display = 'none'; startSlideshow(); }
            return;
        }
        if (e.key === 'ArrowRight') { mainSwiper && mainSwiper.slideNext(); }
        if (e.key === 'ArrowLeft')  { mainSwiper && mainSwiper.slidePrev(); }
    });

    document.addEventListener('DOMContentLoaded', () => {
        if (imageUrls.length > 0) {
            initSwiper('slide');
            startSlideshow();

            const toggleButton = document.getElementById('controls-toggle');
            const controlBar = document.getElementById('control-bar');
            toggleButton.addEventListener('click', () => {
                controlBar.classList.toggle('is-open');
                toggleButton.classList.toggle('is-open');
            });
        } else {
            document.body.innerHTML = '<h2 style="color:white; text-align:center;">相簿沒有圖片！</h2>';
        }
    });
</script>
</body>
</html>
    `;

    const blob = new Blob([slideshowHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'slideshow_final.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showStatus('相簿已下載！支援鍵盤左右鍵切換與全螢幕。', 'success');
}
