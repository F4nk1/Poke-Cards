
// funcion para barajar un mazo

export function Barajar(array,rng){
    const a=Array.from(array);
    for(let i=a.length-1;i>0;i--){
        const r= typeof rng=== 'function'?rng():Math.random();
        const j=Math.floor(r*(i+1));
        [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
}

//funcion para limitar rangos

export function limitar(v,a=0,b=100){
    return Math.max(a,Math.min(b,v));
}
