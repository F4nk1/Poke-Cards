// UIController mejorado - JavaScript puro sin HTML mezclado
import Game from "../clases/Game.js";

const TIPOS_ES = {
    fire: "FUEGO",
    water: "AGUA",
    grass: "PLANTA",
    electric: "ELÉCTRICO",
    ice: "HIELO",
    fighting: "LUCHA",
    poison: "VENENO",
    ground: "TIERRA",
    flying: "VOLADOR",
    psychic: "PSÍQUICO",
    bug: "BICHO",
    rock: "ROCA",
    ghost: "FANTASMA",
    dragon: "DRAGÓN",
    dark: "SINIESTRO",
    steel: "ACERO",
    fairy: "HADA",
    normal: "NORMAL"
};

const Efectividades = {
    steel: { steel: 0.5, water: 0.5, electric: 0.5, fire: 0.5, fairy: 2, ice: 2, rock: 2 },
    water: { water: 0.5, dragon: 0.5, fire: 2, grass: 0.5, rock: 2, ground: 2 },
    bug: { steel: 0.5, ghost: 0.5, fire: 0.5, fairy: 0.5, fighting: 0.5, grass: 2, psychic: 2, dark: 2, poison: 0.5, flying: 0.5 },
    dragon: { ice: 0.5, dragon: 2, fairy: 0 },
    electric: { water: 2, dragon: 0.5, electric: 0.5, grass: 0.5, ground: 0, flying: 2 },
    ghost: { ghost: 2, normal: 0, psychic: 2, dark: 0.5 },
    fire: { steel: 2, water: 0.5, bug: 2, dragon: 0.5, fire: 0.5, ice: 2, grass: 2, rock: 0.5 },
    fairy: { steel: 0.5, dragon: 2, fire: 0.5, fighting: 2, dark: 2, poison: 0.5 },
    ice: { steel: 0.5, water: 0.5, dragon: 2, fire: 0.5, ice: 0.5, grass: 2, ground: 2, flying: 2 },
    fighting: { steel: 2, bug: 0.5, ghost: 0, fairy: 0.5, ice: 2, normal: 2, psychic: 0.5, rock: 2, dark: 2, poison: 0.5, flying: 0.5 },
    normal: { steel: 0.5, ghost: 0, rock: 0.5 },
    grass: { steel: 0.5, water: 2, bug: 0.5, dragon: 0.5, fire: 0.5, grass: 0.5, rock: 2, ground: 2, poison: 0.5, flying: 0.5 },
    psychic: { steel: 0.5, fighting: 2, psychic: 0.5, dark: 0, poison: 2 },
    rock: { steel: 0.5, bug: 2, fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2 },
    dark: { ghost: 2, fairy: 0.5, fighting: 0.5, psychic: 2, dark: 0.5 },
    ground: { steel: 2, bug: 0.5, electric: 2, fire: 2, grass: 0.5, rock: 2, poison: 2, flying: 0 },
    poison: { steel: 0, ghost: 0.5, fairy: 2, grass: 2, rock: 0.5, ground: 0.5, poison: 0.5 },
    flying: { steel: 0.5, bug: 2, electric: 0.5, fighting: 2, grass: 2, rock: 0.5 }
};

const Resistencias = {
    normal: { fighting: 2, ghost: 0 },
    fire: { fire: 0.5, grass: 0.5, ice: 0.5, bug: 0.5, steel: 0.5, fairy: 0.5, water: 2, ground: 2, rock: 2 },
    water: { fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5, grass: 2, electric: 2 },
    electric: { electric: 0.5, flying: 0.5, steel: 0.5, ground: 2 },
    grass: { water: 0.5, electric: 0.5, grass: 0.5, ground: 0.5, fire: 2, ice: 2, poison: 2, flying: 2, bug: 2 },
    ice: { ice: 0.5, fire: 2, fighting: 2, rock: 2, steel: 2 },
    fighting: { bug: 0.5, rock: 0.5, dark: 0.5, flying: 2, psychic: 2, fairy: 2 },
    poison: { grass: 0.5, fighting: 0.5, poison: 0.5, bug: 0.5, ground: 2, psychic: 2 },
    ground: { poison: 0.5, rock: 0.5, electric: 0, water: 2, grass: 2, ice: 2 },
    flying: { grass: 0.5, fighting: 0.5, bug: 0.5, electric: 2, ice: 2, rock: 2 },
    psychic: { fighting: 0.5, psychic: 0.5, bug: 2, ghost: 2, dark: 2 },
    bug: { grass: 0.5, fighting: 0.5, ground: 0.5, fire: 2, flying: 2, rock: 2 },
    rock: { normal: 0.5, fire: 0.5, poison: 0.5, flying: 0.5, water: 2, grass: 2, fighting: 2, ground: 2, steel: 2 },
    ghost: { poison: 0.5, bug: 0.5, normal: 0, fighting: 0, ghost: 2, dark: 2 },
    dragon: { fire: 0.5, water: 0.5, grass: 0.5, electric: 0.5, ice: 2, dragon: 2, fairy: 2 },
    dark: { ghost: 0.5, dark: 0.5, psychic: 0, fighting: 2, bug: 2, fairy: 2 },
    steel: { normal: 0.5, grass: 0.5, ice: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 0.5, dragon: 0.5, steel: 0.5, fairy: 0.5, fire: 2, fighting: 2, ground: 2, poison: 0 },
    fairy: { fighting: 0.5, bug: 0.5, dark: 0.5, dragon: 0, steel: 2, poison: 2 }
};

export default class UIController {
    constructor(game) {
        this.game = game;
        this.elementos = this.inicializarElementos();
        this.idxAtacante = null;
        this.idxObjetivo = null;
    }

    /**
     * Inicializa referencias a elementos DOM
     */
    inicializarElementos() {
        return {
            turno: document.getElementById("Indicar_turno"),
            historial: document.getElementById("Carga"),
            templateCarta: document.getElementById("Diseno_Carta"),
            manoJugador: document.getElementById("ManoJugador"),
            manoRival: document.getElementById("ManoRival"),
            seleccionJugador: document.getElementById("SeleccionJugador"),
            seleccionRival: document.getElementById("SeleccionRival")
        };
    }

    /**
     * Obtiene el tipo principal de una carta
     */
    obtenerTipoPrincipal(tipos) {
        if (!tipos || tipos.length === 0) return 'normal';
        return tipos[0].toLowerCase();
    }

    /**
     * Crea elemento DOM con clases y contenido
     */
    crearElemento(tag, clases = [], contenido = '') {
        const elemento = document.createElement(tag);
        if (clases.length > 0) {
            elemento.className = clases.join(' ');
        }
        if (contenido) {
            elemento.textContent = contenido;
        }
        return elemento;
    }

    /**
     * Configura los tipos de la carta
     */
    configurarTipos(carta, container) {
        this.limpiarContainer(container);
        
        const tipos = carta.Tipos || ['normal'];
        tipos.forEach(tipo => {
            const tipoElement = this.crearElemento('div', [`Tipo`, `tipo-${tipo.toLowerCase()}`]);
            container.appendChild(tipoElement);
        });
    }

    /**
     * Configura las habilidades de la carta
     */
    configurarHabilidades(carta, container) {
        this.limpiarContainer(container);
        
        const habilidades = carta.Habilidades || [];
        if (habilidades.length === 0) {
            const sinHabilidades = this.crearElemento('div', ['Habilidad']);
            const descripcion = this.crearElemento('div', ['Habilidad-Descripcion'], 'Sin habilidades especiales');
            sinHabilidades.appendChild(descripcion);
            container.appendChild(sinHabilidades);
            return;
        }

        habilidades.forEach((habilidad, index) => {
            const datos = this.procesarHabilidad(habilidad, index);
            const habilidadElement = this.crearHabilidadElement(datos, carta);
            container.appendChild(habilidadElement);
        });
    }

    /**
     * Procesa datos de habilidad (string u objeto)
     */
    procesarHabilidad(habilidad, index) {
        if (typeof habilidad === 'string') {
            return {
                nombre: habilidad,
                dano: Math.floor(Math.random() * 50) + 10,
                descripcion: 'Habilidad especial'
            };
        }
        
        return {
            nombre: habilidad.nombre || habilidad.Nombre || `Habilidad ${index + 1}`,
            dano: habilidad.dano || habilidad.Dano || habilidad.damage || 10,
            descripcion: habilidad.descripcion || habilidad.Descripcion || 'Habilidad especial'
        };
    }

    /**
     * Crea elemento de habilidad
     */
    crearHabilidadElement(datos, carta) {
        const habilidadDiv = this.crearElemento('div', ['Habilidad']);
        const header = this.crearElemento('div', ['Habilidad-Header']);
        const nombre = this.crearElemento('div', ['Habilidad-Nombre']);
        const icono = this.crearElemento('span', ['Habilidad-Icono', `tipo-${this.obtenerTipoPrincipal(carta.Tipos)}`]);
        const texto = this.crearElemento('span', ['Habilidad-Texto'], datos.nombre);
        const dano = this.crearElemento('span', ['Habilidad-Dano'], datos.dano.toString());
        //const descripcion = this.crearElemento('p', ['Habilidad-Descripcion'], datos.descripcion);

        nombre.appendChild(icono);
        nombre.appendChild(texto);
        header.appendChild(nombre);
        header.appendChild(dano);
        habilidadDiv.appendChild(header);
        //habilidadDiv.appendChild(descripcion);

        return habilidadDiv;
    }

    /**
     * Configura efectividades (debilidades y resistencias)
     */
    configurarEfectividades(carta, debilContainer, resistContainer) {
        this.limpiarContainer(debilContainer);
        this.limpiarContainer(resistContainer);

        const tipos = carta.Tipos || ['normal'];
        let tieneDebilidades = false;
        let tieneResistencias = false;

        tipos.forEach(tipo => {
            // Procesar debilidades
            const debilidades = Efectividades[tipo];
            if (debilidades) {
                Object.entries(debilidades).forEach(([tipoEnemigo, efectividad]) => {
                    if (efectividad > 1) {
                        this.agregarEfectividad(debilContainer, tipoEnemigo, `×${efectividad}`, 'Debilidad');
                        tieneDebilidades = true;
                    }
                });
            }

            // Procesar resistencias
            const resistencias = Resistencias[tipo];
            if (resistencias) {
                Object.entries(resistencias).forEach(([tipoEnemigo, efectividad]) => {
                    if (efectividad < 1 && efectividad > 0) {
                        const reduccion = Math.round((1 - efectividad) * 100);
                        this.agregarEfectividad(resistContainer, tipoEnemigo, `-${reduccion}`, 'Resistencia');
                        tieneResistencias = true;
                    }
                });
            }
        });

        // Mostrar "Ninguna" si no hay efectividades
        if (!tieneDebilidades) {
            debilContainer.textContent = 'Ninguna';
        }
        if (!tieneResistencias) {
            resistContainer.textContent = 'Ninguna';
        }
    }

    /**
     * Agrega un elemento de efectividad
     */
    agregarEfectividad(container, tipo, valor, claseBase) {
        const elemento = this.crearElemento('span', [claseBase.toLowerCase(), `tipo-${tipo}`]);
        //const icono = this.crearElemento('span', [`tipo-${tipo}`]);
        //const valorSpan = this.crearElemento('span', [], ` ${valor}`);
        
        //elemento.appendChild(icono);
        //elemento.appendChild(valorSpan);
        container.appendChild(elemento);
    }

    /**
     * Configura imagen de la carta
     */
    configurarImagen(carta, img, miniatura) {
        if (carta.Miniatura) {
            img.src = carta.Miniatura;
            img.alt = carta.Nombre;
            img.style.display = 'block';
            miniatura.classList.remove('no-image');
        } else {
            img.style.display = 'none';
            miniatura.classList.add('no-image');
            const iconoTipo = this.crearElemento('span', [`tipo-${this.obtenerTipoPrincipal(carta.Tipos)}`]);
            miniatura.appendChild(iconoTipo);
        }
    }

    /**
     * Configura eventos de selección
     */
    configurarEventos(cartaElement, carta, esJugador, idx) {
        const manejarSeleccion = () => {
            this.removerSeleccionesAnteriores();
            cartaElement.classList.add('Selecteccion');
            
            if (esJugador) {
                this.idxAtacante = idx;
                this.elementos.seleccionJugador.textContent = carta.Nombre;
            } else {
                this.idxObjetivo = idx;
                this.elementos.seleccionRival.textContent = carta.Nombre;
            }
            
            this.aplicarEfectoSeleccion(cartaElement);
        };

        cartaElement.addEventListener('click', manejarSeleccion);
        cartaElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                manejarSeleccion();
            }
        });

        // Configurar atributos
        cartaElement.setAttribute('data-id', idx);
        cartaElement.setAttribute('data-es-jugador', esJugador ? '1' : '0');
        cartaElement.setAttribute('tabindex', '0');
    }

    /**
     * Utilidades
     */
    limpiarContainer(container) {
        if (container) {
            container.innerHTML = '';
        }
    }

    removerSeleccionesAnteriores() {
        document.querySelectorAll('.Carta.Selecteccion').forEach(carta => {
            carta.classList.remove('Selecteccion');
        });
    }

    aplicarEfectoSeleccion(cartaElement) {
        const transformOriginal = cartaElement.style.transform;
        cartaElement.style.transform = 'scale(1.1) rotate(2deg)';
        setTimeout(() => {
            cartaElement.style.transform = transformOriginal;
        }, 200);
    }

    /**
     * Renderiza una carta completa
     */
    renderizarCarta(carta, esJugador, idx) {
        const template = this.elementos.templateCarta.content.cloneNode(true);
        const cartaElement = template.querySelector('.Carta');
        
        // Aplicar estilo por tipo
        const tipoPrincipal = this.obtenerTipoPrincipal(carta.Tipos);
        cartaElement.classList.add(tipoPrincipal);
        
        if (carta.Rareza) {
            cartaElement.classList.add(carta.Rareza.toLowerCase().replace(' ', '-'));
        }

        // Configurar elementos
        template.querySelector('.Carta-Nombre').textContent = carta.Nombre;
        template.querySelector('.Hp').textContent = carta.Hp || carta.HpMax || 100;
        
        this.configurarTipos(carta, template.querySelector('.Tipos'));
        this.configurarImagen(carta, template.querySelector('.c-Miniatura-poke'), template.querySelector('.c-Miniatura'));
        this.configurarHabilidades(carta, template.querySelector('.Habilidades'));
        this.configurarEfectividades(carta, template.querySelector('.Debilidad'), template.querySelector('.Resistencia'));
        
        const descripcion = carta.Descripcion || 'Una criatura misteriosa con poderes únicos.';
        template.querySelector('.Descripcion').textContent = descripcion;
        
        const rareza = carta.Rareza || 'común';
        template.querySelector('.Rareza-Nivel').textContent = rareza;
        
        this.configurarEventos(cartaElement, carta, esJugador, idx);
        
        return template;
    }

    /**
     * Métodos principales del controlador
     */
    iniciarJuego() {
        this.game.iniciar();
        this.idxAtacante = null;
        this.idxObjetivo = null;
        this.elementos.seleccionJugador.textContent = '--';
        this.elementos.seleccionRival.textContent = '--';
        this.actualizarVista();
    }

    turnoJugador() {
        if (this.idxAtacante !== null && this.idxObjetivo !== null) {
            const resultado = this.game.turnoJugador(this.idxAtacante, this.idxObjetivo);
            this.reiniciarSelecciones();
            this.actualizarVista();
            return resultado;
        }
        return { exito: false, mensaje: 'Selecciona atacante y objetivo.' };
    }

    turnoRival() {
        const resultado = this.game.turnoRival();
        this.actualizarVista();
        return resultado;
    }

    reiniciarSelecciones() {
        this.idxAtacante = null;
        this.idxObjetivo = null;
        this.elementos.seleccionJugador.textContent = '--';
        this.elementos.seleccionRival.textContent = '--';
        this.removerSeleccionesAnteriores();
    }

    actualizarVista() {
        const estado = this.game.estado();
        
        if (this.elementos.turno) {
            this.elementos.turno.textContent = estado.turno;
        }

        // Actualizar cartas del jugador
        if (this.elementos.manoJugador) {
            this.limpiarContainer(this.elementos.manoJugador);
            estado.jugador.cartasActivas.forEach((carta, idx) => {
                this.elementos.manoJugador.appendChild(this.renderizarCarta(carta, true, idx));
            });
        }

        // Actualizar cartas del rival
        if (this.elementos.manoRival) {
            this.limpiarContainer(this.elementos.manoRival);
            estado.rival.cartasActivas.forEach((carta, idx) => {
                this.elementos.manoRival.appendChild(this.renderizarCarta(carta, false, idx));
            });
        }

        // Actualizar historial
        if (this.elementos.historial) {
            const eventos = estado.historial.slice(-5).map(evento => {
                const div = this.crearElemento('div', ['evento-historial']);
                const jugador = this.crearElemento('strong', [], `[${evento.jugador}]`);
                const mensaje = this.crearElemento('span', [], ` ${evento.mensaje}`);
                div.appendChild(jugador);
                div.appendChild(mensaje);
                return div;
            });
            
            this.limpiarContainer(this.elementos.historial);
            eventos.forEach(evento => this.elementos.historial.appendChild(evento));
        }
    }
}