
// ---------- Configuración inicial ----------
const ADMIN_PASS = "130991"; // <- Clave por defecto para acceso admin (local)
const STORAGE_KEYS = { POSTS: "wj_posts_v1" };

// Util: mostrar toast
function showToast(msg, timeout = 2500) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  setTimeout(()=> t.classList.add("hidden"), timeout);
}

// ---------- Manejo localStorage para posteos ----------
function loadPosts() {
  const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
  return raw ? JSON.parse(raw) : [];
}
function savePosts(posts) {
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
}

// ---------- Render posteoss ----------
function renderPosts() {
  const container = document.getElementById("posts-container");
  const posts = loadPosts();
  container.innerHTML = "";

  if (posts.length === 0) {
    container.innerHTML = `<div class="post card"><div class="content"><h2>No hay entradas aún</h2><p>El administrador publicará temas pronto.</p></div></div>`;
    return;
  }

  // posts in reverse chronological (last first)
  posts.slice().reverse().forEach(post => {
    const article = document.createElement("article");
    article.className = "post card";

    const banner = document.createElement("img");
    banner.className = "banner";
    banner.src = post.banner || "imagenes/Roary_portadaBlog.png";
    article.appendChild(banner);

    const content = document.createElement("div");
    content.className = "content";

    const h2 = document.createElement("h2");
    h2.textContent = post.title;
    content.appendChild(h2);

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `Publicado: ${new Date(post.date).toLocaleString()}`;
    content.appendChild(meta);

    const p = document.createElement("p");
    p.innerHTML = post.body.replace(/\n/g, "<br>");
    content.appendChild(p);

    const commentsWrap = document.createElement("div");
    commentsWrap.className = "comments";

    //content.appendChild(commentsWrap);
    article.appendChild(content);
    container.appendChild(article);
  });
}

// ---------- escape simple ----------
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(m){ return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; });
}

// ---------- Admin login ----------
document.getElementById("btn-admin-login").addEventListener("click", () => {
  const pass = document.getElementById("admin-pass").value;
  if (pass === ADMIN_PASS) {
    document.getElementById("admin-panel").classList.remove("hidden");
    showToast("Acceso de administrador concedido");
  } else showToast("Clave incorrecta");
});

document.getElementById("btn-logout-admin").addEventListener("click", () => {
  document.getElementById("admin-panel").classList.add("hidden");
});

// ---------- Crear post (admin) ----------
document.getElementById("btn-create-post").addEventListener("click", () => {
  const title = document.getElementById("post-title").value.trim();
  const banner = document.getElementById("post-banner-url").value.trim();
  const body = document.getElementById("post-body").value.trim();
  if (!title || !body) { showToast("Título y contenido son obligatorios"); return; }
  const posts = loadPosts();
  const post = {
    id: "p_" + Date.now(),
    title,
    banner: banner || "",
    body,
    date: new Date().toISOString(),
    comments: []
  };
  posts.push(post);
  savePosts(posts);
  // limpiar campos
  document.getElementById("post-title").value = "";
  document.getElementById("post-body").value = "";
  document.getElementById("post-banner-url").value = "";
  renderPosts();
  showToast("Entrada publicada");
});

// ---------- inicializar demo si no hay posts ----------
(function initDemo(){
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    const demo = [{
      id:"p_demo_1",
      title:"Bienvenidos al Blog Jumper",
      banner:"",
      body:"Este espacio está creado para compartir reflexiones, actividades y recursos para jóvenes. El administrador puede publicar entradas desde el panel.",
      date:new Date().toISOString(),
      comments:[]
    }];
    savePosts(demo);
  }
})();

// ---------- inicialización UI ----------
renderPosts();