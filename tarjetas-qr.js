// === MÓDULO: TARJETAS QR ===

let tarjetasGeneradas = false;

function generarTodasTarjetas() {
    const contenedor = document.getElementById('contenedor-tarjetas');
    contenedor.innerHTML = '';

    if (SistemaAsistencia.comuneros.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center; color:#666; padding:30px;">Primero registra comuneros en "Administrar Grupos".</p>';
        tarjetasGeneradas = false;
        return;
    }

    SistemaAsistencia.comuneros.forEach(comunero => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-qr';
        tarjeta.setAttribute('data-dni', comunero.dni);
        
        // Datos para QR: solo DNI para verificación segura
        const datosQR = comunero.dni;
        
        tarjeta.innerHTML = `
            <h4 style="color:#155724; margin-bottom:8px;">Comunidad Sta. Rosa de Colquijirca</h4>
            <div class="qr-imagen" id="qr-${comunero.dni}"></div>
            <div class="datos-tarjeta">
                <p class="etiqueta">Nombre Completo</p>
                <p class="valor">${comunero.nombreCompleto}</p>
                <p class="etiqueta">DNI</p>
                <p class="valor">${comunero.dni}</p>
                <p class="etiqueta">Condición</p>
                <p class="valor tipo-${comunero.tipo}">${comunero.tipo}</p>
                <p class="etiqueta">Celular</p>
                <p class="valor">${comunero.celular}</p>
            </div>
        `;
        contenedor.appendChild(tarjeta);

        // Generar código QR
        new QRCode(document.getElementById(`qr-${comunero.dni}`), {
            text: datosQR,
            width: 140,
            height: 140,
            colorDark: '#155724',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
        });
    });

    tarjetasGeneradas = true;
    alert(`✅ Se generaron ${SistemaAsistencia.comuneros.length} tarjetas`);
}

function imprimirTarjetas() {
    if (!tarjetasGeneradas || SistemaAsistencia.comuneros.length === 0) {
        alert('Primero genera las tarjetas pulsando "Generar Todas las Tarjetas"');
        return;
    }
    window.print();
}
