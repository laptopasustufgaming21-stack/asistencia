// === MÓDULO: REPORTES Y EXPORTACIÓN ===

function cargarReportes(filtro = 'Todos') {
    const cuerpo = document.getElementById('cuerpo-reportes');
    
    let datosFiltrados = SistemaAsistencia.registrosAsistencia;
    
    if (filtro !== 'Todos') {
        datosFiltrados = datosFiltrados.filter(r => r.tipo === filtro);
    }

    if (datosFiltrados.length === 0) {
        cuerpo.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#666;">No hay registros para mostrar.</td></tr>';
        return;
    }

    cuerpo.innerHTML = datosFiltrados.map(reg => `
        <tr>
            <td>${reg.fechaHora}</td>
            <td>${reg.dni}</td>
            <td>${reg.nombreCompleto}</td>
            <td class="tipo-${reg.tipo}">${reg.tipo}</td>
            <td style="color:green; font-weight:bold;">${reg.estado}</td>
        </tr>
    `).join('');
}

function aplicarFiltro() {
    const filtro = document.getElementById('filtro-tipo').value;
    cargarReportes(filtro);
}

function exportarExcel() {
    const filtro = document.getElementById('filtro-tipo').value;
    let datos = SistemaAsistencia.registrosAsistencia;
    
    if (filtro !== 'Todos') {
        datos = datos.filter(r => r.tipo === filtro);
    }

    if (datos.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    // Cabeceras CSV compatible con Excel
    let csv = '\uFEFFFecha y Hora,DNI,Nombre Completo,Nivel de Obligación,Estado\n';
    
    datos.forEach(reg => {
        csv += `"${reg.fechaHora}","${reg.dni}","${reg.nombreCompleto}","${reg.tipo}","${reg.estado}"\n`;
    });

    // Crear descarga
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    
    enlace.href = url;
    enlace.download = `Reporte_Asistencia_Comunidad_StaRosa_Colquijirca_${new Date().toLocaleDateString('es-PE').replace(/\//g,'-')}.xls`;
    enlace.click();
    
    URL.revokeObjectURL(url);
    alert(`✅ Archivo listo: ${datos.length} registros exportados`);
}
