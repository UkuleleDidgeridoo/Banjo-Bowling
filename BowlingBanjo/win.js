class winner {
    constructor() {
    }

    show(mpos) {
        push();
        translate(mpos.x, -100 - 50*sin(millis()/500), mpos.z + sqrt(millis())+ 10*sin(millis()/100*PI/12))
        rotateY(sin(millis()/100)*PI/24)
        texture(win)
        //noFill();
        plane(512, 512)
        pop();
    }
}