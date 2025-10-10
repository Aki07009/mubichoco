function setText(id, text) {
  document.getElementById(id).innerText = text;
}

// タブ切り替え
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tabContent').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// API設定
document.getElementById('saveApi').onclick = () => {
  const val = document.getElementById('apiUrlInput').value.trim();
  if (!val) return;
  setAPI(val);
  setText('saveMsg', "✅ 保存しました");
  loadWant();
  loadWatched();
};

// 初期化
document.getElementById('apiUrlInput').value = getAPI();
if (getAPI()) {
  loadWant();
  loadWatched();
}
