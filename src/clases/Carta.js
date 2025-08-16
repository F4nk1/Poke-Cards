// clase Carta

export default class Carta{
    /**
     * 
     * @param {object} opts
     * @param {number} opts.Id
     * @param {string} opts.Nombre
     * @param {Array<string>} opts.Tipos
     * @param {number} opts.Hp
     * @param {number} opts.Ataque
     * @param {number} opts.Defensa
     * @param {string} opts.Miniatura
     */
    constructor({Id,Nombre,Tipos,Hp,Ataque,HpMax=Hp,Defensa,Miniatura}){
        this.Id=Id;
        this.Nombre=Nombre;
        this.Tipos=Tipos;
        this.HpMax=HpMax??Hp;
        this.Ataque=Ataque;
        this.Hp=Hp;
        this.Defensa=Defensa;
        this.Miniatura=Miniatura;
    }
    TomarDano(dmg){
        this.Hp=Math.max(0,Math.floor(this.Hp-Math.max(0,dmg-this.Defensa)));
        return this.Hp;
    }
    Sanar(cantidad){
        this.Hp=Math.min(this.HpMax,Math.floor(this.Hp+cantidad));
        return this.Hp;
    }
    EstaVivo(){
        return this.Hp > 0;
    }
    Clonar(){
        return new Carta({
            Id:this.Id,
            Nombre:this.Nombre,
            Tipos:this.Tipos,
            Hp:this.Hp,
            Ataque:this.Ataque,
            Defensa:this.Defensa,
            HpMax:this.HpMax,
            Miniatura:this.Miniatura,
        })
    }
    AJSON(){
        return {
            Id:this.Id,
            Nombre:this.Nombre,
            Tipos:this.Tipos,
            Hp:this.Hp,
            Ataque:this.Ataque,
            Defensa:this.Defensa,
            HpMax:this.HpMax,
            Miniatura:this.Miniatura,
        }
    }

    /**
     * Ataca a otra carta y le aplica daño.
     * @param {Carta} objetivo
     * @returns {number|null} Hp restante del objetivo
     */
    Atacar(objetivo) {
        if (objetivo instanceof Carta) {
            return objetivo.TomarDano(this.Ataque);
        }
        return null;
    }

    /**
     * Restaura la vida de la carta a su valor máximo.
     */
    Restaurar() {
        this.Hp = this.HpMax;
    }

    /**
     * Devuelve una descripción corta de la carta.
     * @returns {string}
     */
    Descripcion() {
        return `${this.Nombre} [${this.Tipo}] HP:${this.Hp}/${this.HpMax} ATK:${this.Ataque}`;
    }

    /**
     * Indica si la carta está en estado crítico (menos del 25% de vida).
     * @returns {boolean}
     */
    Critico() {
        return this.Hp > 0 && this.Hp <= Math.floor(this.HpMax * 0.25);
    }
}