$(document).ready( function(){

	var $reiniciar = $('#buscaminas .boton-reiniciar');
	var $niveles = $('#buscaminas .boton-nivel');
	var $tablero = $('#buscaminas .tablero');

	$reiniciar.click( function(event){
		reiniciar();
		event.preventDefault();
	} );

	$niveles.click( function(event){
		let nivel = this.href.split('#')[1];
		switch( nivel ){
			case 'facil':
				crearTablero( 8, 8, 10 );
				break;
			case 'medio':
				crearTablero( 16, 16, 40 );
				break;
			case 'dificil':
				crearTablero( 16, 30, 99 );
				break;
		}
		event.preventDefault();
	} );

	function reiniciar(){
		$niveles.show();
		$tablero.find('.casilla,.line-break').remove();
	}

	function crearTablero( filas, columnas, minas ){
		$niveles.hide();
		let tablero = new Tablero( filas, columnas, minas );
		for( let fila = 0; fila < tablero.filas; fila++ ){
			for( let columna = 0; columna < tablero.columnas; columna++ ){
				$tablero.append(tablero.casilla(fila,columna).$element);
			}
			$tablero.append('<div class="line-break">');
		}
	}

} );
