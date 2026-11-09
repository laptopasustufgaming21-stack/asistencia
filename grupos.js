// === MÓDULO: ADMINISTRAR GRUPOS ===

document.getElementById('form-comunero').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombreCompleto = document.getElementById('nombre-completo').value.trim();
    const dni = document.getElementById('dni-comunero').value.trim();
    const tipo = document.getElementById('tipo-comunero').value;
    const celular = document.getElementById('celular-comunero').value.trim();

    // Validar DNI único
    if (SistemaAsistencia.buscarComuneroPorDNI(dni)) {
        alert(`⚠️ Ya existe un comunero con DNI ${dni}`);
        return;
    }

    // Validaciones básicas
    if (dni.length !== 8) {
        alert('⚠️ El DNI debe tener 8 dígitos');
        return;
    }
    if (celular.length !== 9) {
        alert('⚠️ El celular debe tener 9 dígitos');
        return;
    }

    // Agregar comunero
    const nuevoComunero = {
        dni,
        nombreCompleto,
        tipo,
        celular
    };

    SistemaAsistencia.comuneros.push(nuevoComunero);
    SistemaAsistencia.guardarComuneros();
    
    alert('✅ Comunero registrado correctamente');
    this.reset();
    cargarListaComuneros();
});

function cargarListaComuneros() {
    const lista = document.getElementById('lista-comuneros');
    const total = document.getElementById('total-comuneros');
    
    total.textContent = SistemaAsistencia.comuneros.length;
    
    if (SistemaAsistencia.comuneros.length === 0) {
        lista.innerHTML = '<p style="text-align:center; color:#666; padding:20px;">No hay comuneros registrados aún.</p>';
        return;
    }

    lista.innerHTML = SistemaAsistencia.comuneros.map(c => `
        <div style="padding:12px; border-bottom:1px solid #ddd; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div>
                <strong>${c.nombreCompleto}</strong><br>
                DNI: ${c.dni} | Cel: ${c.celular}
            </div>
            <span class="tipo-${c.tipo}">${c.tipo}</span>
            <button onclick="eliminarComunero('${c.dni}')" style="background:#dc3545; color:white; padding:6px 12px; font-size:0.85rem;">Eliminar</button>
        </div>
    `).join('');
}

function eliminarComunero(dni) {
    if (!confirm('¿Seguro de eliminar este comunero? Esta acción no se deshace.')) return;
    
    SistemaAsistencia.comuneros = SistemaAsistencia.comuneros.filter(c => c.dni !== dni);
    SistemaAsistencia.guardarComuneros();
    cargarListaComuneros();
}
