import { useEffect, useState, useRef } from "react";
import "./index.css";

function App() {
  const AmbientePrision = useRef(new Audio("PRISIONAMBIENTE.flac"));

  const [juegoActivo, setJuegoActivo] = useState(false);
  useEffect(() => {
    // ==========================================
    // 🎥 CONFIGURACIÓN DEL LIENZO (CANVAS)
    // ==========================================
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) return;
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
    AmbientePrision.current.play();

    AmbientePrision.current.loop = true;
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

    const manejarKeyDown = (e) => {
      if (e.key === "a") teclas.aleft = true;
      if (e.key === "d") teclas.dright = true;
      if (e.key === "e") teclas.Einteractuar = true;
    };

    const manejarKeyUp = (e) => {
      if (e.key === "a") teclas.aleft = false;
      if (e.key === "d") teclas.dright = false;
      if (e.key === "e") teclas.Einteractuar = false;
    };

    const manejarMouseDown = (e) => {
      if (e.button === 0) {
        teclas.ataque = true;
        bloqueoMovimiento = true; // El freno de mano que bloquea el movimiento
      }
    };

    const manejarMouseUp = (e) => {
      if (e.button === 0) {
        teclas.ataque = false;
      }
    };

    window.addEventListener("keydown", manejarKeyDown);
    window.addEventListener("keyup", manejarKeyUp);
    window.addEventListener("mousedown", manejarMouseDown);
    window.addEventListener("mouseup", manejarMouseUp);

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

    // ==========================================
    // 🖼️ INSTANCIACIÓN DE IMÁGENES
    // ==========================================
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
    const NadirFinal = new Image();
    NadirFinal.src = "NADIRPABELLON11.png";

    // ==========================================
    // ⏳ CONTROLADOR DE TIEMPO DE ANIMACIÓN
    // ==========================================
    function contadorAnimacion() {
      if (idleContadorAnim < limite) {
        idleContadorAnim++;
      } else {
        idleFrameActual++;
        if (idleFrameActual === 4) {
          idleFrameActual = 0;
        }
        idleContadorAnim = 0;
      }
    }

    // ==========================================
    // 🎨 RENDERIZADOR GLOBAL (dibujarTodo)
    // ==========================================
    function dibujarTodo() {
      let imagenAusar;
      let anchoA_Usar;
      let frameA_Usar;

      if (estado === "caminar") {
        imagenAusar = caminarsheet;
        anchoA_Usar = idleFrameWidth;
        frameA_Usar = idleFrameActual;
      } else if (estado === "atacar") {
        imagenAusar = ataqueSheet;
        anchoA_Usar = ataqueframeWidth;
        frameA_Usar = loopsI;
      } else {
        imagenAusar = idle;
        anchoA_Usar = idleFrameWidth;
        frameA_Usar = idleFrameActual;
      }

      let nadirY = canvas.height - idleHFrameheight - 50;

      if (escenarioEstatico) {
        ctx.drawImage(imagenFondoActual, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.drawImage(
          imagenFondoActual,
          fondoX1,
          0,
          imagenFondoActual.naturalWidth,
          canvas.height,
        );

        if (
          fondoX2 > -imagenFondoActual.naturalWidth &&
          fondoX2 < canvas.width
        ) {
          ctx.drawImage(
            imagenFondoActual,
            fondoX2,
            0,
            imagenFondoActual.naturalWidth,
            canvas.height,
          );
        }

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

      ctx.save();
      if (mirandoDerecha === false) {
        ctx.translate(nadirX + idleFrameWidth, nadirY);
        ctx.scale(-1, 1);
        ctx.drawImage(
          imagenAusar,
          frameA_Usar * anchoA_Usar,
          0,
          anchoA_Usar,
          idleHFrameheight,
          0,
          0,
          anchoA_Usar,
          idleHFrameheight,
        );
      } else {
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
      ctx.restore();

      if (
        modoCinematica === 2 ||
        modoCinematica === 3 ||
        modoCinematica === 4
      ) {
        ctx.drawImage(
          cinematicaActual.imgCinematica,
          0,
          0,
          canvas.width,
          canvas.height,
        );
      }

      ctx.globalAlpha = opacidadNegro;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }

    // ==========================================
    // 🌀 EL BUCLE DEL MOTOR (LOOP)
    // ==========================================
    let idAnimacion;

    function loop() {
      if (!juegoActivo) {
        requestAnimationFrame(loop);
        return;
      }

      // 🗺️ MÁQUINA DE ESTADOS DE ESCENARIOS (MUNDOS)
      if (enDuchas) {
        maxPantallasEstaticas = 1;
        AmbienteDuchas.play();
        AmbientePrision.pause();
        if (sumadorEscenarioEstatico === 0) {
          imagenFondoActual = duchas;
        } else if (sumadorEscenarioEstatico === 1) {
          imagenFondoActual = duchaspt2;
        }
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
      } else {
        if (ciclosCompletados < 3) {
          imagenFondoActual = carcel;
        } else if (ciclosCompletados === 3) {
          imagenFondoActual = pabellon4;
          AmbientePabellon4.play();
          AmbientePrision.pause();
          AmbientePrision.currentTime = 0;
        } else if (ciclosCompletados === 4 || ciclosCompletados === 5) {
          imagenFondoActual = pabellon5;
          AmbientePabellon5.play();
          AmbientePabellon4.pause();
          AmbientePabellon4.currentTime = 0;
          AmbientePrision.pause();
          AmbientePrision.currentTime = 0;
        } else if (ciclosCompletados === 6) {
          AmbienteDuchas.pause();
          AmbienteDuchas.currentTime = 0;
          imagenFondoActual = pabellon5;
          AmbientePrision.pause();
          AmbientePrision.currentTime = 0;
          AmbientePabellon5.pause();
          AmbientePabellon5.currentTime = 0;
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

        if (ciclosCompletadosFinal < 5) {
          imagenFondoActualFinal = carcelFinalPabellon;
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

      // 📐 DETECTOR DE PROXIMIDAD (HITBOXES)
      let inicioCuchillo = fondoX1 + imagenFondoActual.naturalWidth + 1331;
      let finalCuchillo = fondoX1 + imagenFondoActual.naturalWidth + 1477;
      let inicioPuertasDuchas = fondoX1 + imagenFondoActual.naturalWidth + 1050;
      let finalPuertaDuchas = fondoX1 + imagenFondoActual.naturalWidth + 1395;
      let inicioPuertaDuchas2 = fondoX1 + imagenFondoActual.naturalWidth + 1044;
      let finalPuertaDuchas2 = fondoX1 + imagenFondoActual.naturalWidth + 1790;
      let agujeroDuchasInicio = (655 / 853) * canvas.width;
      let agujeroDuchasFinal = (746 / 853) * canvas.width;
      let agujeroDuchas2Inicio = (1974 / 2638) * canvas.width;
      let agujeroDuchas2Final = (2110 / 2638) * canvas.width;
      let centroNadir = nadirX + idleFrameWidth / 2;

      // 🎬 CINEMÁTICAS INTERACTIVAS
      if (!escenarioEstatico) {
        if (
          centroNadir > inicioCuchillo &&
          centroNadir < finalCuchillo &&
          ciclosCompletadosFinal === 5 &&
          !nadirPasoCuchillo &&
          modoCinematica === 0
        ) {
          cinematicaActual.imgCinematica = imagenCinematicaCuchillo;
          cinematicaActual.tiempoCinematica = 150;
          cinematicaActual.idCinematica = "CUCHILLO";
          modoCinematica = 1;
          velocidad = 0;
          estado = "idle";
          sonidoPasos.pause();
        }

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
              pucht = 0;
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
        centroNadir < agujeroDuchas2Final &&
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

      // 🎞️ MÁQUINA DE ESTADOS VISUALES (SWITCH)
      switch (modoCinematica) {
        case 1:
          opacidadNegro += 0.005;
          if (opacidadNegro >= 1) modoCinematica = 2;
          break;
        case 2:
          opacidadNegro -= 0.002;
          if (opacidadNegro <= 0) {
            opacidadNegro = 0;
            modoCinematica = 3;
          }
          break;
        case 3:
          contadorCinematica++;
          if (contadorCinematica >= cinematicaActual.tiempoCinematica)
            modoCinematica = 4;
          break;
        case 4:
          opacidadNegro += 0.002;
          if (opacidadNegro >= 1) {
            opacidadNegro = 1;
            if (cinematicaActual.idCinematica === "CUCHILLO")
              nadirPasoCuchillo = true;
            else if (cinematicaActual.idCinematica === "AGUJERO")
              eventoDuchasCompletado = true;
            else if (cinematicaActual.idCinematica === "AGUJERO2")
              eventoDuchas2Completado = true;
            modoCinematica = 5;
          }
          break;
        case 5:
          opacidadNegro -= 0.005;
          if (opacidadNegro <= 0) {
            opacidadNegro = 0;
            modoCinematica = 0;
            velocidad = 6;
            contadorCinematica = 0;
            empezarOscurecer = false;
            aclarar = false;
            sonidoPuerta = false;
            cinematicaActual = {};
          }
          break;
      }

      // INTERRUPTORES DE TRANSICIÓN DE MAPAS
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
        } else if (ciclosCompletadosFinal === 9) {
          cinematicaActual.imgCinematica = NadirFinal;
          cinematicaActual.tiempoCinematica = Infinity;
          cinematicaActual.idCinematica = "NadirFinal";
          modoCinematica = 3;
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
            sonidoPuertaFinal.play();
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

      // 🏃‍♂️ MOTOR DE FÍSICA Y MOVIMIENTO
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

      if (!bloqueoMovimiento) {
        if (teclas.dright === true) {
          mirandoDerecha = true;
          if (escenarioEstatico) {
            nadirX = nadirX + velocidad;
          } else {
            if (
              nadirX < mitadTodo ||
              (finalAlcanzado === true &&
                nadirX < canvas.width - idleFrameWidth)
            ) {
              nadirX = nadirX + velocidad;
            } else if (finalAlcanzado === false) {
              fondoX1 = fondoX1 - velocidad;
              fondoX2 = fondoX2 - velocidad;
            }
          }
        }

        if (teclas.aleft === true) {
          mirandoDerecha = false;
          if (escenarioEstatico) {
            nadirX = nadirX - velocidad;
          } else {
            if (fondoX1 < 0 && finalAlcanzado === false) {
              fondoX1 = fondoX1 + velocidad;
              fondoX2 = fondoX2 + velocidad;
            } else if (nadirX > 0) {
              nadirX = nadirX - velocidad;
              if (nadirX < 0) nadirX = 0;
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

      // 🌀 RECIRCULACIÓN INFINITA DE FONDOS
      if (fondoX1 <= -imagenFondoActual.naturalWidth) {
        if (imagenContador < 1) {
          imagenContador++;
          fondoX1 = fondoX2 + imagenFondoActual.naturalWidth;
        }
      }
      if (fondoX2 <= -imagenFondoActual.naturalWidth) {
        if (imagenContador < 1) {
          fondoX2 = fondoX1 + imagenFondoActual.naturalWidth;
        }
      }
      if (fondoX1 > imagenFondoActual.naturalWidth) {
        if (imagenContador < 1) {
          fondoX1 = fondoX2 - imagenFondoActual.naturalWidth;
        }
      }
      if (fondoX2 > imagenFondoActual.naturalWidth) {
        if (imagenContador < 1) {
          fondoX2 = fondoX1 - imagenFondoActual.naturalWidth;
        }
      }

      idAnimacion = requestAnimationFrame(loop);
    }

    // ==========================================
    // 🚀 CONTROL DE ARRANQUE TRAS CARGA BASE
    // ==========================================
    carcel.onload = () => {
      imagenFondoActual = carcel; // Inicialización de seguridad
      if (!animando) {
        animando = true;
        loop();
      }
    };

    // Por si las moscas la imagen líder ya estaba en caché
    if (carcel.complete) {
      carcel.onload();
    }

    // 🧹 LIMPIEZA TOTAL EN CASO DE DESMONTE (PREVENCIÓN DE MEMORY LEAKS)
    return () => {
      cancelAnimationFrame(idAnimacion);
      window.removeEventListener("keydown", manejarKeyDown);
      window.removeEventListener("keyup", manejarKeyUp);
      window.removeEventListener("mousedown", manejarMouseDown);
      window.removeEventListener("mouseup", manejarMouseUp);
      sonidoPasos.pause();
      if (!juegoActivo) {
        AmbientePrision.current.pause();
      }
      AmbientePabellon4.pause();
      AmbientePabellon5.pause();
      AmbientecarcelRoja.pause();
      AmbientecarcelRoja2.pause();
      AmbienteDuchas.pause();
      AmbientePabellon10.pause();
      AmbienteDuchas2.pause();
    };
  }, [juegoActivo]);

  return (
    <div className="game-container">
      <canvas id="gameCanvas"></canvas>
      {!juegoActivo && (
        <div
          className="capa-menu-flotante"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          {/*Caja contenedora con el boton de Start */}
          <div className="menu-inicio">
            <h1>NADIR</h1>
            <button
              onClick={() => {
                setJuegoActivo(true);
              }}
              style={{
                backgroundColor: "#0A0A0A",

                width: "150px",
                height: "70px",
                fontSize: "30px",
                fontWeight: "bold",
                textTransform: "uppercase",
                border: "none",
                borderRadius: "20px",
                color: "white",
              }}
            >
              Start
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
