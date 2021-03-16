
var estadosSelect = document.getElementById("selectEstado");
var req = new XMLHttpRequest();

req.open('GET', 'https://servicodados.ibge.gov.br/api/v1/localidades/estados', false);
req.send(null);

var values = JSON.parse(req.responseText);

let pos = 19;
var option = document.createElement("option");
option.value = values[pos].id;
option.text = values[pos].nome;
estadosSelect.appendChild(option);

pesquisaMunicipio(option.value);

function selectEstadosClick(){
    let idEstado = estadosSelect.options[estadosSelect.selectedIndex].value.split(" ")[0]
    pesquisaMunicipio(idEstado)
}


function pesquisaMunicipio(idEstado){
    
    let cidadesSelect = document.getElementById("selectCidade");
    cidadesSelect.innerHTML = null;
    
    let request = new XMLHttpRequest();
    request.open('GET', 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/' +idEstado+'/municipios',false);
    request.send(null);

    var cidades = JSON.parse(request.responseText);

    for(let pos = 0; pos < cidades.length; pos++){
        cidadesSelect.appendChild(new Option(cidades[pos].id +" - "+ cidades[pos].nome));
    }
}

function btnPesquisaidadeClick(){
    
    let cidade = document.getElementById("selectCidade");
    let idCidade =  cidade.options[cidade.selectedIndex].value.split(" - ")[1];
    let data = document.getElementById("inputData");
    
    var request = new XMLHttpRequest();
    //var temp = 'https://transparencia.tce.sp.gov.br/api/json/despesas/'+ idCidade +'/'+ data.value.split("-")[0] +'/'+ data.value.split("-")[1];
    
    request.open('GET',  'https://transparencia.tce.sp.gov.br/api/json/receitas/'+ idCidade +'/'+ data.value.split("-")[0] +'/'+ data.value.split("-")[1] , false);
    request.send(null);
    
    var val = JSON.parse(request.responseText);
    preecheTabela(val);

}//btnPesquisaidadeClick

function preecheTabela(dadosTabela){

    if(dadosTabela.length == 0){
        alert("Não existem dados cadastrados para o Período.");
        return;
    }

    var tabela = document.querySelector(".table tbody");
    var tmpSource = document.getElementById("lineTable").innerHTML;
    var tmpHandle = Handlebars.compile(tmpSource);

    for (let pos =0; pos < dadosTabela.length; pos++){

        var dados ={};
        dados.Orgao = dadosTabela[pos].orgao;
        dados.Fonte = dadosTabela[pos].ds_fonte_recurso;
        dados.OrigemRecurso = dadosTabela[pos].ds_alinea;
        dados.Valor = dadosTabela[pos].vl_arrecadacao;

        var linha ={};
        linha.template = document.createElement("template");
        linha.template.innerHTML = tmpHandle(dados);
        linha.content = document.importNode(linha.template.content, true);

        tabela.appendChild(linha.content);
    }

}//preecheTabela