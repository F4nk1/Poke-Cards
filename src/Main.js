import UIController from "./ui/UIController.js";
import Game from "./clases/Game.js";
import Jugador from "./clases/Jugador.js";
import Rival_CPU from "./clases/Rival_CPU.js";
import Deck from "./clases/Deck.js";
import Carta from "./clases/Carta.js";
import { Barajar } from "./utils/helpers.js";

let POKES = []; // Array to hold the Pokémon cards
let Pokes=new Deck();
async function CargaTemplate(url) {
    const res = await fetch(url);
    const txt = await res.text();
    const tmp = document.createElement('div');
    tmp.innerHTML = txt;
    return tmp.querySelector('template');
}

function CargaCartas(jugador) {
    const cartas = [...POKES].sort(() => Math.random() - 0.5);
    const seleccionadas = cartas.slice(0, 6).map(base => {
        let habilidades = [];

        if (base.Habilidades && base.Habilidades.length > 0) {
            
            const pool = [...base.Habilidades];

            
            pool.sort(() => Math.random() - 0.5);

            
            habilidades = pool.slice(0, Math.min(2, pool.length));
        }

        return new Carta({
            Id: base.Id,
            Nombre: base.Nombre,
            Tipos: base.Tipos,
            Hp: base.Hp,
            Ataque: base.Ataque,
            Habilidades: habilidades, 
            Defensa: base.Defensa,
            HpMax: base.HpMax,
            Miniatura: base.Miniatura,
            Descripcion: base.Descripcion,
        });
    });

    jugador.Mazo.AnadirA(seleccionadas);
}



async function CargarGeneracion(gen){
    const res = await fetch(`data/gen${gen}.json`);
    const arr = await res.json();
    POKES = arr.map(p => new Carta({
        Id: p.id,
        Nombre: p.name,
        Tipos: p.types,
        Hp: p.stats.hp,
        Ataque: p.stats.attack,
        Habilidades: p.abilities,
        Defensa: p.stats.defense,
        HpMax: p.stats.hp,
        Miniatura: p.localSprite,
        Descripcion: p.description, 
    }));
}

async function main() {
    const templateCarta = await CargaTemplate("templates/disenoCarta.html");
    if (templateCarta) document.body.appendChild(templateCarta);

    await CargarGeneracion(1);

    const jugador = new Jugador({Nombre:"Tu", Mazo:new Deck() });
    const rival = new Rival_CPU({Nombre:"Rival", Mazo: new Deck()});
    CargaCartas(jugador);
    CargaCartas(rival);
    const game = new Game({jugador, rival});
    const ui = new UIController(game);

    document.getElementById("Btn_iniciar").onclick = () => ui.iniciarJuego();
    document.getElementById("Btn_siguiente").onclick = () => {
        ui.turnoJugador();
        ui.turnoRival();
    };
}

document.addEventListener("DOMContentLoaded", main);


