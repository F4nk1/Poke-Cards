//clase Jugador
import Deck from "./Deck.js";

/**
 * Clase Jugador mejorada para usar Deck y cartas activas.
 */
export default class Jugador {
    /**
     * @param {object} opts
     * @param {string} opts.Nombre
     * @param {Deck} opts.Mazo
     * @param {boolean} opts.isAI
     */
    constructor({ Nombre = 'Red', Mazo = new Deck(), isAI = false } = {}) {
        this.Nombre = Nombre;
        this.isAI = !!isAI;
        /** @type {Deck} */
        this.Mazo = Mazo;
        /** @type {Array<Carta>} */
        this.CartasActivas = this.Mazo.Pasar(3); // Las 3 cartas en combate
    }

    /**
     * Cambia las cartas activas en combate.
     * @param {Array<Carta>} nuevasCartas
     */
    CambiarActivas(nuevasCartas) {
        if (Array.isArray(nuevasCartas) && nuevasCartas.length === 3) {
            this.CartasActivas = nuevasCartas;
        }
    }

    /**
     * Añade cartas al mazo.
     * @param {Carta|Array<Carta>} cartas
     */
    AnadirAlMazo(cartas) {
        this.Mazo.AnadirA(cartas);
    }

    /**
     * Roba cartas del mazo.
     * @param {number} n
     * @returns {Array<Carta>}
     */
    RobarDelMazo(n = 1) {
        return this.Mazo.Dibujar(n);
    }
    
    /**
     * Gestiona cartas activas, eliminando las muertas y usando las cartas que esten vivas.
     */
    gestionarCartasActivas() {
        // Buscar índice de carta muerta
        const idxMuerta = this.CartasActivas.findIndex(
            c => !c || (typeof c.EstaVivo === 'function' && !c.EstaVivo())
        );

        // Si hay una carta muerta y aún hay cartas en el mazo
        if (idxMuerta !== -1 && this.Mazo.Arreglo().length > 0) {
            const nueva = this.Mazo.Pasar(1)[0] || null;
            this.CartasActivas[idxMuerta] = nueva;
        }
    }

    /**
     * Devuelve las cartas vivas en combate.
     * @returns {Array<Carta>}
     */
    CartasVivas() {
        return this.CartasActivas.filter(c => c && typeof c.EstaVivo === 'function' && c.EstaVivo());
    }

    /**
     * Indica si el jugador puede continuar (al menos una carta viva en combate).
     * @returns {boolean}
     */
    Continua() {
        return this.CartasVivas().length > 0;
    }

    /**
     * Devuelve todas las cartas del jugador (mazo + activas).
     * @returns {Array<Carta>}
     */
    TodasLasCartas() {
        return [...this.CartasActivas, ...this.Mazo.Arreglo()];
    }
}