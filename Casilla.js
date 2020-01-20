class Casilla {

	constructor( fila, columna ){
		this.fila = fila;
		this.columna = columna;
		this.marcada = false;
		this.mina = false;
		this.descubierta = false;
		this.amenazas = 0;
		this.$element = $('<a class="casilla" oncontextmenu="return false;" href="#"><i class="fas fa-flag"></i><i class="fas fa-bomb"></i></a>');
	}
	
	addAmenaza(){
		this.amenazas++;
	}
	
	ponerMina(){
		this.mina = true;
	}
	
	marcar(){
		this.marcada = !this.marcada;
		this.$element.toggleClass('marcada');
	}
	
	descubrir(){
		this.descubierta = true;
		this.$element.addClass('descubierta amenazas-'+this.amenazas).html(this.amenazas==0?'':this.amenazas);
	}

	explotar(){
		if( this.mina && !this.marcada )
			this.$element.addClass('mina');
	}
	
	tieneMina(){
		return this.mina;
	}
	
	estaMarcada(){
		return this.marcada;
	}
	
	estaDescubierta(){
		return this.descubierta;
	}
	
	getAmenazas(){
		return this.amenazas;
	}

}