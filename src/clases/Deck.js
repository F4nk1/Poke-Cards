import { Barajar as _Barajar } from "../utils/helpers.js";
import Carta from "./Carta.js";

/**
 * Clase Deck para gestionar el mazo de cartas.
 */
export default class Deck {
    /**
     * @param {Array<Carta>} Cartas
     */
    constructor(Cartas = []) {
        this.Cartas = Array.isArray(Cartas) ? [...Cartas] : [];
    }

    /**
     * Devuelve el número de cartas en el mazo.
     * @returns {number}
     */
    size() {
        return this.Cartas.length;
    }

    /**
     * Indica si el mazo está vacío.
     * @returns {boolean}
     */
    EstaVacio() {
        return this.Cartas.length === 0;
    }

    /**
     * Baraja el mazo.
     * @param {function} rng - función de random opcional
     * @returns {Deck}
     */
    Barajar(rng) {
        this.Cartas = _Barajar(this.Cartas, rng);
        return this;
    }

    /**
     * Roba n cartas del mazo (las elimina del mazo y las devuelve).
     * @param {number} n
     * @returns {Array<Carta>}
     */
    Pasar(n = 1) {
        if (n <= 0) return [];
        return this.Cartas.splice(0, n);
    }

    /**
     * Añade una o varias cartas al mazo.
     * @param {Carta|Array<Carta>} cartas
     */
    AnadirA(cartas) {
        if (Array.isArray(cartas)) {
            this.Cartas.push(...cartas.filter(c => c instanceof Carta));
        } else if (cartas instanceof Carta) {
            this.Cartas.push(cartas);
        }
    }

    /**
     * Devuelve una copia de las primeras n cartas (sin eliminarlas).
     * @param {number} n
     * @returns {Array<Carta>}
     */
    Ojeada(n = 1) {
        return this.Cartas.slice(0, n);
    }

    /**
     * Devuelve una copia del array de cartas.
     * @returns {Array<Carta>}
     */
    Arreglo() {
        return [...this.Cartas];
    }

    /**
     * Elimina una carta por índice.
     * @param {number} index
     * @returns {Carta|null}
     */
    EliminarPorIndice(index) {
        if (index < 0 || index >= this.Cartas.length) return null;
        return this.Cartas.splice(index, 1)[0];
    }

    /**
     * Elimina la primera carta que coincida con el objeto carta.
     * @param {Carta} carta
     * @returns {boolean} true si se eliminó, false si no
     */
    EliminarCarta(carta) {
        const idx = this.Cartas.indexOf(carta);
        if (idx !== -1) {
            this.Cartas.splice(idx, 1);
            return true;
        }
        return false;
    }
}