class PixelRec {
	 // x, y, size, color;
	 constructor(p, x, y, size, border) {
	 	this.p = p;
		this.x = x;
		this.y = y;
		this.size = size;
		this.color = 'white';
		this.border = border;
		this.borderColor = 'lightgrey';
	}

	click(color) {
		if (this.p.mouseX >= this.x && this.p.mouseX <= this.x+this.size && this.p.mouseY >= this.y && this.p.mouseY <= this.y+this.size)
			this.color = color;
	}
	resize(size) {
		this.size = size;
	}

	draw() {
		if (this.border) {
			this.p.stroke(this.borderColor);
			this.p.strokeWeight(0.2);
		} else {
			this.p.noStroke();
		}
		this.p.fill(this.color);
		this.p.rect(this.x, this.y, this.size, this.size);
	}
}