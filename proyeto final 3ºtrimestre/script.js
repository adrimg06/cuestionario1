let preguntas = [];
let indice = 0;
let puntuacion = 0;
let tiempo = 0;
let idioma = 'es';
let temporizador;

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

function cambiarIdioma(lang) {
  idioma = lang;
  document.getElementById('titulo').innerText = textos[idioma].titulo;
  document.querySelector('button[onclick="siguientePregunta()"]').innerText = textos[idioma].siguiente;
  document.getElementById('tiempo').firstChild.nodeValue = textos[idioma].tiempo + ": ";
  if (indice < preguntas.length) mostrarPregunta();
  else document.getElementById('resultado').innerText = textos[idioma].resultado(puntuacion);
}

function iniciarReloj() {
  temporizador = setInterval(() => {
    tiempo++;
    document.getElementById('reloj').innerText = tiempo;
  }, 1000);
}

function cargarXML() {
  fetch("preguntas.xml")
    .then(res => res.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    .then(data => {
      preguntas = Array.from(data.getElementsByTagName("question"));
      iniciarReloj();
      mostrarPregunta();
    });
}

function mostrarPregunta() {
  const pregunta = preguntas[indice];
  const wording = pregunta.getElementsByTagName("wording")[0].textContent;
  const choices = Array.from(pregunta.getElementsByTagName("choice"));

  document.getElementById("pregunta").innerText = wording;
  const contenedor = document.getElementById("respuestas");
  contenedor.innerHTML = "";

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.innerText = choice.textContent;
    btn.onclick = () => {
      if (choice.getAttribute("correct") === "yes") {
        puntuacion++;
        btn.classList.add("correcto");
      } else {
        btn.classList.add("incorrecto");
      }
      Array.from(contenedor.children).forEach(b => b.disabled = true);
    };
    contenedor.appendChild(btn);
  });
}

function siguientePregunta() {
  if (indice < preguntas.length - 1) {
    indice++;
    mostrarPregunta();
  } else {
    clearInterval(temporizador);
    document.getElementById("pregunta").innerText = "";
    document.getElementById("respuestas").innerHTML = "";
    document.getElementById("resultado").innerText = textos[idioma].resultado(puntuacion);
  }
}

window.onload = cargarXML;
