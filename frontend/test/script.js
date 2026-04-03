// 地図の初期化（新宿駅周辺を例に）
const map = L.map('map').setView([35.6895, 139.6917], 15);

// OpenStreetMapタイルの追加
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // OSMの著作権表示（必須項目！）
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);