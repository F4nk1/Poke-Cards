// clase Rival_CPU para jugar contra pc
import Jugador from "./Jugador.js";
import Carta from "./Carta.js";

/**
 * Rival controlado por IA, extiende Jugador.
 */
export default class Rival_CPU extends Jugador {
    /**
     * @param {object} opts
     * @param {string} opts.Nombre
     * @param {Deck} opts.Mazo
     */
    constructor({ Nombre = 'CPU', Mazo } = {}) {
        super({ Nombre, Mazo, isAI: true });
    }

    /**
     * Decide qué carta activa atacar (puedes mejorar la lógica).
     * @param {Array<Carta>} cartasEnemigas
     * @returns {number} índice de la carta enemiga a atacar
     */
    elegirObjetivo(cartasEnemigas) {
        // Ejemplo: ataca la carta enemiga con menos HP viva
        const vivas = cartasEnemigas.filter(c => c && c.EstaVivo());
        if (vivas.length === 0) return -1;
        let minHp = Infinity, idx = -1;
        vivas.forEach((c, i) => {
            if (c.Hp < minHp) {
                minHp = c.Hp;
                idx = cartasEnemigas.indexOf(c);
            }
        });
        return idx;
    }

    /**
     * Decide qué carta propia usar para atacar.
     * @returns {number} índice de la carta activa a usar
     */
    elegirAtacante() {
        // Ejemplo: usa la carta viva con mayor ataque
        const vivas = this.CartasVivas();
        if (vivas.length === 0) return -1;
        let maxAtk = -1, idx = -1;
        vivas.forEach((c) => {
            if (c.Ataque > maxAtk) {
                maxAtk = c.Ataque;
                idx = this.CartasActivas.indexOf(c);
            }
        });
        return idx;
    }

    /**
     * Realiza el turno de la CPU (ataca a una carta enemiga).
     * @param {Array<Carta>} cartasEnemigas
     * @returns {object} resultado del turno
     */
    turno(cartasEnemigas) {
        const atacanteIdx = this.elegirAtacante();
        const objetivoIdx = this.elegirObjetivo(cartasEnemigas);
        if (atacanteIdx === -1 || objetivoIdx === -1) {
            return { exito: false, mensaje: "No hay cartas vivas para atacar." };
        }
        const atacante = this.CartasActivas[atacanteIdx];
        const objetivo = cartasEnemigas[objetivoIdx];
        const hpRestante = atacante.Atacar(objetivo);
        return {
            exito: true,
            atacante: atacante,
            objetivo: objetivo,
            hpRestante: hpRestante,
            mensaje: `${atacante.Nombre} atacó a ${objetivo.Nombre} (${hpRestante} HP restante)`
        };
    }

    /**
     * Cambia cartas activas si alguna fue derrotada, robando del mazo si es posible.
     */
    gestionarCartasActivas() {
        for (let i = 0; i < this.CartasActivas.length; i++) {
            if (!this.CartasActivas[i].EstaVivo()) {
                const nueva = this.RobarDelMazo(1)[0];
                if (nueva) this.CartasActivas[i] = nueva;
            }
        }
    }

    /**
     * Decide si sanar alguna carta activa (ejemplo simple).
     * @returns {number} índice de la carta a sanar o -1 si ninguna
     */
    elegirSanar() {
        // Ejemplo: sana la carta más crítica si hay alguna
        let idx = -1;
        this.CartasActivas.forEach((c, i) => {
            if (c.Critico() && c.EstaVivo()) idx = i;
        });
        return idx;
    }
}
