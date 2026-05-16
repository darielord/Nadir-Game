const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const sonidoPuertaFinal = new Audio("PRISONDOOR.mp3");
const sonidoPasos = new Audio("Pasito.mp3");
sonidoPasos.loop = true;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const teclas = {
  aleft: false,
  dright: false,
  ataque: false,
  Einteractuar: false,
};
window.addEventListener("keydown", (e) => {
  if (e.key === "a") {
    teclas.aleft = true;
  }
  if (e.key === "d") {
    teclas.dright = true;
  }
  if (e.key === "e") {
    teclas.Einteractuar = true;
  }
});
window.addEventListener("keyup", (e) => {
  if (e.key === "a") {
    teclas.aleft = false;
  }
  if (e.key === "d") {
    teclas.dright = false;
  }

  if (e.key === "e") {
    teclas.Einteractuar = false;
  }
});

window.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    teclas.ataque = true;
    interruptorLoop = true;
  }
});

window.addEventListener("mouseup", (e) => {
  if (e.button === 0) {
    teclas.ataque = false;
  }
});
let carcelImg = false;
let nadirImg = false;
let caminataImg = false;
let ataqueImg = false;
let carcelFinalimg = false;
let pabellon4Img = false;
let pabellon5Img = false;
let puertaFinal7Img = false;
let puertaFinalCuchilloImg = false;
let duchasImg = false;
let idleFrameWidth = 113;
let idleHFrameheight = 145;
let idleFrameActual = 0;
let idleContadorAnim = 0;
const limite = 15;
let animando = false;
let nadirX = 100;
let velocidad = 6;
let estado = "idle";
let mirandoDerecha = true;
let fondoX1 = 0;
let fondoX2 = 2638;
let anchoMitad = window.innerWidth / 2;
let mitadNadir = idleFrameWidth / 2;
const mitadTodo = anchoMitad - mitadNadir;
let loops = 0;
let loopsI = 0;
const limiteloop = 14;
let interruptorLoop = false;
let ataqueframeWidth = 138;
let imagenContador = 0;
let finalAlcanzado = false;
let opacidadNegro = 0;
let aclarar = false;
let empezarOscurecer = false;
let sonidoPuerta = false;
let ciclosCompletados = 1;
let ciclosCompletadosFinal = 5;
let nadirPasoCuchillo = false;
let modoCinematica = 0;
let contadorCinematica = 0;
let yendoaDuchas = false;
let enDuchas = false;

let imagenFondoActual;
let imagenFondoActualFinal;

function loop() {
  if (enDuchas) {
    imagenFondoActual = duchas;
  } else if (ciclosCompletados < 3) {
    imagenFondoActual = carcel;
  } else if (ciclosCompletados === 3) {
    imagenFondoActual = pabellon4;
  } else if (ciclosCompletados >= 4) {
    imagenFondoActual = pabellon5;
  }

  if (ciclosCompletadosFinal < 5) {
    imagenFondoActualFinal = carcelFinal;
  } else if (ciclosCompletadosFinal === 5) {
    if (!nadirPasoCuchillo) {
      imagenFondoActualFinal = puertaFinalCuchillo;
    } else {
      imagenFondoActualFinal = carcelFinal;
    }
  } else if (ciclosCompletadosFinal === 6) {
    imagenFondoActualFinal = puertaFinal7;
  }

  let inicioCuchillo = fondoX1 + imagenFondoActual.naturalWidth + 1331;
  let finalCuchillo = fondoX1 + imagenFondoActual.naturalWidth + 1477;

  let inicioPuertasDuchas = fondoX1 + imagenFondoActual.naturalWidth + 1050;
  let finalPuertaDuchas = fondoX1 + imagenFondoActual.naturalWidth + 1395;

  let centroNadir = nadirX + idleFrameWidth / 2;

  if (
    centroNadir > inicioPuertasDuchas &&
    centroNadir < finalPuertaDuchas &&
    ciclosCompletados === 6 &&
    teclas.Einteractuar &&
    !empezarOscurecer
  ) {
    empezarOscurecer = true;
    sonidoPuerta = true;
    yendoaDuchas = true;
    sonidoPuertaFinal.play();
  }
  if (
    centroNadir > inicioCuchillo &&
    centroNadir < finalCuchillo &&
    ciclosCompletadosFinal === 5 &&
    !nadirPasoCuchillo &&
    modoCinematica === 0
  ) {
    modoCinematica = 1;
    velocidad = 0;
    estado = "idle";
    sonidoPasos.pause();
  }

  switch (modoCinematica) {
    case 1:
      opacidadNegro += 0.005;
      if (opacidadNegro >= 1) {
        modoCinematica = 2;
      }
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
      if (contadorCinematica >= 150) {
        modoCinematica = 4;
      }
      break;

    case 4:
      opacidadNegro += 0.002;
      if (opacidadNegro >= 1) {
        opacidadNegro = 1;
        nadirPasoCuchillo = true;
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
      }
      break;
  }

  if (opacidadNegro >= 1 && modoCinematica === 0) {
    if (yendoaDuchas) {
      enDuchas = true;
      imagenFondoActual = duchas;
      yendoaDuchas = false;
    } else if (!yendoaDuchas) {
      ciclosCompletados++;
      ciclosCompletadosFinal++;
    }

    nadirX = 100;
    fondoX1 = 0;
    fondoX2 = imagenFondoActual.naturalWidth;
    finalAlcanzado = false;
    imagenContador = 0;
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
    empezarOscurecer = true;
    sonidoPuerta = true;
  }
  if (empezarOscurecer && sonidoPuerta) {
    opacidadNegro += 0.01;
    sonidoPuertaFinal.play();
  }
  if (
    imagenContador === 1 &&
    fondoX1 +
      imagenFondoActual.naturalWidth +
      imagenFondoActualFinal.naturalWidth <=
      canvas.width
  ) {
    finalAlcanzado = true;
    fondoX1 =
      canvas.width -
      imagenFondoActual.naturalWidth -
      imagenFondoActualFinal.naturalWidth;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dibujarTodo();
  contador();

  if (!interruptorLoop) {
    if (teclas.dright === true) {
      mirandoDerecha = true;

      if (
        nadirX < mitadTodo ||
        (finalAlcanzado === true && nadirX < canvas.width - idleFrameWidth)
      ) {
        nadirX = nadirX + velocidad;
      } else if (finalAlcanzado === false) {
        fondoX1 = fondoX1 - velocidad;
        fondoX2 = fondoX2 - velocidad;
      }
    }
    if (teclas.aleft === true) {
      mirandoDerecha = false;
      let habitacionPermiteRegreso = finalAlcanzado === false || enDuchas;
      if (fondoX1 < 0 && habitacionPermiteRegreso) {
        fondoX1 = fondoX1 + velocidad;
        fondoX2 = fondoX2 + velocidad;
      } else if (nadirX > 0) {
        nadirX = nadirX - velocidad;
        if (nadirX < 0) {
          nadirX = 0;
        }
      }
    }
  }
  if (modoCinematica === 0) {
    if (interruptorLoop) {
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
          interruptorLoop = false;
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
  requestAnimationFrame(loop);
}

function contador() {
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

const duchas = new Image();
duchas.src = "DUCHASIMG.png";

const imagenCinematica = new Image();
imagenCinematica.src = "cinecuchilloreal.png";

const puertaFinalCuchillo = new Image();
puertaFinalCuchillo.src = "PASILLOFINALPUERTACUCHILLO.png";

const puertaFinal7 = new Image();
puertaFinal7.src = "puertafinalducha.png";

const pabellon5 = new Image();
pabellon5.src = "carcelooproto.png";

const pabellon4 = new Image();
pabellon4.src = "carceloopojos.png";

const carcel = new Image();
carcel.src = "carceloop4.png";

const carcelFinal = new Image();
carcelFinal.src = "puertafinal.png";

const idle = new Image();
idle.src = "IDLESPRITEDIABLO.png";

const caminarsheet = new Image();
caminarsheet.src = "CAMINARSHEET.png";

const ataqueSheet = new Image();
ataqueSheet.src = "ATAQUEREAL.png";

function dibujarTodo() {
  let imagenAusar;
  let anchoA_Usar;
  let frameA_Usar;

  if (estado === "caminar") {
    imagenAusar = caminarsheet;
    anchoA_Usar = idleFrameWidth;
    frameA_Usar = idleFrameActual;
  } else if (estado === "atacar") {
    anchoA_Usar = ataqueframeWidth;
    frameA_Usar = loopsI;
    imagenAusar = ataqueSheet;
  } else {
    imagenAusar = idle;
    anchoA_Usar = idleFrameWidth;
    frameA_Usar = idleFrameActual;
  }

  let nadirY = canvas.height - idleHFrameheight - 50;
  ctx.drawImage(
    imagenFondoActual,
    fondoX1,
    0,
    imagenFondoActual.naturalWidth,
    canvas.height,
  );
  if (fondoX2 > -imagenFondoActual.naturalWidth && fondoX2 < canvas.width) {
    ctx.drawImage(
      imagenFondoActual,
      fondoX2,
      0,
      imagenFondoActual.naturalWidth,
      canvas.height,
    );
  }

  // 3. Dibuja la PUERTA FINAL enganchada a la líder si ya llegamos a la meta
  // Se dibuja AL MISMO TIEMPO que las otras para cubrir el hueco
  if (imagenContador >= 1) {
    ctx.drawImage(
      imagenFondoActualFinal,
      fondoX1 + imagenFondoActual.naturalWidth,
      0,
      2682,
      canvas.height,
    );
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

  if (modoCinematica === 2 || modoCinematica === 3 || modoCinematica === 4) {
    ctx.drawImage(imagenCinematica, 0, 0, canvas.width, canvas.height);
  }

  ctx.globalAlpha = opacidadNegro;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
}

carcel.onload = () => {
  carcelImg = true;
  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg
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
    carcelFinalimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg
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
    carcelFinalimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg
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
    carcelFinalimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg
  ) {
    if (!animando) {
      animando = true;
      loop();
    }
  }
};
carcelFinal.onload = () => {
  carcelFinalimg = true;
  if (
    carcelImg &&
    nadirImg &&
    caminataImg &&
    ataqueImg &&
    carcelFinalimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg
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
    carcelFinalimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg
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
    carcelFinalimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg
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
    carcelFinalimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg
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
    carcelFinalimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg
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
    carcelFinalimg &&
    pabellon4Img &&
    pabellon5Img &&
    puertaFinal7Img &&
    puertaFinalCuchilloImg &&
    duchasImg
  ) {
    if (!animando) {
      animando = true;
      loop();
    }
  }
};
