class Tablero {

	constructor( filas, columnas, minas ){
		this.filas = filas;
		this.columnas = columnas;
		this.minas = minas;
		this.descubiertas = 0;
		this.marcadas = 0;
		this.tablero = [];
		this.fin = false;
		this.$panel = $('#buscaminas .mensaje');
		for( let fila = 0; fila < this.filas; fila++ ){
			this.tablero[fila] = [];
			for( let columna = 0; columna < this.columnas; columna++ ){
				this.tablero[fila][columna] = new Casilla( fila, columna );
				this.clickable( fila, columna );
			}
		}
		this.ponerMinas();
		this.mensajeMinas(this.minas);
		this.tiempo = new Date().getTime();
	}

	casilla( fila, columna ){
		return this.tablero[fila][columna];
	}

	clickable( fila, columna ){
		let casilla = this.tablero[fila][columna];
		let tablero = this;
		casilla.$element.click( function(event){
			event.preventDefault();
			if( !tablero.fin ){
				if( casilla.estaDescubierta() && casilla.getAmenazas() > 0 )
					tablero.resolver(fila,columna);
				else
					tablero.pisar(fila,columna);
			}
		} );
		casilla.$element.contextmenu( function(event){
			event.preventDefault();
			if( !tablero.fin && !casilla.estaDescubierta() ){
				casilla.marcar(fila,columna);
				tablero.marcadas += casilla.estaMarcada() ? 1 : -1;
				tablero.mensajeMinas(tablero.minas-tablero.marcadas);
			}
		} );
	}
	
	pisar( fila, columna ){
		let coord;
		let amenazas;
		let marcada;
		let casilla = this.tablero[fila][columna];
		if( !casilla.estaMarcada() && !casilla.estaDescubierta() ) {
			if( casilla.tieneMina() ){
				casilla.explotar();
				this.finalizar( false );
			} else {
				this.descubiertas++;
				casilla.descubrir();
				amenazas = casilla.getAmenazas();
				marcada = casilla.estaMarcada();
				if( !marcada && amenazas == 0 ) {
					for( let i = 0; i < 8; i++ ) {
						coord = this.getColindante( i, fila, columna );
						if( this.coordenadaValida( coord[0], coord[1] ) )
							this.pisar( coord[0], coord[1] );
					}
				}
				if( this.descubiertas + this.minas == this.filas*this.columnas )
					this.finalizar( true );
			}
		}
	}

	finalizar( resuelto ){
		this.tiempo = (new Date().getTime() - this.tiempo)/1000;
		let segundos = ("0"+Math.floor(this.tiempo % 60)).substr(-2);
		let minutos = Math.floor(this.tiempo/60);
		this.fin = true;
		this.mensaje(resuelto?"GANASTE - "+minutos+":"+segundos:"PERDISTE");
		for( let fila = 0; fila < this.filas; fila++ )
			for( let columna = 0; columna < this.columnas; columna++ )
				this.tablero[fila][columna].explotar();
	}

	resolver( fila, columna ) {
		let coord;
		let marcadas_cerca = 0;
		let casilla = this.tablero[fila][columna];
		if( casilla.estaDescubierta() && casilla.getAmenazas() > 0 ) {
			for( let i = 0; i < 8; i++ ) {
				coord = this.getColindante( i, fila, columna );
				if( this.coordenadaValida(coord[0], coord[1]) && this.tablero[coord[0]][coord[1]].estaMarcada() )
					marcadas_cerca++;
			}
			if( marcadas_cerca == casilla.getAmenazas() ) {
				for( let i = 0; i < 8; i++ ) {
					coord = this.getColindante( i, fila, columna );
					if( this.coordenadaValida(coord[0], coord[1]) )
						this.pisar( coord[0], coord[1] );
				}
			}
		}
	}

	coordenadaValida( fila, columna ){
		return fila >= 0 && fila < this.filas && columna >= 0 && columna < this.columnas
	}

	ponerMinas(){
		let coord;
		let fila;
		let columna;
		let casilla;
		let puestas = 0;
		while( puestas < this.minas ) {
			fila = Math.floor((Math.random() * this.filas));
			columna = Math.floor((Math.random() * this.columnas));
			casilla = this.tablero[fila][columna];
			if( !casilla.tieneMina() ) {
				casilla.ponerMina();
				puestas++;
				for( let i = 0; i < 8; i++ ) {
					coord = this.getColindante( i, fila, columna );
					if( this.coordenadaValida( coord[0], coord[1] ) )
						this.tablero[coord[0]][coord[1]].addAmenaza();
				}
			}
		}		
	}

	getColindante( direccion, fila, columna ) {
		switch( direccion ) {
			case 1:	columna++;
			case 0: fila--; break;
			case 3:	fila++;
			case 2:	columna++; break;
			case 5:	columna--;
			case 4: fila++; break;
			case 7:	fila--;
			case 6:	columna--; break;				
		}
		return [fila,columna];
	}

	mensaje( mensaje ){
		this.$panel.html(mensaje);
	}

	mensajeMinas( minas ){
		this.mensaje('MINAS: '+minas);
	}

}