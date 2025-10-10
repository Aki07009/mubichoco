document.getElementById('addForm').onsubmit = async (e) => {
  e.preventDefault();
  const api = getAPI();
  if (!api) return setText('addMsg', "API未設定");

  const title = document.getElementById('title').value;
  const url = document.getElementById('url').value;
  const status = document.getElementById('status').value;
  const genre = document.getElementById('genre').value;

  await getJSON(`${api}?action=add&title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&status=${encodeURIComponent(status)}&genre=${encodeURIComponent(genre)}`);
  setText('addMsg', "✅ 追加されました！");
  document.getElementById('addForm').reset();
  loadWant();
};
