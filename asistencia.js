// === MÓDULO: REGISTRO DE ASISTENCIA ===

let escaneador = null;
let camaraActiva = false;

async function inicializarCamara() {
    const selector = document.getElementById('selector-camara');
    selector.innerHTML = '<option value="">Cargando cámaras...</option>';

    try {
        const dispositivos = await Html5Qrcode.getCameras();
        selector.innerHTML = '';
        
        if (dispositivos.length === 0) {
            selector.innerHTML = '<option value="">No se detectaron cámaras</option>';
            return;
        }

        dispositivos.forEach((cam, idx) => {
            selector.innerHTML += `<option value="${cam.id}">${cam.label || `Cámara ${idx+1}`}</option>`;
        });
    } catch (err) {
        console.error('Error al listar cámaras:', err);
        document.getElementById('estado-escaneo').textContent = '⚠️ Permita acceso a la cámara';
    }

    // Cargar lista del día al entrar
    cargarListaAsistencia();
}

document.getElementById('btn-iniciar-camara').addEventListener('click', async () => {
    const selector = document.getElementById('selector-camara');
    const camaraId = selector.value;

    if (!camaraId) {
        alert('Seleccione una cámara primero');
        return;
    }

    if (camaraActiva) return;

    try {
        escaneador = new Html5Qrcode('visor-camara');
        
        await escaneador.start(
            camaraId,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (datosDecodificados) => {
                // Éxito al leer QR → datos = DNI
                procesarCodigoQR(datosDecodificados);
            },
            (error) => {
                // Lectura en proceso (no mostrar errores)
                document.getElementById('estado-escaneo').textContent = '📡 Escaneando...';
            }
        );

        camaraActiva = true;
        document.getElementById('btn-iniciar-camara').style.display = 'none';
        document.getElementById('btn-detener-camara').style.display = 'inline-block';
        document.getElementById('estado-escaneo').textContent = '✅ Cámara activa - Escanee el código QR';

    } catch (err) {
        console.error('Error al iniciar cámara:', err);
        alert('No se pudo acceder a la cámara: ' + err.message);
    }
});

document.getElementById('btn-detener-camara').addEventListener('click', async () => {
    if (escaneador && camaraActiva) {
        await escaneador.stop();
        camaraActiva = false;
        document.getElementById('btn-iniciar-camara').style.display = 'inline-block';
        document.getElementById('btn-detener-camara').style.display = 'none';
        document.getElementById('estado-escaneo').textContent = 'Cámara detenida';
    }
});

function procesarCodigoQR(dniEscaneado) {
    const comunero = SistemaAsistencia.buscarComuneroPorDNI(dniEscaneado);
    
    if (!comunero) {
        document.getElementById('estado-escaneo').innerHTML = '❌ Comunero NO registrado: ' + dniEscaneado;
        return;
    }

    // Registrar asistencia
    SistemaAsistencia.registrarAsistencia(comunero);
    document.getElementById('estado-escaneo').innerHTML = 
        `✅ <strong>${comunero.nombreCompleto}</strong> — Asistencia registrada (${comunero.tipo})`;
    
    cargarListaAsistencia();
}

function cargarListaAsistencia() {
    const cuerpo = document.getElementById('cuerpo-asistencia');
    
    if (SistemaAsistencia.registrosAsistencia.length === 0) {
        cuerpo.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#666;">Sin registros hoy. Escanee un código QR.</td></tr>';
        return;
    }

    cuerpo.innerHTML = SistemaAsistencia.registrosAsistencia.map(reg => `
        <tr>
            <td>${reg.dni}</td>
            <td>${reg.nombreCompleto}</td>
            <td>✅ ${reg.fechaHora}</td>
            <td class="tipo-${reg.tipo}">${reg.tipo}</td>
            <td>
                <button onclick="quitarRegistroAsistencia('${reg.id}')" style="background:#dc3545; color:white; padding:5px 10px; font-size:0.8rem;">Quitar</button>
            </td>
        </tr>
    `).join('');
}

function quitarRegistroAsistencia(idRegistro) {
    if (!confirm('¿Quitar este registro de asistencia?')) return;
    SistemaAsistencia.quitarRegistro(idRegistro);
    cargarListaAsistencia();
}
