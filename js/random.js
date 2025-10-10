document.getElementById('btnRandom').onclick = () => {
  if (!allMovies.length) return setText('randomResult', "リストが空です");

  const status = document.getElementById('filterStatus').value;
  const genre = document.getElementById('filterGenre').value;
  let filtered = allMovies;

  if (status) filtered = filtered.filter(m => m.status === status);
  if (genre) filtered = filtered.filter(m => m.genre === genre);

  if (!filtered.length) return setText('randomResult', "条件に合う映画がありません");

  const pick = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById('randomResult').innerHTML =
    `👉 <a href="${pick.url || '#'}" target="_blank">${pick.title}</a> [${pick.status || ''}]`;
};
