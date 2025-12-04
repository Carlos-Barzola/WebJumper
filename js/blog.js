/* js/blog.js
   Blog local: posts, usuarios y comentarios en localStorage
*/

// ---------- Configuración inicial ----------
const ADMIN_PASS = "130991"; // <- cámbiala por la clave que prefieras (local only)
const STORAGE_KEYS = { POSTS: "wj_posts_v1", USERS: "wj_users_v1", SESSION: "wj_session_v1" };

// Util: mostrar toast
function showToast(msg, timeout = 2500) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  setTimeout(()=> t.classList.add("hidden"), timeout);
}

// ---------- Manejo localStorage ----------
function loadPosts() {
  const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
  return raw ? JSON.parse(raw) : [];
}
function savePosts(posts) {
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
}
function loadUsers() {
  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  return raw ? JSON.parse(raw) : [];
}
function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}
function getSession() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || "null");
}
function setSession(userObj) {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(userObj));
}
function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

// ---------- Render posts ----------
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

    // comments area
    const commentsWrap = document.createElement("div");
    commentsWrap.className = "comments";

    // existing comments
    if (post.comments && post.comments.length) {
      post.comments.forEach(c => {
        const cm = document.createElement("div");
        cm.className = "comment";
        cm.innerHTML = `<span class="who">${escapeHtml(c.user)}</span> <span class="when">${new Date(c.date).toLocaleString()}</span><div>${escapeHtml(c.text)}</div>`;
        commentsWrap.appendChild(cm);
      });
    } else {
      commentsWrap.innerHTML = `<div class="muted">Sin comentarios aún</div>`;
    }

    // add comment form if logged in
    const session = getSession();
    if (session) {
      const form = document.createElement("div");
      form.style.marginTop = "12px";
      form.innerHTML = `
        <textarea class="comment-input" placeholder="Escribe tu comentario"></textarea>
        <button class="btn btn-comment">Comentar</button>
      `;
      // attach handler
      form.querySelector(".btn-comment").addEventListener("click", () => {
        const text = form.querySelector(".comment-input").value.trim();
        if (!text) { showToast("Escribe algo antes de comentar"); return; }
        // push comment
        post.comments = post.comments || [];
        post.comments.push({ user: session.username, text, date: new Date().toISOString() });
        // save
        const all = loadPosts();
        const idx = all.findIndex(p=>p.id===post.id);
        if (idx !== -1) {
          all[idx] = post;
          savePosts(all);
          renderPosts();
          showToast("Comentario agregado");
        }
      });
      commentsWrap.appendChild(form);
    } else {
      // show small note to login
      const note = document.createElement("div");
      note.className = "muted";
      note.style.marginTop = "10px";
      note.textContent = "Inicia sesión para poder comentar.";
      commentsWrap.appendChild(note);
    }

    content.appendChild(commentsWrap);
    article.appendChild(content);
    container.appendChild(article);
  });
}

// ---------- escape simple ----------
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(m){ return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; });
}

// ---------- Auth: register / login ----------
document.getElementById("btn-register").addEventListener("click", () => {
  const u = document.getElementById("reg-username").value.trim();
  const p = document.getElementById("reg-password").value;
  if (u.length < 3) { showToast("Usuario muy corto"); return; }
  if (p.length < 4) { showToast("Contraseña muy corta"); return; }
  const users = loadUsers();
  if (users.find(x=>x.username===u)) { showToast("Usuario ya existe"); return; }
  users.push({ username: u, password: btoa(p) }); // simple storage (base64)
  saveUsers(users);
  setSession({ username: u });
  updateAuthUI();
  showToast("Registrado e iniciado sesión");
});

document.getElementById("btn-login").addEventListener("click", () => {
  const u = document.getElementById("login-username").value.trim();
  const p = document.getElementById("login-password").value;
  const users = loadUsers();
  const found = users.find(x=> x.username===u && x.password===btoa(p));
  if (!found) { showToast("Credenciales inválidas"); return; }
  setSession({ username: u });
  updateAuthUI();
  showToast("Sesión iniciada");
});

function updateAuthUI() {
  const session = getSession();
  const info = document.getElementById("user-info");
  const authForms = document.getElementById("auth-forms");
  if (session) {
    info.innerHTML = `<div>Hola, <strong>${escapeHtml(session.username)}</strong> <button id="btn-logout">Salir</button></div>`;
    authForms.classList.add("hidden");
    document.getElementById("btn-logout").addEventListener("click", ()=>{ clearSession(); updateAuthUI(); showToast("Sesión cerrada"); });
  } else {
    info.innerHTML = "";
    authForms.classList.remove("hidden");
  }
}

// ---------- Admin login ----------
document.getElementById("btn-admin-login").addEventListener("click", () => {
  const pass = document.getElementById("admin-pass").value;
  if (pass === ADMIN_PASS) {
    document.getElementById("admin-panel").classList.remove("hidden");
    showToast("Acceso de administrador concedido");
  } else showToast("Clave admin incorrecta");
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
updateAuthUI();
renderPosts();