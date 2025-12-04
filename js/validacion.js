// Inicializar EmailJS para envío de correos con info desde el formulario
emailjs.init("uxYwkdPewBWhaJyUF");

// Seleccionar formulario
const form = document.querySelector(".formulario");

// Función para mostrar errores debajo del input específico del error
function mostrarError(input, mensaje) {
    input.classList.add("input-error");

    if (input.nextElementSibling && input.nextElementSibling.classList.contains("msg-error")) {
        input.nextElementSibling.textContent = mensaje;
        return;
    }
    const msg = document.createElement("p");
    msg.textContent = mensaje;
    msg.classList.add("msg-error");
    input.insertAdjacentElement("afterend", msg);
}

// Función limpiar mensajes de error al corregir el campo
function limpiarError(input) {
    input.classList.remove("input-error");
    if (input.nextElementSibling && input.nextElementSibling.classList.contains("msg-error")) {
        input.nextElementSibling.remove();
    }
}

// Validación principal
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = form.querySelector('#nombre');
    const telefono = form.querySelector('#telefono');
    const mensaje = form.querySelector('#mensaje');

    let valido = true;

    // ————————————— Validaciones de campos para mostrar error o no —————————————
    limpiarError(nombre);
    limpiarError(telefono);
    limpiarError(mensaje);

    if (nombre.value.trim().length < 3) {
        mostrarError(nombre, "Por favor ingresa tu nombre completo.");
        valido = false;
    }

    const regexTelefono = /^[0-9]{9,10}$/;
    if (!regexTelefono.test(telefono.value.trim())) {
        mostrarError(telefono, "Ingresa un número válido (9 o 10 dígitos).");
        valido = false;
    }

    if (mensaje.value.trim().length < 5) {
        mostrarError(mensaje, "Escribe un mensaje más detallado.");
        valido = false;
    }

    if (!valido) return;

    // ————————————— Envio correo por EmailJS —————————————
    const params = {
        nombre: nombre.value,
        telefono: telefono.value,
        mensaje: mensaje.value
    };
    emailjs.send("service_jrbbtkc", "template_8o1ygqp", params)
        .then(() => {
            // Mensaje OK
            Swal.fire({
                icon: "success",
                title: "Mensaje enviado",
                text: "Gracias por contactarnos. Te responderemos pronto.",
            });

            form.reset();
        })
        .catch(() => {
            Swal.fire({
                icon: "error",
                title: "Error al enviar",
                text: "Ocurrió un problema. Inténtalo más tarde.",
            });
        });
});

