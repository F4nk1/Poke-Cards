

export default class Movimiento {
    constructor({ 
        id, nombre, tipo, clase, poder, precision, pp, descripcion, 
        estado = null,      
        probabilidad = 0    
    }) {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.clase = clase;       
        this.poder = poder;        
        this.precision = precision;
        this.pp = pp;
        this.descripcion = descripcion;
        this.estado = estado;
        this.probabilidad = probabilidad;
    }

    usarMovimiento(usuario, objetivo) {
        if (this.pp <= 0) {
            console.log(`${this.nombre} no tiene PP!`);
            return;
        }
        this.pp--;

        if (this.precision && Math.random() * 100 > this.precision) {
            console.log(`${usuario.nombre} usó ${this.nombre}, pero falló!`);
            return;
        }

        // daño directo
        if (this.poder > 0) {
            const dano = this.calcularDano(usuario, objetivo);
            objetivo.hp -= dano;
            console.log(`${usuario.nombre} usó ${this.nombre} e hizo ${dano} de daño a ${objetivo.nombre}`);
        }

        // aplicar estado
        if (this.estado && Math.random() * 100 < this.probabilidad) {
            if (!objetivo.estado) {
                objetivo.estado = this.estado;
                console.log(`${objetivo.nombre} ahora está ${this.estado}`);
            }
        }
    }
}
