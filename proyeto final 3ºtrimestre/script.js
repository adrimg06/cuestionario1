// Declaración de variables globales
let preguntas = [];         // Array para almacenar las preguntas cargadas del XML
let indice = 0;             // Índice de la pregunta actual
let puntuacion = 0;         // Puntuación del usuario
let tiempo = 0;             // Tiempo transcurrido desde que comienza el cuestionario
let idioma = 'es';          // Idioma actual (por defecto español)
let temporizador;           // Variable para manejar el intervalo del reloj

// Textos en distintos idiomas para internacionalización
const textos = {
  es: {
    titulo: "Concurso de Preguntas",
    siguiente: "Siguiente",
    tiempo: "Tiempo",
    resultado: puntos => `Puntuación: ${puntos}`
  },
  en: {
    titulo: "Question Quiz",
    siguiente: "Next",
    tiempo: "Time",
    resultado: puntos => `Score: ${puntos}`
  }
};

// Función para cambiar el idioma del cuestionario
function cambiarIdioma(lang) {
  idioma = lang;

  // Actualiza los textos del título, botón "Siguiente" y el reloj
  document.getElementById('titulo').innerText = textos[idioma].titulo;
  document.querySelector('button[onclick="siguientePregunta()"]').innerText = textos[idioma].siguiente;
  document.getElementById('tiempo').firstChild.nodeValue = textos[idioma].tiempo + ": ";

  // Si aún hay preguntas por responder, se vuelve a mostrar la actual traducida
  if (indice < preguntas.length) {
    mostrarPregunta();
  } else {
    // Si ya se ha terminado el cuestionario, se muestra el resultado traducido
    document.getElementById('resultado').innerText = textos[idioma].resultado(puntuacion);
  }
}

// Función que inicia el contador del reloj (incrementa cada segundo)
function iniciarReloj() {
  temporizador = setInterval(() => {
    tiempo++;
    document.getElementById('reloj').innerText = tiempo;
  }, 1000); // cada 1000 milisegundos = 1 segundo
}

// Función que carga el archivo XML de preguntas
function cargarXML() {
  fetch("preguntas.xml") // Solicita el archivo XML
    .then(res => res.text()) // Lo convierte a texto
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml")) // Lo transforma en objeto XML
    .then(data => {
      preguntas = Array.from(data.getElementsByTagName("question")); // Extrae todas las preguntas del XML
      iniciarReloj(); // Inicia el cronómetro
      mostrarPregunta(); // Muestra la primera pregunta
    });
}

// Función que muestra una pregunta y sus posibles respuestas
function mostrarPregunta() {
  const pregunta = preguntas[indice]; // Selecciona la pregunta actual
  const wording = pregunta.getElementsByTagName("wording")[0].textContent; // Texto de la pregunta
  const choices = Array.from(pregunta.getElementsByTagName("choice")); // Opciones de respuesta

  document.getElementById("pregunta").innerText = wording;
  const contenedor = document.getElementById("respuestas");
  contenedor.innerHTML = ""; // Limpia respuestas anteriores

  // Crea un botón para cada opción
  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.innerText = choice.textContent;

    // Al hacer clic, se valida si la opción es correcta
    btn.onclick = () => {
      if (choice.getAttribute("correct") === "yes") {
        puntuacion++;
        btn.classList.add("correcto"); // Marca como correcta
      } else {
        btn.classList.add("incorrecto"); // Marca como incorrecta
      }

      // Deshabilita todos los botones para que no se pueda cambiar la respuesta
      Array.from(contenedor.children).forEach(b => b.disabled = true);
    };

    contenedor.appendChild(btn); // Añade el botón al DOM
  });
}

// Función para pasar a la siguiente pregunta o terminar el cuestionario
function siguientePregunta() {
  if (indice < preguntas.length - 1) {
    indice++;
    mostrarPregunta(); // Muestra la siguiente pregunta
  } else {
    clearInterval(temporizador); // Detiene el reloj
    document.getElementById("pregunta").innerText = "";
    document.getElementById("respuestas").innerHTML = "";
    document.getElementById("resultado").innerText = textos[idioma].resultado(puntuacion); // Muestra la puntuación final
  }
}

// Carga las preguntas al iniciar la página
window.onload = cargarXML;

