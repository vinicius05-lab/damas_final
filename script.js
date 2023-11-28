$(function(){
	var casa_selecionada = null;
	var peca_selecionada = null;
	var pontos_pretas = 0;
	var pontos_brancas = 0;
	var damasPretas = {};
	var damasBrancas = {};

	function MontarTabuleiro(){
		var i;
		for (i=0; i<8; i++){
			$("#tabuleiro").append("<div id='linha_"+i.toString()+"' class='linha' >");		

			for (j=0; j<8; j++){
				var nome_casa ="casa_"+i.toString()+"_"+j.toString();
				var classe = (i%2==0?(j%2==0?"casa_branca":"casa_preta"):(j%2!=0?"casa_branca":"casa_preta"));
				$("#linha_"+i.toString()).append("<div id='"+nome_casa+"' class='casa "+classe+"' />");

				if(classe == "casa_preta"){
					if(i < 3){
						$("#"+nome_casa).append("<img src='peca_preta.png' class='peca' id='"+nome_casa.replace("casa", "peca_preta")+"'/>");
					}
					else
					if(i > 4){
						$("#"+nome_casa).append("<img src='peca_branca.png' class='peca' id='"+nome_casa.replace("casa", "peca_branca")+"'/>");	
					}

				}
			}
		}
	}

	MontarTabuleiro();

	$(".casa").click(function(){
		var aI, aJ, nI, nJ, dI, dJ;
		var casa_anterior, peca_anterior;
		
		if(peca_selecionada != null){
			aI = parseInt(casa_selecionada.substr(5, 1));
			aJ = parseInt(casa_selecionada.substr(7, 1));
			
			nI = parseInt($(this).attr("id").substr(5, 1));
			nJ = parseInt($(this).attr("id").substr(7, 1));

			dI = parseInt(((aI - nI) < 0?(aI - nI)*(-1):(aI - nI)));
			dJ = parseInt(((aJ - nJ) < 0?(aJ - nJ)*(-1):(aJ - nJ)));
		}

		$("#"+casa_selecionada).removeClass("casa_selecionada");
		casa_anterior = casa_selecionada;
		peca_anterior = peca_selecionada;
		casa_selecionada = $(this).attr("id");
		$("#"+casa_selecionada).addClass("casa_selecionada");
		peca_selecionada = $("#"+casa_selecionada).children("img").attr("id");
        $("#info_casa_selecionada").text(casa_selecionada);
		if (["casa_7_0", "casa_7_2", "casa_7_4", "casa_7_6"].includes(casa_selecionada) && peca_selecionada && peca_selecionada.indexOf("preta") >= 0) {
			damasPretas[peca_selecionada] = true;
			$("#" + peca_selecionada).attr("src", "dama_preta.png");
		}
		
		
		if(["casa_0_1", "casa_0_3", "casa_0_5", "casa_0_7"].includes(casa_selecionada) && peca_selecionada && peca_selecionada.indexOf("branca") >= 0){
			damasBrancas[peca_selecionada] = true;
			$("#" + peca_selecionada).attr("src", "dama_branca.png");

		}

        if(damasPretas[peca_anterior] && $(this).children().length === 0) {
			var obj = $("#" + peca_anterior);
		
			if (dI === dJ && dI > 0 && dJ > 0) {
				var stepI = nI > aI ? 1 : -1;
				var stepJ = nJ > aJ ? 1 : -1;
		
				var checkRow = aI + stepI;
				var checkCol = aJ + stepJ;
				var hasObstacle = false;
				var pecaCapturada = null;
		
				while (checkRow !== nI && checkCol !== nJ) {
					var checkCasa = "#casa_" + checkRow + "_" + checkCol;
		
					if ($(checkCasa).children().length > 0) {
						var pecaMeio = $(checkCasa).children("img");
		
						if (pecaMeio.attr("id").indexOf("branca") >= 0) {
							if (pecaCapturada) {
								// Se houver mais de uma peça branca na diagonal, a captura é inválida
								hasObstacle = true;
								break;
							} else {
								pecaCapturada = pecaMeio;
							}
						} else {
							hasObstacle = true;
							break;
						}
					}
		
					checkRow += stepI;
					checkCol += stepJ;
				}
		
				if (!hasObstacle) {
					// Movimento da dama: sem obstáculos, mova a dama
					$("#" + casa_anterior).remove("#" + peca_anterior);
					$("#" + casa_selecionada).append(obj);
		
					if (pecaCapturada) {
						pecaCapturada.remove();
						pontos_pretas++;
						$("#info_pontos_pretas").text(pontos_pretas.toString());
					}
				}
			}
		}
		
		
		if (damasBrancas[peca_anterior] && $(this).children().length === 0) {
			var obj = $("#" + peca_anterior);
		
			if (dI === dJ && dI > 0 && dJ > 0) {
				var stepI = nI > aI ? 1 : -1;
				var stepJ = nJ > aJ ? 1 : -1;
		
				var checkRow = aI + stepI;
				var checkCol = aJ + stepJ;
				var hasObstacle = false;
				var pecaCapturada = null;
		
				while (checkRow !== nI && checkCol !== nJ) {
					var checkCasa = "#casa_" + checkRow + "_" + checkCol;
		
					if ($(checkCasa).children().length > 0) {
						var pecaMeio = $(checkCasa).children("img");
		
						if (pecaMeio.attr("id").indexOf("preta") >= 0) {
							pecaCapturada = pecaMeio;
						} else {
							hasObstacle = true;
							break;
						}
					}
		
					checkRow += stepI;
					checkCol += stepJ;
				}
		
				if (!hasObstacle) {
					// Movimento da dama: sem obstáculos, mova a dama
					$("#" + casa_anterior).remove("#" + peca_anterior);
					$("#" + casa_selecionada).append(obj);
		
					if (pecaCapturada) {
						pecaCapturada.remove();
						pontos_brancas++;
						$("#info_pontos_brancas").text(pontos_brancas.toString());
					}
		
					jogadorAtual = "preto"; // Passe a vez para a dama preta
				}
			}
		}
		
		if(peca_selecionada==null){
			$("#info_peca_selecionada").text("NENHUMA PEÇA SELECIONADA");
			if(peca_anterior != null){
				if (((peca_anterior.indexOf("preta") >= 0) && (nI > aI)) ||	((peca_anterior.indexOf("branca") >= 0) && (nI < aI))){
					var obj = $("#"+peca_anterior);
					if((dI == 1) && (dJ == 1)){
						if (peca_anterior.indexOf("preta") >= 0){
							$("#"+casa_anterior).remove("#"+peca_anterior);
							$("#"+casa_selecionada).append(obj);
						}else if (peca_anterior.indexOf("branca") >= 0){
							$("#"+casa_anterior).remove("#"+peca_anterior);
							$("#"+casa_selecionada).append(obj);
						}							
					}else if((dI == 2) && (dJ == 2)){	
						if((peca_anterior.indexOf("branca") >= 0))	{
							var casa_meio = null, peca_meio = null;
							if(nJ < aJ){
								casa_meio = "#casa_"+(nI+1).toString()+"_"+(nJ+1).toString();								
							}else{
								casa_meio = "#casa_"+(nI+1).toString()+"_"+(nJ-1).toString();
							}
							if($(casa_meio).children().size()>0)
							peca_meio = $(casa_meio).children("img");
							
							if((peca_meio != null) && (peca_meio.attr("id").indexOf("preta") > 0)){
								$("#compila").append(peca_meio);
								peca_meio.remove();
								pontos_brancas++;
								$("#info_pontos_brancas").text(pontos_brancas.toString());
								$("#"+casa_anterior).remove("#"+peca_anterior);
								$("#"+casa_selecionada).append(obj);
							}
						}else if((peca_anterior.indexOf("preta") >= 0))	{
							var casa_meio = null, peca_meio = null;
							if(nJ < aJ){
								casa_meio = "#casa_"+(nI-1).toString()+"_"+(nJ+1).toString();								
							}else{
								casa_meio = "#casa_"+(nI-1).toString()+"_"+(nJ-1).toString();
							}
							if($(casa_meio).children().size()>0)
							peca_meio = $(casa_meio).children("img");
							if((peca_meio != null)&& (peca_meio.attr("id").indexOf("branca") > 0)){								
								peca_meio.remove();
								pontos_pretas++;
								$("#info_pontos_pretas").text(pontos_pretas.toString());
								$("#"+casa_anterior).remove("#"+peca_anterior);
								$("#"+casa_selecionada).append(obj);
							}
						}			
					}
				}
			}
		}
		else{
			$("#info_peca_selecionada").text(peca_selecionada.toString());
		}


		if(pontos_pretas == 12 || pontos_brancas == 12){
			$("#info").html("<h1>Fim de jogo!</h1>");
		}			

	});
});