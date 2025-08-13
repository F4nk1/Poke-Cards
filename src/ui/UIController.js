import Game from "./clases/Game.js";

export default class UIController {
    /**
     * @param {Game} game
     */
    constructor(game) {
        this.game = game;
        this.turno = document.getElementById("Indicar_turno");
        this.historial = document.getElementById("Carga");
        this.templateCarta = document.getElementById("Diseno_Carta");
        this.manoJugador = document.getElementById("ManoJugador");
        this.manoRival = document.getElementById("ManoRival");
        this.seleccionJugador = document.getElementById("SeleccionJugador");
        this.seleccionRival = document.getElementById("SeleccionRival");
        this.idxAtacante = null;
        this.idxObjetivo = null;
    }

    /**
     * Inicia el juego y actualiza la UI.
     */
    iniciarJuego() {
        this.game.iniciar();
        this.idxAtacante = null;
        this.idxObjetivo = null;
        this.seleccionJugador.textContent = "--";
        this.seleccionRival.textContent = "--";
        this.actualizarVista();
    }

    /**
     * Procesa el turno del jugador.
     */
    turnoJugador() {
        if (this.idxAtacante !== null && this.idxObjetivo !== null) {
            const resultado = this.game.turnoJugador(this.idxAtacante, this.idxObjetivo);
            this.idxAtacante = null;
            this.idxObjetivo = null;
            this.seleccionJugador.textContent = "--";
            this.seleccionRival.textContent = "--";
            this.actualizarVista();
            return resultado;
        }
        return { exito: false, mensaje: "Selecciona atacante y objetivo." };
    }

    /**
     * Procesa el turno del rival.
     */
    turnoRival() {
        const resultado = this.game.turnoRival();
        this.actualizarVista();
        return resultado;
    }

    /**
     * Renderiza una carta usando el template.
     * @param {object} carta
     * @param {boolean} esJugador
     * @param {number} idx
     * @returns {HTMLElement}
     */
    renderizarCarta(carta, esJugador, idx) {
        const tpl = this.templateCarta.content.cloneNode(true);
        tpl.querySelector(".c-Miniatura").src = carta.Miniatura || "";
        tpl.querySelector(".c-Miniatura").alt = carta.Nombre;
        tpl.querySelector("h3").textContent = carta.Nombre;
        tpl.querySelector(".c-Ataque").textContent = carta.Ataque;
        tpl.querySelector(".HP").textContent = carta.Hp;
        tpl.querySelector(".BarraHp .LlenoHp").style.width = `${(carta.Hp / carta.HpMax) * 100}%`;
        const cartaDiv = tpl.querySelector(".Carta");
        cartaDiv.setAttribute("data-idx", idx);
        cartaDiv.setAttribute("data-jugador", esJugador ? "1" : "0");
        cartaDiv.onclick = () => {
            if (esJugador) {
                this.idxAtacante = idx;
                this.seleccionJugador.textContent = carta.Nombre;
            } else {
                this.idxObjetivo = idx;
                this.seleccionRival.textContent = carta.Nombre;
            }
        };
        return tpl;
    }

    /**
     * Actualiza la vista del juego en el DOM.
     */
    actualizarVista() {
        const estado = this.game.estado();
        if (this.turno) this.turno.textContent = estado.turno;

        // Renderiza cartas activas del jugador
        if (this.manoJugador) {
            this.manoJugador.innerHTML = "";
            estado.jugador.cartasActivas.forEach((carta, idx) => {
                this.manoJugador.appendChild(this.renderizarCarta(carta, true, idx));
            });
        }

        // Renderiza cartas activas del rival
        if (this.manoRival) {
            this.manoRival.innerHTML = "";
            estado.rival.cartasActivas.forEach((carta, idx) => {
                this.manoRival.appendChild(this.renderizarCarta(carta, false, idx));
            });
        }

        // Historial de turnos
        if (this.historial) {
            this.historial.innerHTML = estado.historial.slice(-5).map(ev =>
                `[${ev.jugador}] ${ev.mensaje}`
            ).join("<br>");
        }
    }
}