import Carta from "./Carta.js";
import Deck from "./Deck.js";
import Jugador from "./Jugador.js";
import Rival_CPU from "./Rival_CPU.js";
import { Barajar } from "../utils/helpers.js";

/**
 * Clase principal para gestionar el flujo del juego.
 */
export default class Game {
    /**
     * @param {object} opts
     * @param {Jugador} opts.jugador
     * @param {Rival_CPU} opts.rival
     */
    constructor({ jugador, rival }) {
        this.jugador = jugador;
        this.rival = rival;
        this.turnoActual = 1;
        this.finalizado = false;
        this.historial = [];
    }

    /**
     * Inicia el juego, baraja los mazos y prepara las cartas activas.
     */
    iniciar() {
        this.jugador.Mazo.Barajar();
        this.rival.Mazo.Barajar();
        this.jugador.CartasActivas = this.jugador.Mazo.Dibujar(3);
        this.rival.CartasActivas = this.rival.Mazo.Dibujar(3);
        this.turnoActual = 1;
        this.finalizado = false;
        this.historial = [];
    }

    /**
     * Ejecuta el turno del jugador.
     * @param {number} atacanteIdx - índice de la carta activa del jugador que ataca
     * @param {number} objetivoIdx - índice de la carta activa del rival a atacar
     * @returns {object} resultado del turno
     */
    turnoJugador(atacanteIdx, objetivoIdx) {
        if (this.finalizado) return { exito: false, mensaje: "El juego ha terminado." };
        const atacante = this.jugador.CartasActivas[atacanteIdx];
        const objetivo = this.rival.CartasActivas[objetivoIdx];
        if (!atacante || !objetivo || !atacante.EstaVivo() || !objetivo.EstaVivo()) {
            return { exito: false, mensaje: "Selección inválida." };
        }
        const hpRestante = atacante.Atacar(objetivo);
        const resultado = {
            exito: true,
            atacante,
            objetivo,
            hpRestante,
            mensaje: `${atacante.Nombre} atacó a ${objetivo.Nombre} (${hpRestante} HP restante)`
        };
        this.historial.push({ turno: this.turnoActual, jugador: "jugador", ...resultado });
        this.rival.gestionarCartasActivas();
        this.verificarFin();
        return resultado;
    }

    /**
     * Ejecuta el turno del rival (CPU).
     * @returns {object} resultado del turno
     */
    turnoRival() {
        if (this.finalizado) return { exito: false, mensaje: "El juego ha terminado." };
        const resultado = this.rival.turno(this.jugador.CartasActivas);
        this.historial.push({ turno: this.turnoActual, jugador: "cpu", ...resultado });
        this.jugador.gestionarCartasActivas?.();
        this.verificarFin();
        return resultado;
    }

    /**
     * Permite sanar una carta activa del jugador.
     * @param {number} idx - índice de la carta activa a sanar
     * @param {number} cantidad - cantidad de vida a restaurar
     * @returns {object}
     */
    sanarJugador(idx, cantidad) {
        const carta = this.jugador.CartasActivas[idx];
        if (carta && carta.EstaVivo()) {
            carta.Sanar(cantidad);
            return { exito: true, carta, mensaje: `${carta.Nombre} sanó ${cantidad} HP.` };
        }
        return { exito: false, mensaje: "No se puede sanar esa carta." };
    }

    /**
     * Permite al jugador cambiar una carta activa derrotada por una del mazo.
     * @param {number} idx - índice de la carta activa derrotada
     * @returns {object}
     */
    cambiarCartaActivaJugador(idx) {
        if (!this.jugador.CartasActivas[idx].EstaVivo()) {
            const nueva = this.jugador.RobarDelMazo(1)[0];
            if (nueva) {
                this.jugador.CartasActivas[idx] = nueva;
                return { exito: true, carta: nueva, mensaje: `Nueva carta activa: ${nueva.Nombre}` };
            }
            return { exito: false, mensaje: "No hay cartas en el mazo para reemplazar." };
        }
        return { exito: false, mensaje: "La carta seleccionada aún está viva." };
    }

    /**
     * Verifica si el juego ha terminado.
     */
    verificarFin() {
        if (!this.jugador.Continua() || !this.rival.Continua()) {
            this.finalizado = true;
        }
    }

    /**
     * Devuelve el estado actual del juego.
     * @returns {object}
     */
    estado() {
        return {
            turno: this.turnoActual,
            finalizado: this.finalizado,
            jugador: {
                nombre: this.jugador.Nombre,
                cartasActivas: this.jugador.CartasActivas.map(c => c.AJSON()),
                cartasMazo: this.jugador.Mazo.Arreglo().map(c => c.AJSON())
            },
            rival: {
                nombre: this.rival.Nombre,
                cartasActivas: this.rival.CartasActivas.map(c => c.AJSON()),
                cartasMazo: this.rival.Mazo.Arreglo().map(c => c.AJSON())
            },
            historial: this.historial
        };
    }

    /**
     * Avanza al siguiente turno.
     */
    siguienteTurno() {
        if (!this.finalizado) {
            this.turnoActual += 1;
        }
    }
}
