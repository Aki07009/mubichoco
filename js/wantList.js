let allMovies = [];

async function loadWant() {
  const api = getAPI();
  if (!api) return setText('wantList', "API未設定");
  const data = await getJSON(api + '?action=list');
  if (!data) return setText('wantList', "読み込み失敗");

  allMovies = data;
  renderWantList(data);
}

function renderWantList(data) {
  // ジャンル分類など元の処理をここへ移す
}
