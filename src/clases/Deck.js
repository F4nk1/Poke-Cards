
import { Barajar as _Barajar } from "../utils/helpers";
// clase Deck

export default class Deck{
    /**
     * @param {Arry<Carta>}Cartas 
     */
    constructor(Cartas=[]){
        this.Cartas=Array.isArray(Carta)?[...Cartas]:[];
    }
    size(){
        return this.Cartas.length;
    }

    EstaVacio(){
        return this.Cartas.length===0;
    }

    Barajar(rng){
        this.Cartas=_Barajar(this.Cartas,rng);
        return this;
    }
    Dibujar(n=1){
        if(n<=0)return [];
        return this.Cartas.splice(0,n);
    }
    AnadirA(Cartas){
        this.Cartas.push(...(Array.isArray(Cartas)?Cartas:[Cartas]));
    }

    Ojeada(n=1){
        return this.Cartas.slice(0,n);
    }
    Arreglo(){
        return [...this.Cartas];
    }
}