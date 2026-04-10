// 要素の取得（idで取得することで確実に反応させます）
const el = document.getElementById('example1');
const addContainer = document.querySelector('.addcontainer');
const addBtn = document.querySelector('.add-btn');
const confirmBtn = document.getElementById('confirm-btn'); // idで取得
const searchInput = document.getElementById('search-input'); // idで取得

let isConfirmed = false;



// --- ＋ボタンクリック時の処理 ---
addBtn.addEventListener('click', () => {
    // 1. その時の入力値を取得
    const cityName = searchInput.value.trim();
    const detailAddress = addressInput.value.trim(); // 確定した住所を取得

    // 2. 確定状態と入力値のチェック
    if (!isConfirmed || !cityName || !detailAddress) {
        alert('地名と住所を入力・確定させてください');
        return;
    }
    // 【解除：パネルを引っ込める】
    mapPanel.classList.remove('is-visible'); // スライドアウト！
    // 新しい要素の作成
    const newContainer = document.createElement('div');
    newContainer.className = 'container';
    newContainer.setAttribute('data-city', cityName); // 地名を data 属性に保存
    newContainer.setAttribute('data-address', detailAddress); // 住所を data 属性に保存
    newContainer.innerHTML = `
        <div class="item element-0"></div>
        <div class="item element-a">
            <button class="toggle-btn">
                <span class="icon">🚶</span> <span class="text">徒歩</span>
            </button>
        </div>
        <div class="item element-b">
            ${cityName}
        </div>
        <div class="item element-c">
            <button class="hamburger" aria-label="メニューを開く">
                <span></span><span></span><span></span>
            </button>
            <span class="close-icon">×</span>
        </div>
    `;

    // これまでの insertBefore を appendChild に書き換え
    // これにより、#example1 内の物理的な一番最後に追加されます
    el.appendChild(newContainer);
    
    // 連番更新
    updateIndices();

    // 入力欄とボタンの状態を完全リセット
    searchInput.value = '';
    searchInput.readOnly = false;
    isConfirmed = false;
    confirmBtn.textContent = "地名確定";
    confirmBtn.style.backgroundColor = "#28a745";

    // ...要素追加の処理...
    mapMarker.style.display = 'none'; // ピンも隠す
    mapPanel.classList.remove('is-visible'); // パネルを閉じる
    addressInput.value = ''; // 住所入力もリセット

    // 要素を追加した後に実行(画面を追加した要素が見えるようにスクロール)
    setTimeout(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }, 100); // 描画完了を待つために少しだけ遅延させると確実です
});

// 連番更新用関数
function updateIndices() {
    const items = el.querySelectorAll('.element-0');
    items.forEach((item, index) => {
        item.textContent = index + 1;
    });
}

// --- Sortable.js の設定（前回の続き） ---
Sortable.create(el, {
    handle: '.hamburger',
    animation: 200,
    filter: '.addcontainer',
    preventOnFilter: false,
    onMove: function (evt) {
        return !evt.related.classList.contains('addcontainer');
    },
    onEnd: function () {
        updateIndices(); // 並び替え後も連番を更新
    }
});

// リスト内のクリックイベントを監視
el.addEventListener('click', (e) => {
    // クリックされた要素が close-icon クラスを持っているか確認
    if (e.target.classList.contains('close-icon')) {
        
        // 削除の確認（必要なければ if 文の中身だけにしてください）
        if (confirm('この項目を削除しますか？')) {
            // クリックされた「×」から一番近い親の .container を探して削除
            const targetContainer = e.target.closest('.container');
            if (targetContainer) {
                targetContainer.remove();
                
                // 削除した後に、残った要素の連番（まる1, まる2...）を振り直す
                updateIndices();
            }
        }
    }
});


document.querySelectorAll('.container').forEach((el, index) => {
  // すでに中身がある場合はスキップ
  if (el.innerHTML.trim() !== "") return;

  // HTML構造を定義（連番は index + 1 で自動付与）
  el.innerHTML = `
    <div class="item element-0">${index + 1}</div>
    <div class="item element-a">
        <button class="toggle-btn">
            <span class="icon">🚶</span> <span class="text">徒歩</span>
        </button>
    </div>
    <div class="item element-b">
        行先
    </div>
    <div class="item element-c">
        <button class="hamburger" aria-label="メニューを開く">
            <span></span>
            <span></span>
            <span></span>
        </button>
        <span class="close-icon">×</span>
    </div>
  `;
});

// --- 以降、前述の「徒歩/車」切り替えなどのイベント処理 ---
document.getElementById('example1').addEventListener('click', (e) => {
  const btn = e.target.closest('.toggle-btn');
  if (!btn) return;

  const textEl = btn.querySelector('.text');
  const iconEl = btn.querySelector('.icon');

  if (textEl.textContent.trim() === '徒歩') {
    textEl.textContent = '車';
    iconEl.textContent = '🚗';
    btn.classList.add('is-car');
  } else {
    textEl.textContent = '徒歩';
    iconEl.textContent = '🚶';
    btn.classList.remove('is-car');
  }
});




const mapPanel = document.getElementById('map-panel');
const addressInput = document.getElementById('address-input');

// --- 地名確定 / 解除 ボタンの処理内を修正 ---
confirmBtn.addEventListener('click', function() {
    const cityName = searchInput.value.trim();
    if (!cityName) { alert('地名を入力してください'); return; }

    if (!isConfirmed) {
        // 【確定：パネルを出す】
        isConfirmed = true;
        this.textContent = "地名確定解除";
        this.style.backgroundColor = "#dc3545";
        searchInput.readOnly = true;
        
        mapPanel.classList.add('is-visible'); // スライドイン！
    } else {
        // 【解除：パネルを引っ込める】
        isConfirmed = false;
        this.textContent = "地名確定";
        this.style.backgroundColor = "#28a745";
        searchInput.readOnly = false;
        
        mapPanel.classList.remove('is-visible'); // スライドアウト！
    }
});





const mapClickArea = document.getElementById('map-click-area');
const mapMarker = document.getElementById('map-marker');


mapClickArea.addEventListener('click', (e) => {
    // 1. クリックされた位置（座標）を取得
    const rect = mapClickArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 2. ピンの位置を更新して表示
    mapMarker.style.left = `${x}px`;
    mapMarker.style.top = `${y}px`;
    mapMarker.style.display = 'block';

    // 3. 住所を自動取得（本来はここでAPIを叩く）
    // 今回はデモとして、入力された地名 + 座標に基づいた住所を生成
    const cityName = document.getElementById('search-input').value;
    const dummyAddress = `${cityName}市 中央区 1-${Math.floor(x/10)}-${Math.floor(y/10)}`;
    
    addressInput.value = dummyAddress;
});