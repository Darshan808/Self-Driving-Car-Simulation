//Linear Interpolation
const lerp = (A, B, t) => {
  return A + (B - A) * t;
};

//Getting Intersection between two line segments
const getIntersection = (A,B,C,D)=>{
  /*
    Maths
    Lerp equations
    A.x+(B.x-A.x)t, A.y+(B.y-A.y)t
    C.x+(D.x-C.x)u, C.y+(D.y-C.y)u
    for these two lines to intersect lerp of a,b should be equal to lerp of cd
    for x co-ordinates
    A.x+(B.x-A.x)t = C.x+(D.x-C.x)u
    (A.x-C.x)+(B.x-A.x)t = (D.x-C.x)u
    for y co-ordinates
    A.y+(B.y-A.y)t = C.y+(D.y-C.y)u
    multiplying both sides by (D.x-C.x). we get,
    (A.y-C.y)(D.x-C.x) + (D.x-C.x)(B.y-A.y)t = (A.x-C.x)(D.y-C.y)
    +(B.x-A.x)(D.y-C.y)t
    t = {(A.y-C.y)(D.x-C.x)-(A.x-C.x)(D.y-C.y)}/{(B.x-A.x)(D.y-C.y)-(D.x-C.x)(B.y-A.y)}
     */
    const top = (A.y - C.y)*(D.x - C.x) - (A.x - C.x)*(D.y - C.y);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (B.x - A.x)*(D.y - C.y) - (D.x - C.x)*(B.y - A.y);
    if(bottom!=0){
        const t = top/bottom;
        const u = uTop/bottom;
        if((t>=0 && t<=1) && (u>=0 && u<=1)){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t,
            }
        }
    }
    return null;
}
//Polygon Intersection
const polyIntersect = (poly1,poly2)=>{
    for(let i=0;i<poly1.length;i++){
        for(let j=0;j<poly2.length;j++){
            touch = getIntersection(poly1[i],poly1[(i+1)%poly1.length],poly2[j],poly2[(j+1)%poly2.length]);
            if(touch) return true;
        }
    }
    return false;
}
//Get rgba from a value between -1 and 1
const getRGBA = (value)=>{
    const alpha = Math.abs(value)+0.4;
    const R = value>0 ? 255 : 0;
    const G = R;
    const B = value>0 ? 0 : 255;
    return 'rgba('+R+','+G+','+B+','+alpha+')';
}