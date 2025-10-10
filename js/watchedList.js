async function loadWatched() {
  const api = getAPI();
  if (!api) return setText('watchedList', "API未設定");
  const data = await getJSON(api + '?action=watchedList');
  if (!data) return setText('watchedList', "読み込み失敗");

  renderWatchedList(data);
}
