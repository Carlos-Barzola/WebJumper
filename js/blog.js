
// ---------- Configuración inicial ----------
const ADMIN_PASS = "130991"; // <- Clave por defecto para acceso admin (local)
const STORAGE_KEYS = { POSTS: "wj_posts_v1" }; /* Define la clave usada en localStorage para guardar y recuperar los posts del blog*/

// Función para mostrar mensajes temporales
function showToast(msg, timeout = 2500) { // Texto y duración que están en pantalla los mensajes
  const t = document.getElementById("toast"); // Obtiene el elemento HTML donde se mostrará el mensaje
  t.textContent = msg; // Establece el texto del mensaje
  t.classList.remove("hidden");
  setTimeout(()=> t.classList.add("hidden"), timeout); // Oculta el mensaje después del tiempo especificado usando hidden
}

// ---------- Manejamos localStorage para posteos ----------
function loadPosts() { // Carga los posts del blog desde localStorage
  const raw = localStorage.getItem(STORAGE_KEYS.POSTS); // Obtiene los datos almacenados en localStorage
  return raw ? JSON.parse(raw) : []; // Convierte el JSON a objeto, o retorna [] si no hay datos
}
function savePosts(posts) { // Guarda los posts del blog en localStorage
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
}

// ---------- Render posteoss ----------
function renderPosts() { // Renderiza o muestra los posts del blog en la página
  const container = document.getElementById("posts-container"); // Contenedor HTML donde se mostrarán los posts
  const posts = loadPosts();//lee los posts guardados en localStorage y los devuelve como arreglo de objetos.
  container.innerHTML = ""; //Limpia el contenedor y evita que se repitan los posts si la función se llama varias veces

  if (posts.length === 0) {
    container.innerHTML = `<div class="post card"><div class="content"><h2>No hay entradas aún</h2><p>El administrador publicará temas pronto.</p></div></div>`;
    return;
  } // Comprueba Si no hay posts, muestra un mensaje y sale de la función

  // posts in reverse chronological (last first)
  posts.slice().reverse().forEach(post => { //copia el arreglo post, muestra primero los más recientes post y recoore el arreglo.
    const article = document.createElement("article");//Crea un elemento HTML <article> que representará un post.
    article.className = "post card"; //Se asignan las clases CSS "post card" para aplicar estilos.

    const banner = document.createElement("img"); //Crea etiqueta de imagen para el banner
    banner.className = "banner";
    banner.src = post.banner || "imagenes/Roary_portadaBlog.png";
    article.appendChild(banner); //Se agrega la imagen dentro del <article>.

    const content = document.createElement("div");//Crea un <div> que contendrá el contenido 
    content.className = "content"; //...textual del post: título, fecha y cuerpo.

    const h2 = document.createElement("h2");//Crea un encabezado <h2> con el título 
    h2.textContent = post.title; //...del post y lo agrega al content.
    content.appendChild(h2);

    const meta = document.createElement("div"); //Crea un <div> para la información de fecha de publicación.
    meta.className = "meta";
    meta.textContent = `Publicado: ${new Date(post.date).toLocaleString()}`; //Convierte la fecha del post a un formato legible con toLocaleString().
    content.appendChild(meta);

    const p = document.createElement("p"); //Crea un párrafo <p> con el contenido del post.
    p.innerHTML = post.body.replace(/\n/g, "<br>");//Reemplaza los saltos de línea \n por <br> para que se respeten en HTML.
    content.appendChild(p);

    article.appendChild(content); //Agrega el content al <article>.
    container.appendChild(article); //Luego agrega el <article> completo al container de posts.
  });
}

// convierte caracteres especiales en su equivalente seguro para HTML 
// para que no rompan la página ni puedan ejecutar código malicioso.
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(m){ return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; });
}

// ---------- Admin login ----------
//Aqui se valida la clave quemada del admin y por verdadero abre el panel de administración
//Por falso mostrará alerta de clave incorrecta
document.getElementById("btn-admin-login").addEventListener("click", () => {
  const pass = document.getElementById("admin-pass").value;
  if (pass === ADMIN_PASS) {
    document.getElementById("admin-panel").classList.remove("hidden");
    showToast("Acceso de administrador concedido");
  } else showToast("Clave incorrecta");
});
//Para que al dar click en el boton de salir admin se oculte el panel de administración
document.getElementById("btn-logout-admin").addEventListener("click", () => {
  document.getElementById("admin-panel").classList.add("hidden");
});

// ---------- Crear post des vista admin ----------
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
  };
  posts.push(post); //Agrega el post al array de posts
  savePosts(posts);//Guarda los posts actualizados en localStorage:
  // limpiar campos
  document.getElementById("post-title").value = "";
  document.getElementById("post-body").value = "";
  document.getElementById("post-banner-url").value = "";
  renderPosts();//Renderizar los posts actualizados en la página
  showToast("Entrada publicada"); //Mostrar un mensaje de confirmación (toast)
});

// ---------- inicializar post demo (no manuales) ----------
(function initDemo(){
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) { //Comprueba si en el localStorage existe algún post bajo la clave wj_posts_v1
    const demo = [{ //Se define el post demo
      id:"p_demo_1",
      title:"Bienvenidos al Blog Jumper",
      banner:"",
      body:"Este espacio está creado para compartir reflexiones, actividades y recursos para jóvenes. El administrador puede publicar entradas desde el panel.",
      date:new Date().toISOString(),
    }];
    //Llama a la función savePosts() que convierte el array en JSON y lo guarda en localStorage
    savePosts(demo);
  }
})();

// ---------- inicialización UI ----------
//Llama a la función que muestra todos los posts guardados en el contenedor HTML.
renderPosts();