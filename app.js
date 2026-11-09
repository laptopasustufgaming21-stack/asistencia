// === DATOS CENTRALES DEL SISTEMA ===
const SistemaAsistencia = {
    comuneros: JSON.parse(localStorage.getItem('comuneros')) || [],
    registrosAsistencia: JSON.parse(localStorage.getItem('registrosAsistencia')) || [],

    guardarComuneros() {
        localStorage.setItem('comuneros', JSON.stringify(this.comuneros));
    },

    guardarRegistros() {
        localStorage.setItem('registrosAsistencia', JSON.stringify(this.registrosAsistencia));
    },

    buscarComuneroPorDNI(dni) {
        return this.comuneros.find(c => c.dni === dni);
    },

    registrarAsistencia(comunero) {
        const ahora = new Date();
        const registro = {
            id: `${comunero.dni}-${ahora.toISOString()}`,
            fechaHora: ahora.toLocaleString('es-PE'),
            dni: comunero.dni,
            nombreCompleto: comunero.nombreCompleto,
            tipo: comunero.tipo,
            estado: 'Presente'
        };
        this.registrosAsistencia.unshift(registro);
        this.guardarRegistros();
        return registro;
    },

    quitarRegistro(idRegistro) {
        this.registrosAsistencia = this.registrosAsistencia.filter(r => r.id !== idRegistro);
        this.guardarRegistros();
    }
};

// === NAVEGACIÓN PRINCIPAL ===
function mostrarSeccion(nombreSeccion) {
    // Ocultar todo
    document.querySelectorAll('.seccion').forEach(sec => sec.classList.add('oculto'));
    // Mostrar la seleccionada
    document.getElementById(`seccion-${nombreSeccion}`).classList.remove('oculto');
    
    // Cargar datos según sección
    if (nombreSeccion === 'grupos') cargarListaComuneros();
    if (nombreSeccion === 'tarjetas') generarTodasTarjetas();
    if (nombreSeccion === 'asistencia') inicializarCamara();
    if (nombreSeccion === 'reportes') cargarReportes();
}

function volverMenu() {
    document.querySelectorAll('.seccion').forEach(sec => sec.classList.add('oculto'));
}
