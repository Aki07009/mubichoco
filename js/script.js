let API = localStorage.getItem('mubichoco_api') || '';
let allMovies = [];

// ステータス表示
function setStatus(msg){ document.getElementById('addMsg').innerText = msg; }
async function getJSON(url){ try { return await (await fetch(url)).json(); } catch(e){ console.error(e); return null; } }

// 観たいリスト
async function loadWant(){
  if(!API){ document.getElementById('wantList').innerText="API未設定"; return; }
  const data = await getJSON(API+'?action=list');
  if(!data){ document.getElementById('wantList').innerText="読み込み失敗"; return; }
  allMovies = data;

  const genreSelect = document.getElementById('filterGenre');
  const genres = Array.from(new Set(data.map(m=>m.genre||"未分類")));
  genreSelect.innerHTML = '<option value="">全部</option>';
  genres.forEach(g=>{ genreSelect.innerHTML += `<option value="${g}">${g}</option>`; });

  const grouped = {};
  data.forEach(m => {
    const g = m.genre || "未分類";
    if(!grouped[g]) grouped[g]=[];
    grouped[g].push(m);
  });

  const container=document.getElementById('wantList');
  container.innerHTML='';
  const colors=["#d6f0ff","#d6f5ff","#d6ffd8","#fff3d6","#e0f5ff","#e0f0ff"];
  let colorIndex=0;

  Object.keys(grouped).forEach(g=>{
    const block=document.createElement('div');
    block.className='genre-block';
    block.style.background=colors[colorIndex%colors.length];
    colorIndex++;
    block.innerHTML=`<h3>${g}</h3>`;

    const cardsContainer = document.createElement('div');
    cardsContainer.className='cards-container';

    grouped[g].forEach(m=>{
      const d=document.createElement('div');
      d.className='movie';

      const paidLabel = m.status==='有料' ? '<div class="paid-label">💰</div>' : '';

      d.innerHTML = `
        ${paidLabel}
        ${m.poster ? `<img src="${m.poster}" alt="${m.title}"><div class="no-image" style="display:none">No image</div>` 
                    : `<div class="no-image">No image</div>`}
        <div class="title-hover">${m.title}</div>
        <button>観た！</button>
      `;

      const img = d.querySelector('img');
      const noImg = d.querySelector('.no-image');
      if(img) img.onerror = ()=>{ img.style.display='none'; noImg.style.display='flex'; };

      d.querySelector('button').onclick=async()=>{
        await getJSON(API+`?action=watched&title=${encodeURIComponent(m.title)}`);
        loadWant(); loadWatched();
      };

      cardsContainer.appendChild(d);
    });

    block.appendChild(cardsContainer);
    container.appendChild(block);
  });
}

// 観たリスト
async function loadWatched(){
  if(!API){ document.getElementById('watchedList').innerText="API未設定"; return; }
  const data = await getJSON(API+'?action=watchedList');
  if(!data){ document.getElementById('watchedList').innerText="読み込み失敗"; return; }

  const container = document.getElementById('watchedList');
  container.innerHTML = '';

  data.forEach(m => {
    const d = document.createElement('div');
    d.className = 'movie';

    const paidLabel = m.status==='有料' ? '<div class="paid-label">💰</div>' : '';

    d.innerHTML = `
      ${paidLabel}
      ${m.poster ? `<img src="${m.poster}" alt="${m.title}"><div class="no-image" style="display:none">No image</div>` 
                  : `<div class="no-image">No image</div>`}
      <div class="title-hover">${m.title}</div>
      <div class="status-label">観た日: ${m.watchedDate ? new Date(m.watchedDate).toLocaleDateString() : ''}</div>
    `;

    const img = d.querySelector('img');
    const noImg = d.querySelector('.no-image');
    if(img) img.onerror = ()=>{ img.style.display='none'; noImg.style.display='flex'; };

    container.appendChild(d);
  });
}

// ランダム
document.getElementById('btnRandom').onclick = () => {
  if(!allMovies.length){ document.getElementById('randomResult').innerText="リストが空です"; return; }
  const statusFilter = document.getElementById('filterStatus').value;
  const genreFilter = document.getElementById('filterGenre').value;
  let filtered = allMovies;
  if(statusFilter) filtered = filtered.filter(m => m.status === statusFilter);
  if(genreFilter) filtered = filtered.filter(m => m.genre === genreFilter);
  if(!filtered.length){ document.getElementById('randomResult').innerText="条件に合う映画がありません"; return; }
  const choice = filtered[Math.floor(Math.random()*filtered.length)];
  document.getElementById('randomResult').innerHTML = `👉 <a href="${choice.url||'#'}" target="_blank">${choice.title}</a> [${choice.status||''}]`;
};

// 追加
document.getElementById('addForm').onsubmit=async(e)=>{
  e.preventDefault();
  if(!API){ setStatus("API未設定"); return; }
  const title=document.getElementById('title').value;
  const url=document.getElementById('url').value;
  const status=document.getElementById('status').value;
  const genre=document.getElementById('genre').value;
  await getJSON(API+`?action=add&title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&status=${encodeURIComponent(status)}&genre=${encodeURIComponent(genre)}`);
  setStatus("✅ 追加されました！");
  document.getElementById('addForm').reset();
  loadWant();
};

// API保存
document.getElementById('saveApi').onclick=()=>{
  const val=document.getElementById('apiUrlInput').value.trim();
  if(val){
    localStorage.setItem('mubichoco_api',val);
    API=val;
    document.getElementById('saveMsg').innerText="✅ 保存しました";
    loadWant(); loadWatched();
  }
};

// タブ切替
document.querySelectorAll('.tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    const target=tab.dataset.tab;
    document.querySelectorAll('.tabContent').forEach(c=>c.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});

document.getElementById('apiUrlInput').value=API;
if(API){ loadWant(); loadWatched(); }
