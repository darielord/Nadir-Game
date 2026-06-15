// 🎥 CONFIGURACIÓN DEL LIENZO (CANVAS)

// ==========================================

const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");

// Estira el lienzo al 100% de la pantalla del monitor

canvas.width = window.innerWidth;

canvas.height = window.innerHeight;

// ==========================================

// 🎵 RECURSOS DE AUDIO

// ==========================================

const sonidoPuertaFinal = new Audio("PRISONDOOR.mp3");

const sonidoPasos = new Audio("Pasito.mp3");

sonidoPasos.loop = true; // Hace que los pasos suenen infinitos mientras camina

const AmbientePrision = new Audio("PRISIONAMBIENTE.flac");

AmbientePrision.loop = true;

let AmbientePrisionInterruptor = false;

const AmbientePabellon4 = new Audio("PABELLON4.wav");

AmbientePabellon4.loop = true;

const AmbientePabellon5 = new Audio("PABELLON5.mp3");

AmbientePabellon5.loop = true;

const puertaCerrada = new Audio("PUERTACERRADA.flac");

const golpePuerta = new Audio("GOLPEPUERTA.mp3");

const puertaDuchasCerrada = new Audio("PUERTADUCHASCERRADA.wav");

const sujetoDuchas = new Audio("DUCHASUJETO.mp3");

const AmbientecarcelRoja = new Audio("CARCELROJA.mp3");

const AmbientecarcelRoja2 = new Audio("CARCELROJA2.mp3");

const AmbienteDuchas = new Audio("DUCHAS.mp3");

const AmbientePabellon10 = new Audio("PABELLON10.mp3");

const AmbienteDuchas2 = new Audio("DUCHAS2.mp3");

// ==========================================

// ⌨️ CONTROL DE INPUTS (TECLADO Y RATÓN)

// ==========================================

const teclas = {
  aleft: false,

  dright: false,

  ataque: false,

  Einteractuar: false,
};

// Escucha cuando se pisa una tecla

window.addEventListener("keydown", (e) => {
  if (e.key === "a" || (e.key === "d" && !AmbientePrisionInterruptor)) {
    AmbientePrision.play();

    AmbientePrisionInterruptor = true;
  }

  if (e.key === "a") teclas.aleft = true;

  if (e.key === "d") teclas.dright = true;

  if (e.key === "e") teclas.Einteractuar = true;
});

// Escucha cuando se suelta una tecla

window.addEventListener("keyup", (e) => {
  if (e.key === "a") teclas.aleft = false;

  if (e.key === "d") teclas.dright = false;

  if (e.key === "e") teclas.Einteractuar = false;
});

// Click izquierdo: Activa el ataque y congela los pies de Nadir

window.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    teclas.ataque = true;

    bloqueoMovimiento = true; // El freno de mano que bloquea el movimiento
  }
});

window.addEventListener("mouseup", (e) => {
  if (e.button === 0) {
    teclas.ataque = false;
  }
});

// ==========================================

// 📊 BANDERAS DE PRECARGA DE IMÁGENES

// ==========================================

let carcelImg = false;

let nadirImg = false;

let caminataImg = false;

let ataqueImg = false;

let carcelFinalPabellonimg = false;

let pabellon4Img = false;

let pabellon5Img = false;

let puertaFinal7Img = false;

let puertaFinalCuchilloImg = false;

let duchasImg = false;

let pabellon8Img = false;

let duchaspt2Img = false;

let duchaspt3Img = false;

let pabellon9Img = false;

let carcelRojaFinalImg = false;

let carcelRojaFinal2Img = false;

let carcelPabellon10Img = false;

let carcelPabellon10FinalImg = false;

let pabellon11Img = false;

let pabellon11PuertasImg = false;

let duchas2Img = false;

let duchas2pt2Img = false;

// ==========================================

// 🏃‍♂️ PROPIEDADES Y ANIMACIÓN DE NADIR

// ==========================================

let idleFrameWidth = 113; // Ancho de corte del sprite de reposo

let idleHFrameheight = 145; // Alto de corte de los sprites

let idleFrameActual = 0; // Frame actual de la animación (0 a 3)

let idleContadorAnim = 0; // Taxímetro interno para cambiar de frame

const limite = 15; // Velocidad de la animación (más alto, más lento)

let nadirX = 100; // Posición X inicial de Nadir en pantalla

let velocidad = 6; // Píxeles que avanza Nadir por frame

let estado = "idle"; // Estado actual: "idle", "caminar", "atacar"

let mirandoDerecha = true; // Controla hacia dónde mira el sprite

// ==========================================

// 🌀 MOTOR DE SCROLL INFINITO (CÁMARA)

// ==========================================

let fondoX1 = 0; // Posición de la imagen líder

let fondoX2 = 2638; // Posición de la imagen seguidora (Clonada)

let imagenContador = 0; // 0 = Loop infinito, 1 = Tramo final activado

let finalAlcanzado = false; // true clava el fondo y te deja caminar al extremo derecho

// 📐 Variables matemáticas para centrar la cámara

let anchoMitad = window.innerWidth / 2;

let mitadNadir = idleFrameWidth / 2;

const mitadTodo = anchoMitad - mitadNadir; // El centro exacto de tu monitor

// ==========================================

// 🎞️ CONTROL DE ANIMACIÓN DE ATAQUE

// ==========================================

let ataqueframeWidth = 138; // Ancho de corte del sprite de ataque

let loops = 0; // Contador de frames para el ataque

let loopsI = 0; // Frame actual del ataque

const limiteloop = 14; // Duración de cada frame de ataque

let bloqueoMovimiento = false; // NUEVO NOMBRE: true bloquea el scroll y el paso

// ==========================================

// 🖼️ CONTENEDORES DINÁMICOS DE FONDOS

// ==========================================

let imagenFondoActual; // Guarda la imagen líder que toca dibujar

let imagenFondoActualFinal; // Guarda la extensión final del pasillo

// ==========================================

// 🎬 PROGRESO DE CICLOS Y CINEMÁTICAS

// ==========================================

let ciclosCompletados = 0; // Cuántas veces has completado el loop de la cárcel

let ciclosCompletadosFinal = 0; // Controla qué fondo final de puerta se dibuja

let nadirPasoCuchillo = false; // Bandera que sabe si ya pasaste la cinemática del cuchillo

let modoCinematica = 0; // 0 = Jugando, 1-5 = Fases del fundido en negro

let contadorCinematica = 0; // Temporizador para aguantar la pantalla negra

let yendoaDuchas = false; // Activador del viaje en el apagón

let yendoaDuchas2 = false;

let enDuchas = false; // true cambia las reglas al mapa de las duchas

let enDuchas2 = false;

let animando = false; // Evita que el bucle loop() se duplique al iniciar

let eventoDuchasCompletado = false;

let eventoDuchas2Completado = false;

let eventoTVCompletado = false;

let eventoSujetoCompletado = false;

let puertaCerradaContador = 0;

let saliendoDeDuchas = false;

let saliendoDeDuchas2 = false;

let enPabellon11 = false;

let cinematicaActual = {};

// 🌓 Sistema de Fundido en Negro y Transición

let opacidadNegro = 0; // Controla el alfa (0 a 1) de la capa negra en pantalla

let aclarar = false; // true activa la disolución del negro al aparecer en un mapa

let empezarOscurecer = false; // true activa el apagón cuando interactúas con una puerta

let sonidoPuerta = false; // Bandera para que el audio de la puerta no se dispare mil veces

let escenarioEstatico = false;

let sumadorEscenarioEstatico = 0;

let maxPantallasEstaticas = 0;

function loop() {
  // ==========================================

  // 🗺️ MAQUINA DE ESTADOS DE ESCENARIOS (MUNDOS)

  // ==========================================

  // MUNDO: DUCHAS

  if (enDuchas) {
    maxPantallasEstaticas = 1;

    AmbienteDuchas.play();

    AmbientePrision.pause();

    if (sumadorEscenarioEstatico === 0) {
      imagenFondoActual = duchas;
    } else if (sumadorEscenarioEstatico === 1) {
      imagenFondoActual = duchaspt2;
    }

    // Aquí podre meter más sub-pantallas de las duchas a futuro de forma limpia
  } else if (enDuchas2) {
    maxPantallasEstaticas = 1;

    AmbienteDuchas2.play();

    AmbientePrision.pause();

    AmbientePabellon10.pause();

    AmbientePabellon10.currentTime = 0;

    if (sumadorEscenarioEstatico === 0) {
      imagenFondoActual = duchas2;
    } else if (sumadorEscenarioEstatico === 1) {
      imagenFondoActual = duchas2pt2;
    }
  }

  // MUNDO: CÁRCEL (Evolución por ciclos)
  else {
    // 1. Selector del Pasillo Líder

    // 1. Selector del Pasillo Líder

    if (ciclosCompletados < 3) {
      imagenFondoActual = carcel;
    } else if (ciclosCompletados === 3) {
      imagenFondoActual = pabellon4;

      AmbientePabellon4.play();

      AmbientePrision.pause();

      AmbientePrision.currentTime = 0;
    } else if (ciclosCompletados === 4 || ciclosCompletados === 5) {
      // 🔄 Controlamos estrictamente los ciclos 4 y 5 antes del baño

      imagenFondoActual = pabellon5;

      AmbientePabellon5.play();

      AmbientePabellon4.pause();

      AmbientePabellon4.currentTime = 0;

      AmbientePrision.pause();

      AmbientePrision.currentTime = 0;
    } else if (ciclosCompletados === 6) {
      AmbienteDuchas.pause();

      AmbienteDuchas.currentTime = 0;

      // 🚿 El momento exacto cuando sales de las duchas

      imagenFondoActual = pabellon5; // Mantiene el pasillo base para que no se ponga en blanco

      AmbientePrision.pause();

      AmbientePrision.currentTime = 0;

      AmbientePabellon5.pause();

      AmbientePabellon5.currentTime = 0; // Pausa el audio para dar la atmósfera muerta que buscas
    } else if (ciclosCompletados === 7) {
      imagenFondoActual = pabellon8;

      AmbientecarcelRoja.play();
    } else if (ciclosCompletados === 8) {
      imagenFondoActual = pabellon9;

      AmbientecarcelRoja2.play();

      AmbientecarcelRoja.pause();

      AmbientecarcelRoja.currentTime = 0;
    } else if (ciclosCompletados === 9) {
      imagenFondoActual = pabellon10;

      AmbientePabellon10.play();

      AmbientecarcelRoja2.pause();

      AmbientecarcelRoja2.currentTime = 0;

      AmbientePrision.pause();

      AmbientePrision.currentTime = 0;

      AmbienteDuchas2.pause();

      AmbienteDuchas2.currentTime = 0;
    }

    // 2. Selector del Pasillo Extendido (Tramo Final)

    if (ciclosCompletadosFinal < 5) {
      imagenFondoActualFinal = carcelFinalPabellon; // NUEVO NOMBRE
    } else if (ciclosCompletadosFinal === 5) {
      imagenFondoActualFinal = !nadirPasoCuchillo
        ? puertaFinalCuchillo
        : carcelFinalPabellon;
    } else if (ciclosCompletadosFinal === 6) {
      imagenFondoActualFinal = puertaFinal7;
    } else if (ciclosCompletadosFinal === 7) {
      imagenFondoActualFinal = carcelRojaFinal;
    } else if (ciclosCompletadosFinal === 8) {
      imagenFondoActualFinal = carcelRojaFinal2;
    } else if (ciclosCompletadosFinal === 9) {
      imagenFondoActualFinal = pabellon10Final;
    }
  }

  // ==========================================

  // ==========================================

  // 📐 PARTE 3: DETECTOR DE PROXIMIDAD (HITBOXES)

  // ==========================================

  // 🔪 Rango de activación de la puerta del Cuchillo (Ciclo Final 5)

  // Calcula los píxeles exactos en pantalla donde inicia y termina el umbral del cuchillo

  let inicioCuchillo = fondoX1 + imagenFondoActual.naturalWidth + 1331;

  let finalCuchillo = fondoX1 + imagenFondoActual.naturalWidth + 1477;

  // 🚿 Rango de activación de la puerta de las Duchas (Ciclo Final 6)

  // Calcula el umbral en pantalla para poder interactuar y viajar al siguiente mundo

  let inicioPuertasDuchas = fondoX1 + imagenFondoActual.naturalWidth + 1050;

  let finalPuertaDuchas = fondoX1 + imagenFondoActual.naturalWidth + 1395;

  let inicioPuertaDuchas2 = fondoX1 + imagenFondoActual.naturalWidth + 1044;

  let finalPuertaDuchas2 = fondoX1 + imagenFondoActual.naturalWidth + 1790;

  let agujeroDuchasInicio = (655 / 853) * canvas.width;

  let agujeroDuchasFinal = (746 / 853) * canvas.width;

  let agujeroDuchas2Inicio = (1974 / 2638) * canvas.width;

  let agujeroDuchas2Final = (2110 / 2638) * canvas.width;

  // 📍 Centro de masa de Nadir

  // En vez de usar el borde izquierdo (nadirX), calcula el eje central del sprite

  // Esto asegura que los eventos se disparen cuando el cuerpo de Nadir esté justo frente al objeto

  let centroNadir = nadirX + idleFrameWidth / 2;

  // ==========================================

  // ==========================================

  // 🎬 PARTE 4: CINEMÁTICA DEL CUCHILLO (SWITCH)

  // ==========================================

  /*
   * Encapsulates corridor-specific interaction loops to eliminate global state leakage into static scenes.
   * Enforces context-aware input masking, isolating finite spatial lifecycles from the infinite corridor scope.
   */
  if (!escenarioEstatico) {
    // 🚪 CONDICIÓN DE DISPARO: Revisa si Nadir entra al umbral del evento

    if (
      centroNadir > inicioCuchillo &&
      centroNadir < finalCuchillo &&
      ciclosCompletadosFinal === 5 && // Debe ser estrictamente el ciclo del cuchillo
      !nadirPasoCuchillo && // El evento solo ocurre UNA vez por partida
      modoCinematica === 0 // Solo se activa si no hay otra cinemática corriendo
    ) {
      cinematicaActual.imgCinematica = imagenCinematicaCuchillo;

      cinematicaActual.tiempoCinematica = 150;

      cinematicaActual.idCinematica = "CUCHILLO";

      modoCinematica = 1; // Activa el primer estado del switch

      velocidad = 0; // Clava los pies de Nadir en el suelo

      estado = "idle"; // Fuerza la animación de reposo

      sonidoPasos.pause(); // Pausa el audio de los pasos inmediatamente
    }

    /*
     * Manages the shower door interaction lifecycle based on player positioning and state rules.
     * Implements state-driven masking to prevent an input polling race condition during the fade transition.
     */
    if (
      centroNadir > inicioPuertasDuchas &&
      centroNadir < finalPuertaDuchas &&
      ciclosCompletadosFinal === 6 &&
      !aclarar &&
      !empezarOscurecer &&
      teclas.Einteractuar
    ) {
      if (puertaCerradaContador >= 5) {
        empezarOscurecer = true;

        sonidoPuerta = true;

        yendoaDuchas = true;
      } else {
        if (puertaDuchasCerrada.paused) {
          puertaDuchasCerrada.currentTime = 0;

          puertaDuchasCerrada.play();
        }
      }
    }

    if (
      centroNadir > inicioPuertaDuchas2 &&
      centroNadir < finalPuertaDuchas2 &&
      ciclosCompletadosFinal === 9 &&
      !aclarar &&
      !empezarOscurecer &&
      teclas.Einteractuar
    ) {
      empezarOscurecer = true;

      sonidoPuerta = true;

      yendoaDuchas2 = true;
    }
  }

  if (
    enDuchas &&
    sumadorEscenarioEstatico === 0 &&
    centroNadir < 150 &&
    !empezarOscurecer &&
    teclas.Einteractuar &&
    !aclarar
  ) {
    empezarOscurecer = true;

    sonidoPuerta = true;

    saliendoDeDuchas = true;
  }

  if (
    enDuchas2 &&
    sumadorEscenarioEstatico === 0 &&
    centroNadir < 150 &&
    !empezarOscurecer &&
    !aclarar &&
    teclas.Einteractuar
  ) {
    empezarOscurecer = true;

    sonidoPuerta = true;

    saliendoDeDuchas2 = true;
  }

  if (
    enDuchas &&
    centroNadir > agujeroDuchasInicio &&
    centroNadir < agujeroDuchasFinal &&
    sumadorEscenarioEstatico === 1 &&
    teclas.Einteractuar &&
    !eventoDuchasCompletado &&
    modoCinematica === 0
  ) {
    cinematicaActual.imgCinematica = ImagenAgujeroDuchas;

    cinematicaActual.tiempoCinematica = 150;

    cinematicaActual.idCinematica = "AGUJERO";

    modoCinematica = 1;

    velocidad = 0;

    sonidoPasos.pause();

    estado = "idle";
  }

  if (
    enDuchas2 &&
    centroNadir > agujeroDuchas2Inicio &&
    agujeroDuchas2Final &&
    sumadorEscenarioEstatico === 1 &&
    teclas.Einteractuar &&
    !eventoDuchas2Completado &&
    modoCinematica === 0
  ) {
    cinematicaActual.imgCinematica = ImagenAgujeroDuchas;

    cinematicaActual.tiempoCinematica = 150;

    cinematicaActual.idCinematica = "AGUJERO2";

    modoCinematica = 1;

    velocidad = 0;

    sonidoPasos.pause();

    estado = "idle";
  }

  // 🎞️ MÁQUINA DE ESTADOS: Controla el flujo visual de la cinemática

  switch (modoCinematica) {
    case 1: // 🌓 Fase 1: Oscurecimiento gradual de la pantalla
      opacidadNegro += 0.005;

      if (opacidadNegro >= 1) {
        modoCinematica = 2; // Pantalla negra total alcanzada, pasa a la visión
      }

      break;

    case 2: // 👁️ Fase 2: Desvanecimiento del negro para revelar la imagen estática
      opacidadNegro -= 0.002;

      if (opacidadNegro <= 0) {
        opacidadNegro = 0;

        modoCinematica = 3; // Revelado completo, pasa a la pausa dramática
      }

      break;

    case 3: // ⏳ Fase 3: Pausa dramática. Aguanta la imagen en pantalla por 150 frames
      contadorCinematica++;

      if (contadorCinematica >= cinematicaActual.tiempoCinematica) {
        modoCinematica = 4; // Tiempo cumplido, vuelve a oscurecer
      }

      break;

    case 4: // 🌓 Fase 4: Segundo oscurecimiento para ocultar la visión
      opacidadNegro += 0.002;

      if (opacidadNegro >= 1) {
        opacidadNegro = 1;

        if (cinematicaActual.idCinematica === "CUCHILLO") {
          nadirPasoCuchillo = true; // Bandera clave: Cambia el fondo detrás del negro
        } else if (cinematicaActual.idCinematica === "AGUJERO") {
          eventoDuchasCompletado = true;
        } else if (cinematicaActual.idCinematica === "AGUJERO2") {
          eventoDuchas2Completado = true;
        }

        modoCinematica = 5; // Pasa al aclarado final del gameplay
      }

      break;

    case 5: // 🏃‍♂️ Fase 5: Regreso al gameplay. Limpia el lienzo y devuelve el control
      opacidadNegro -= 0.005;

      if (opacidadNegro <= 0) {
        opacidadNegro = 0;

        modoCinematica = 0; // Libera la máquina de estados (Modo juego libre)

        velocidad = 6; // Nadir recupera su velocidad de caminata

        contadorCinematica = 0; // Resetea el reloj de la cinemática

        // Limpieza absoluta de interruptores de transición para evitar bloqueos

        empezarOscurecer = false;

        aclarar = false;

        sonidoPuerta = false;

        cinematicaActual = {};
      }

      break;
  }

  // ==========================================

  if (opacidadNegro >= 1 && modoCinematica === 0) {
    if (yendoaDuchas) {
      enDuchas = true;

      yendoaDuchas = false;

      escenarioEstatico = true;

      nadirX = 100;

      fondoX1 = 0;

      finalAlcanzado = false;

      imagenContador = 0;
    } else if (saliendoDeDuchas) {
      enDuchas = false;

      escenarioEstatico = false;

      saliendoDeDuchas = false;

      ciclosCompletados = 6;

      ciclosCompletadosFinal = 6;

      imagenContador = 1;

      finalAlcanzado = true;

      fondoX1 = canvas.width - 2638 - 2682;

      fondoX2 = fondoX1 + 2638;

      nadirX = fondoX1 + 2638 + 1150;
    } else if (saliendoDeDuchas2) {
      enDuchas2 = false;

      escenarioEstatico = false;

      saliendoDeDuchas2 = false;

      ciclosCompletados = 9;

      ciclosCompletadosFinal = 9;

      imagenContador = 1;

      finalAlcanzado = true;

      fondoX1 = canvas.width - 2638 - 2682;

      fondoX2 = fondoX1 + 2638;

      nadirX = fondoX1 + 2638 + 1150;
    } else if (yendoaDuchas2) {
      enDuchas2 = true;

      yendoaDuchas2 = false;

      escenarioEstatico = true;

      nadirX = 100;

      fondoX1 = 0;

      finalAlcanzado = false;

      imagenContador = 0;

      sumadorEscenarioEstatico = 0;
    } else {
      ciclosCompletados++;

      ciclosCompletadosFinal++;

      nadirX = 100;

      fondoX1 = 0;
      fondoX2 = imagenFondoActual.naturalWidth;
      finalAlcanzado = false;

      imagenContador = 0;
    }

    aclarar = true;

    empezarOscurecer = false;

    sonidoPuerta = false;
  }

  if (aclarar) {
    opacidadNegro -= 0.01;

    if (opacidadNegro <= 0) {
      aclarar = false;

      opacidadNegro = 0;

      empezarOscurecer = false;

      sonidoPuerta = false;
    }
  }

  if (
    finalAlcanzado === true &&
    nadirX >= canvas.width - idleFrameWidth &&
    teclas.Einteractuar === true &&
    opacidadNegro < 1 &&
    !aclarar
  ) {
    if (ciclosCompletadosFinal === 6) {
      if (eventoDuchasCompletado) {
        empezarOscurecer = true;

        sonidoPuerta = true;
      } else {
        if (puertaCerrada.paused) {
          puertaCerrada.currentTime = 0;

          puertaCerrada.play();

          puertaCerradaContador++;

          if (puertaCerradaContador === 5) {
            golpePuerta.currentTime = 0;

            golpePuerta.play();
          }
        }
      }
    } else if (ciclosCompletadosFinal === 9) {
      if (eventoDuchas2Completado) {
        empezarOscurecer = true;

        sonidoPuerta = true;
      }
    } else {
      empezarOscurecer = true;

      sonidoPuerta = true;

      sonidoPuertaFinal.play();
    }
  }

  if (empezarOscurecer) {
    opacidadNegro += 0.01;
  }

  if (imagenContador === 1 && fondoX1 + 2638 + 2682 <= canvas.width) {
    finalAlcanzado = true;

    fondoX1 = canvas.width - 2638 - 2682;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dibujarTodo();

  contadorAnimacion();

  // ==========================================

  // 🏃‍♂️ PARTE 5: MOTOR DE FÍSICA, MOVIMIENTO Y SCROLL

  // ==========================================

  if (escenarioEstatico) {
    if (nadirX >= canvas.width - idleFrameWidth) {
      if (sumadorEscenarioEstatico < maxPantallasEstaticas) {
        sumadorEscenarioEstatico++;

        nadirX = 10;
      } else {
        nadirX = canvas.width - idleFrameWidth;
      }
    }

    if (nadirX <= 0) {
      if (sumadorEscenarioEstatico > 0) {
        sumadorEscenarioEstatico--;

        nadirX = canvas.width - idleFrameWidth - 20;
      } else {
        nadirX = 20;
      }
    }
  }

  // 🛑 SISTEMA DE CAMINATA Y SCROLL DE CÁMARA

  // Solo procesa el movimiento si Nadir no está congelado por un ataque o cinemática

  if (!bloqueoMovimiento) {
    // 👉 CAMINAR A LA DERECHA (Tecla D)

    if (teclas.dright === true) {
      mirandoDerecha = true; // Voltea el sprite a la derecha

      if (escenarioEstatico) {
        nadirX = nadirX + velocidad;
      } else {
        // Si Nadir no ha llegado al centro de la pantalla, o si ya llegó al final del pasillo, se mueve ÉL

        if (
          nadirX < mitadTodo ||
          (finalAlcanzado === true && nadirX < canvas.width - idleFrameWidth)
        ) {
          nadirX = nadirX + velocidad;
        }

        // Si está en el centro y el loop sigue activo, se congela Nadir y se rueda el ESCENARIO hacia atrás
        else if (finalAlcanzado === false) {
          fondoX1 = fondoX1 - velocidad;

          fondoX2 = fondoX2 - velocidad;
        }
      }
    }

    // 👈 CAMINAR A LA IZQUIERDA (Tecla A)

    if (teclas.aleft === true) {
      mirandoDerecha = false; // Voltea el sprite a la izquierda

      if (escenarioEstatico) {
        nadirX = nadirX - velocidad;
      } else {
        if (fondoX1 < 0 && finalAlcanzado === false) {
          // Si el escenario se ha movido y no estamos en el final, se rueda el escenario a la derecha

          fondoX1 = fondoX1 + velocidad;

          fondoX2 = fondoX2 + velocidad;
        }

        // Si el escenario llegó al tope izquierdo, se mueve físicamente Nadir hacia la izquierda
        else if (nadirX > 0) {
          nadirX = nadirX - velocidad;

          if (nadirX < 0) nadirX = 0; // Pared invisible para no salirse de la pantalla por la izquierda
        }
      }
    }
  }

  if (modoCinematica === 0) {
    if (bloqueoMovimiento) {
      estado = "atacar";
    } else if (teclas.dright || teclas.aleft) {
      estado = "caminar";
    } else {
      estado = "idle";
    }

    if (estado === "atacar") {
      loops++;

      if (loops === limiteloop) {
        loops = 0;

        loopsI++;

        if (loopsI === 2) {
          teclas.ataque = false;

          loopsI = 0;

          bloqueoMovimiento = false;
        }
      }
    }

    if (estado === "caminar" && sonidoPasos.paused) {
      sonidoPasos.play();
    } else if (estado === "idle" || estado === "atacar") {
      sonidoPasos.pause();

      sonidoPasos.currentTime = 0;
    }
  }
  // 🌀 RECIRCULACIÓN INFINITA DE FONDOS (EL EFECTO BUCLE)

  // Revisa si una de las imágenes se salió por completo de la pantalla para reciclarla detrás de la otra

  // Si el Fondo 1 se esconde por la izquierda...

  if (fondoX1 <= -imagenFondoActual.naturalWidth) {
    if (imagenContador < 1) {
      // Solo si el bucle infinito sigue activo

      imagenContador++;

      fondoX1 = fondoX2 + imagenFondoActual.naturalWidth; // Se teletransporta al final del Fondo 2
    }
  }

  // Si el Fondo 2 se esconde por la izquierda...

  if (fondoX2 <= -imagenFondoActual.naturalWidth) {
    if (imagenContador < 1) {
      fondoX2 = fondoX1 + imagenFondoActual.naturalWidth; // Se teletransporta al final del Fondo 1
    }
  }

  // Si el Fondo 1 se sale por la derecha (Caminando hacia atrás)...

  if (fondoX1 > imagenFondoActual.naturalWidth) {
    if (imagenContador < 1) {
      fondoX1 = fondoX2 - imagenFondoActual.naturalWidth; // Se reposiciona al inicio del Fondo 2
    }
  }

  // Si el Fondo 2 se sale por la derecha (Caminando hacia atrás)...

  if (fondoX2 > imagenFondoActual.naturalWidth) {
    if (imagenContador < 1) {
      fondoX2 = fondoX1 - imagenFondoActual.naturalWidth; // Se reposiciona al inicio del Fondo 1
    }
  }

  requestAnimationFrame(loop);
}

// ==========================================

// ⏳ CONTROLADOR DE TIEMPO DE ANIMACIÓN

// ==========================================

function contadorAnimacion() {
  // El "limite" (que es 15) es el freno. Si el contador no ha llegado a 15, sigue sumando frames ocultos

  if (idleContadorAnim < limite) {
    idleContadorAnim++;
  }

  // Cuando el contador llega a 15, la computadora da el permiso de cambiar el dibujo en pantalla
  else {
    idleFrameActual++; // Pasa al siguiente frame de la hoja de sprites (ej. del 0 al 1)

    // Si ya llegamos al final de la animación (las hojas de caminar e idle tienen 4 frames: 0, 1, 2, 3)

    if (idleFrameActual === 4) {
      idleFrameActual = 0; // Resetea la animación al primer frame para crear el bucle (loop)
    }

    idleContadorAnim = 0; // Resetea el taxímetro a 0 para volver a esperar otros 15 frames de hardware
  }
}

const duchas = new Image();

duchas.src = "DUCHASIMAGE.png";

const duchaspt2 = new Image();

duchaspt2.src = "duchaspt2.png";

const duchas2 = new Image();

duchas2.src = "DUCHAS2IMAGE.png";

const duchas2pt2 = new Image();

duchas2pt2.src = "DUCHAS2PT2IMAGE.png";

const ImagenAgujeroDuchas = new Image();

ImagenAgujeroDuchas.src = "aguJeroDuchas.png";

const ImagenTVHabitacion1 = new Image();

ImagenTVHabitacion1.src = "HABITACION1TV.png";

const ImagenSujetoHabitacion2 = new Image();

ImagenSujetoHabitacion2.src = "ImagenSujetoHabitacion2.png";

const imagenCinematicaCuchillo = new Image();

imagenCinematicaCuchillo.src = "cinecuchilloreal.png";

const puertaFinalCuchillo = new Image();

puertaFinalCuchillo.src = "PASILLOFINALPUERTACUCHILLO.png";

const puertaFinal7 = new Image();

puertaFinal7.src = "puertafinalducha.png";

const pabellon10 = new Image();

pabellon10.src = "carcelpabellon10.png";

const pabellon9 = new Image();

pabellon9.src = "carcelrojapt2.png";

const pabellon8 = new Image();

pabellon8.src = "carcelroja.png";

const pabellon5 = new Image();

pabellon5.src = "carcelooproto.png";

const pabellon4 = new Image();

pabellon4.src = "carceloopojos.png";

const carcel = new Image();

carcel.src = "carceloop4.png";

const carcelFinalPabellon = new Image();

carcelFinalPabellon.src = "puertafinal.png";

const carcelRojaFinal = new Image();

carcelRojaFinal.src = "carcelrojaFinal.png";

const carcelRojaFinal2 = new Image();

carcelRojaFinal2.src = "carcelRojaFinal2.png";

const pabellon10Final = new Image();

pabellon10Final.src = "carcelPabellon10Final.png";

const idle = new Image();

idle.src = "IDLESPRITEDIABLO.png";

const caminarsheet = new Image();

caminarsheet.src = "CAMINARSHEET.png";

const ataqueSheet = new Image();

ataqueSheet.src = "ATAQUEREAL.png";

// ==========================================

// 🎨 PARTE 6: EL RENDERIZADOR GLOBAL (dibujarTodo)

// ==========================================

function dibujarTodo() {
  let imagenAusar;

  let anchoA_Usar;

  let frameA_Usar;

  // 🎞️ 1. CONTROL DE SPRITES SEGÚN EL ESTADO DE NADIR

  if (estado === "caminar") {
    imagenAusar = caminarsheet;

    anchoA_Usar = idleFrameWidth;

    frameA_Usar = idleFrameActual;
  } else if (estado === "atacar") {
    imagenAusar = ataqueSheet;

    anchoA_Usar = ataqueframeWidth;

    frameA_Usar = loopsI; // Frame exacto de la animación de ataque
  } else {
    imagenAusar = idle;

    anchoA_Usar = idleFrameWidth;

    frameA_Usar = idleFrameActual;
  }

  // 📐 Calcular la posición Y en el suelo (Clavado abajo en la pantalla)

  let nadirY = canvas.height - idleHFrameheight - 50;

  if (escenarioEstatico) {
    ctx.drawImage(imagenFondoActual, 0, 0, canvas.width, canvas.height);
  } else {
    // 🧱 2. RENDERIZADO DE ESCENARIOS (CAPA TRASERA)

    // Dibuja el primer pasillo líder

    ctx.drawImage(
      imagenFondoActual,

      fondoX1,

      0,

      imagenFondoActual.naturalWidth,

      canvas.height,
    );

    // Dibuja el segundo pasillo clonado en paralelo si está dentro del monitor

    if (fondoX2 > -imagenFondoActual.naturalWidth && fondoX2 < canvas.width) {
      ctx.drawImage(
        imagenFondoActual,

        fondoX2,

        0,

        imagenFondoActual.naturalWidth,

        canvas.height,
      );
    }

    // Si rompimos el bucle, engancha el pasillo final extendido justo detrás del primero

    if (imagenContador >= 1) {
      ctx.drawImage(
        imagenFondoActualFinal,

        fondoX1 + imagenFondoActual.naturalWidth,

        0,

        2682,

        canvas.height,
      );
    }
  }

  // 🏃‍♂️ 3. RENDERIZADO DE NADIR (CAPA MEDIA con Efecto Espejo)

  ctx.save(); // Guarda el estado limpio del Canvas

  if (mirandoDerecha === false) {
    // TRUCO MATEMÁTICO: Voltea el lienzo para que el sprite mire a la izquierda

    ctx.translate(nadirX + idleFrameWidth, nadirY);

    ctx.scale(-1, 1); // Invierte el eje horizontal

    // Al estar el lienzo invertido, el punto de dibujo local pasa a ser 0,0

    ctx.drawImage(
      imagenAusar,

      frameA_Usar * anchoA_Usar,

      0, // Coordenadas de corte en la hoja de sprites

      anchoA_Usar,

      idleHFrameheight, // Tamaño del corte

      0,

      0, // Posición de destino local modificada por translate

      anchoA_Usar,

      idleHFrameheight, // Tamaño final en pantalla
    );
  } else {
    // Dibuja a Nadir normal mirando a la derecha

    ctx.drawImage(
      imagenAusar,

      frameA_Usar * anchoA_Usar,

      0,

      anchoA_Usar,

      idleHFrameheight,

      nadirX,

      nadirY,

      anchoA_Usar,

      idleHFrameheight,
    );
  }

  ctx.restore(); // Restaura el Canvas a su estado original para no alterar las siguientes capas

  // 🎬 4. CAPA DE CINEMÁTICAS (CAPA DELANTERA)

  // Si la máquina de estados está en las fases de visión, estira la imagen fija en toda la pantalla

  if (modoCinematica === 2 || modoCinematica === 3 || modoCinematica === 4) {
    ctx.drawImage(
      cinematicaActual.imgCinematica,

      0,

      0,

      canvas.width,

      canvas.height,
    );
  }

  // 🌓 5. CAPA DE FUNDIDO EN NEGRO (TOPE ABSOLUTO)

  // Dibuja un rectángulo sólido que tapa todo el juego regulado por la opacidad de las transiciones

  ctx.globalAlpha = opacidadNegro;

  ctx.fillStyle = "black";

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalAlpha = 1; // Resetea el alfa global a 1 para el próximo frame
}

carcel.onload = () => {
  carcelImg = true;

  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalPabellonimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg &&
    pabellon8Img &&
    duchaspt2Img &&
    pabellon9Img &&
    carcelRojaFinalImg &&
    carcelRojaFinal2Img &&
    carcelPabellon10Img &&
    carcelPabellon10FinalImg &&
    duchas2Img &&
    duchas2pt2Img
  ) {
    if (!animando) {
      animando = true;

      loop();
    }
  }
};

idle.onload = () => {
  nadirImg = true;

  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalPabellonimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg &&
    pabellon8Img &&
    duchaspt2Img &&
    pabellon9Img &&
    carcelRojaFinalImg &&
    carcelRojaFinal2Img &&
    carcelPabellon10Img &&
    carcelPabellon10FinalImg &&
    duchas2Img &&
    duchas2pt2Img
  ) {
    if (!animando) {
      animando = true;

      loop();
    }
  }
};

caminarsheet.onload = () => {
  caminataImg = true;

  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalPabellonimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg &&
    pabellon8Img &&
    duchaspt2Img &&
    pabellon9Img &&
    carcelRojaFinalImg &&
    carcelRojaFinal2Img &&
    carcelPabellon10Img &&
    carcelPabellon10FinalImg &&
    duchas2Img &&
    duchas2pt2Img
  ) {
    if (!animando) {
      animando = true;

      loop();
    }
  }
};

ataqueSheet.onload = () => {
  ataqueImg = true;

  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalPabellonimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg &&
    pabellon8Img &&
    duchaspt2Img &&
    pabellon9Img &&
    carcelRojaFinalImg &&
    carcelRojaFinal2Img &&
    carcelPabellon10Img &&
    carcelPabellon10FinalImg &&
    duchas2Img &&
    duchas2pt2Img
  ) {
    if (!animando) {
      animando = true;

      loop();
    }
  }
};

carcelFinalPabellon.onload = () => {
  carcelFinalPabellonimg = true;

  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalPabellonimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg &&
    pabellon8Img &&
    duchaspt2Img &&
    pabellon9Img &&
    carcelRojaFinalImg &&
    carcelRojaFinal2Img &&
    carcelPabellon10Img &&
    carcelPabellon10FinalImg &&
    duchas2Img &&
    duchas2pt2Img
  ) {
    if (!animando) {
      animando = true;

      loop();
    }
  }
};

pabellon4.onload = () => {
  pabellon4Img = true;

  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalPabellonimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg &&
    pabellon8Img &&
    duchaspt2Img &&
    pabellon9Img &&
    carcelRojaFinalImg &&
    carcelRojaFinal2Img &&
    carcelPabellon10Img &&
    carcelPabellon10FinalImg &&
    duchas2Img &&
    duchas2pt2Img
  ) {
    if (!animando) {
      animando = true;

      loop();
    }
  }
};

pabellon5.onload = () => {
  pabellon5Img = true;

  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalPabellonimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg &&
    pabellon8Img &&
    duchaspt2Img &&
    pabellon9Img &&
    carcelRojaFinalImg &&
    carcelRojaFinal2Img &&
    carcelPabellon10Img &&
    carcelPabellon10FinalImg &&
    duchas2Img &&
    duchas2pt2Img
  )
    if (!animando) {
      animando = true;

      loop();
    }
};

puertaFinal7.onload = () => {
  puertaFinal7Img = true;

  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalPabellonimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg &&
    pabellon8Img &&
    duchaspt2Img &&
    pabellon9Img &&
    carcelRojaFinalImg &&
    carcelRojaFinal2Img &&
    carcelPabellon10Img &&
    carcelPabellon10FinalImg &&
    duchas2Img &&
    duchas2pt2Img
  ) {
    if (!animando) {
      animando = true;

      loop();
    }
  }
};

puertaFinalCuchillo.onload = () => {
  puertaFinalCuchilloImg = true;

  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalPabellonimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg &&
    pabellon8Img &&
    duchaspt2Img &&
    pabellon9Img &&
    carcelRojaFinalImg &&
    carcelRojaFinal2Img &&
    carcelPabellon10Img &&
    carcelPabellon10FinalImg &&
    duchas2Img &&
    duchas2pt2Img
  ) {
    if (!animando) {
      animando = true;

      loop();
    }
  }
};

duchas.onload = () => {
  duchasImg = true;

  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalPabellonimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg &&
    pabellon8Img &&
    duchaspt2Img &&
    pabellon9Img &&
    carcelRojaFinalImg &&
    carcelRojaFinal2Img &&
    carcelPabellon10Img &&
    carcelPabellon10FinalImg &&
    duchas2Img &&
    duchas2pt2Img
  ) {
    if (!animando) {
      animando = true;

      loop();
    }
  }
};

pabellon8.onload = () => {
  pabellon8Img = true;

  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalPabellonimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg &&
    pabellon8Img &&
    duchaspt2Img &&
    pabellon9Img &&
    carcelRojaFinalImg &&
    carcelRojaFinal2Img &&
    carcelPabellon10Img &&
    carcelPabellon10FinalImg &&
    duchas2Img &&
    duchas2pt2Img
  ) {
    if (!animando) {
      animando = true;

      loop();
    }
  }
};

duchaspt2.onload = () => {
  duchaspt2Img = true;

  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalPabellonimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg &&
    pabellon8Img &&
    duchaspt2Img &&
    pabellon9Img &&
    carcelRojaFinalImg &&
    carcelRojaFinal2Img &&
    carcelPabellon10Img &&
    carcelPabellon10FinalImg &&
    duchas2Img &&
    duchas2pt2Img
  ) {
    if (!animando) {
      animando = true;

      loop();
    }
  }
};

pabellon9.onload = () => {
  pabellon9Img = true;

  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalPabellonimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg &&
    pabellon8Img &&
    duchaspt2Img &&
    pabellon9Img &&
    carcelRojaFinalImg &&
    carcelRojaFinal2Img &&
    carcelPabellon10Img &&
    carcelPabellon10FinalImg &&
    duchas2Img &&
    duchas2pt2Img
  ) {
    if (!animando) {
      animando = true;

      loop();
    }
  }
};

carcelRojaFinal.onload = () => {
  carcelRojaFinalImg = true;

  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalPabellonimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg &&
    pabellon8Img &&
    duchaspt2Img &&
    pabellon9Img &&
    carcelRojaFinalImg &&
    carcelRojaFinal2Img &&
    carcelPabellon10Img &&
    carcelPabellon10FinalImg &&
    duchas2Img &&
    duchas2pt2Img
  ) {
    if (!animando) {
      animando = true;

      loop();
    }
  }
};

carcelRojaFinal2.onload = () => {
  carcelRojaFinal2Img = true;

  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalPabellonimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg &&
    pabellon8Img &&
    duchaspt2Img &&
    pabellon9Img &&
    carcelRojaFinalImg &&
    carcelRojaFinal2Img &&
    carcelPabellon10Img &&
    carcelPabellon10FinalImg &&
    duchas2Img &&
    duchas2pt2Img
  ) {
    if (!animando) {
      animando = true;

      loop();
    }
  }
};

pabellon10.onload = () => {
  carcelPabellon10Img = true;

  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalPabellonimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg &&
    pabellon8Img &&
    duchaspt2Img &&
    pabellon9Img &&
    carcelRojaFinalImg &&
    carcelRojaFinal2Img &&
    carcelPabellon10Img &&
    carcelPabellon10FinalImg &&
    duchas2Img &&
    duchas2pt2Img
  ) {
    if (!animando) {
      animando = true;

      loop();
    }
  }
};

pabellon10Final.onload = () => {
  carcelPabellon10FinalImg = true;

  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalPabellonimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg &&
    pabellon8Img &&
    duchaspt2Img &&
    pabellon9Img &&
    carcelRojaFinalImg &&
    carcelRojaFinal2Img &&
    carcelPabellon10Img &&
    carcelPabellon10FinalImg &&
    duchas2Img &&
    duchas2pt2Img
  ) {
    if (!animando) {
      animando = true;

      loop();
    }
  }
};

duchas2.onload = () => {
  duchas2Img = true;

  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalPabellonimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg &&
    pabellon8Img &&
    duchaspt2Img &&
    pabellon9Img &&
    carcelRojaFinalImg &&
    carcelRojaFinal2Img &&
    carcelPabellon10Img &&
    carcelPabellon10FinalImg &&
    duchas2Img &&
    duchas2pt2Img
  ) {
    if (!animando) {
      animando = true;

      loop();
    }
  }
};

duchas2pt2.onload = () => {
  duchas2pt2Img = true;

  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalPabellonimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg &&
    pabellon8Img &&
    duchaspt2Img &&
    pabellon9Img &&
    carcelRojaFinalImg &&
    carcelRojaFinal2Img &&
    carcelPabellon10Img &&
    carcelPabellon10FinalImg &&
    duchas2Img &&
    duchas2pt2Img
  ) {
    if (!animando) {
      animando = true;

      loop();
    }
  }
};
