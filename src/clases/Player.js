//clase Jugador

export default class Jugador{
    /**
     * @param {object} opts
     * @param {string} opts.Nombre
     * @param {boolean} [opts.isAI=false]
     */

    constructor({Nombre='Red',isAI=false}={}){
        this.Nombre=Nombre;
        this.isAI=!!isAI;
        /**@type {Array<Carta>} */
        this.Mano=[];
    }
    CoMano(Cartas){
        this.ManoO=Array.isArray(Cartas)?[...Cartas]:[];
    }

    AnadirMano(Carta_Cartas){
        if(Array.isArray(Carta_Cartas))this.Mano.push(...Carta_Cartas);
        else this.Mano.push(Carta_Cartas);
    }

    QuitarMano(index){
        if(index<0||index>=this.Mano.length)return null;
        return this.Mano.splice(index,1)[0];
    }
    
    CartasVivas(){
        return this.Mano.filter((c)=>c&&c.EstaVivo());
    }

    Continua(){
        return this.CartasVivas().length>0;
    }

    Tomar(){
        return this.Mano.map((c)>=(typeof c.AJSON==='function'?c.AJSON():{...c}));
    }
}