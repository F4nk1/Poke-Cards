
// clase Carta

export default class Carta{
    /**
     * 
     * @param {object} opts
     * @param {number} opts.Id
     * @param {string} opts.Nombre
     * @param {string} opts.Tipo
     * @param {number} opts.Hp
     * @param {number} opts.Atack
     * @param {string} opts.Miniatura
     * @param {strign} opts.IconoTipo
     */
    constructor({Id,Nombre,Tipo,Hp,Atack,HpMax=Hp,Miniatura,IconoTipo}){
        this.Id=Id;
        this.Nombre=Nombre;
        this.Tipo=Tipo;
        this.HpMax=HpMax??Hp;
        this.Atack=Atack;
        this.Hp=Hp;
        this.Miniatura=Miniatura;
        this.IconoTipo=IconoTipo;
    }
    TomarDano(dmg){
        this.Hp=Math.max(0,Math.floor(this.Hp-dmg));
        return this.Hp;
    }
    Sanar(cantidad){
        this.Hp=Math.min(this.HpMax,Math.floor(this.Hp+cantidad));
        return this.Hp;
    }
    EstaVivo(){
        return Hp>0;
    }
    Clonar(){
        return new Carta({
            Id:this.Id,
            Nombre:this.Nombre,
            Hp:this.Hp,
            Atack:this.Atack,
            HpMax:this.HpMax,
            Miniatura:this.Miniatura,
            IconoTipo:this.IconoTipo,
        })
    }
    AJSON(){
        return {
            Id:this.Id,
            Nombre:this.Nombre,
            Hp:this.Hp,
            Atack:this.Atack,
            HpMax:this.HpMax,
            Miniatura:this.Miniatura,
            IconoTipo:this.IconoTipo,
        }
    }
}