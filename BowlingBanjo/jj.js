class jj {
    constructor(x,y,z) {
        this.rel = createVector(x, y, z)
        this.pos = createVector(mpos.x + this.rel.x, mpos.y + this.rel.y, mpos.z + this.rel.z)
        this.vel = createVector(0, 0, 0)
        this.acc = createVector(0, 0, 0)
        this.r = 30
        this.s = 0
        this.id = pins.length
    }

    update(mpos) {
        this.pos = createVector(mpos.x + this.rel.x, mpos.y + this.rel.y, mpos.z + this.rel.z)
        if (this.pos.z < mpos.z-gl/2) {
            this.acc.y = 5
            console.log(this.acc)
        } else if (this.pos.x >= mpos.x + gw/2 - 10) {
            this.acc.x *= -1
        } else if (this.pos.x <= mpos.x - gw/2 + 10) {
            this.acc.x *= -1
        }
        this.vel.add(this.acc)
        this.pos.add(this.vel)
    }
    
    collide(bpos) {
        let c = createVector(this.pos.x - bpos.x, this.pos.y - bpos.y, this.pos.z - bpos.z)
        if (c.mag() <= this.r) {
            this.acc.add(c)
            hits[this.id] = 1
            if (this.s==0) {
                fxjj.play()
                fxhit.play()
                this.s = 1
            }
        } else if (abs(c.x) < this.r && c.z > 0) {
            c.z = abs(c.z) * -1
            this.acc.add(c.setMag(3))
            hits[this.id] = 1
            if (this.s==0) {
                fxjj.play()
                fxhit.play()
                this.s = 1
            }        
        }
    }

    bump(pos) {
        let c2 = createVector(this.pos.x - pos.x, this.pos.y - pos.y, this.pos.z - pos.z)   
        if (c2.mag() <= 2) {
            this.acc.add(c2)
            console.log("bump")
        }
    }

    show() {
        push();
        translate(this.pos)
        texture(jface)
        textureMode(NORMAL)
        rotateZ(PI)
        rotateY(sin(this.rel.x + frameCount/100)*PI/4)
        scale(.4)
        model(juju);
        pop();
    }
}