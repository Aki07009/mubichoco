let API = localStorage.getItem('mubichoco_api') || '';

async function getJSON(url) {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

function setAPI(url) {
  localStorage.setItem('mubichoco_api', url);
  API = url;
}

function getAPI() {
  return API;
}

