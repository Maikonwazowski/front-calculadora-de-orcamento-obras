window.onload = function () {
    listarCategoriasOrcamento();
}
var n = 3;
function listarCategoriasOrcamento() {
    var junta = '';
    $.ajax({
        type: 'GET',
        url: '../requisicoes/listarCategorias.php',
        success: function (response) {
            var array = JSON.parse(response);
            var code = array['code'];
            var data = array['data'];
            data.unshift({
                    "id": "-",
                    "categoria": "ESCOLHA A CATEGORIA",
                });

            if (code == 200) {
                $.each(data, function (index, item) {
                    var dados = item;
                    var id = item['id'];
                    var categoria =  item['categoria'];

                    if (dados !== '') {
                        junta += '<option value="' + categoria + '">' + categoria + '</option>';
                    }
                });
                $('#modalCategoria').html(junta);
            }
            if (code == 400) {
                swal(
                    "Atenção!",
                    "" + dataArray['mensagem'] + "",
                    "warning"
                )
            }
        }
    });
}

const linhas = document.querySelectorAll('.linhas');
linhas.forEach((linha) => {
    const tabelaOculta = linha.querySelector('.tabela-oculta');  
    linha.addEventListener('click', function() {
        if (linha.classList.contains('card-expandable')) {
            linha.classList.remove('card-expandable');
            linha.classList.add('card-expanded');
        } else {
            linha.classList.remove('card-expanded');
            linha.classList.add('card-expandable');
        }

        if (tabelaOculta.style.display === 'none' || tabelaOculta.style.display === '') {
            tabelaOculta.style.display = 'block';
        } else {
            tabelaOculta.style.display = 'none';
        }
    });
    const botoesIncrementoDecremento = linha.querySelectorAll('.btn-incremento, .btn-decremento');
    botoesIncrementoDecremento.forEach((botao) => {
        botao.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });
});


$(document).ready(function () {
    $('#btnCadastrarProduto').click(function () {
        $('#edit').modal('show');
    });
});

$("#btn_salvar").on("click",function (){
    var { dados: valores_categorias, dados_quantidades: quantidades } = geraValoresCategoria();
    $.ajax({
        type: "POST",
        url: '../requisicoes/calculaItens.php',
        data: {
            'categorias': JSON.stringify(valores_categorias),
            'quantidade':JSON.stringify(quantidades)
        },
        success: function (response) {
            var code = response['code'];
            var data = response['data'];
            if (code == 200) {
                const categoriaInfoElements = document.querySelectorAll('.categoria-info');
                categoriaInfoElements.forEach((element) => {
                    const categoriaElemento = element.querySelector('.card-body span');
                    const valorTotalElemento = element.querySelector('.card-body .valorTotal');
                    const quantidadeTotalElemento = element.querySelector('.card-body .quantidade_total');
                    const categoriaTexto = categoriaElemento.textContent.trim();
                    
                    if (data.precosArray.hasOwnProperty(categoriaTexto)) {
                        valorTotalElemento.textContent = `R$ ${data.precosArray[categoriaTexto]},00`;
                        quantidadeTotalElemento.textContent = `${data.quantidadeArray[categoriaTexto]}`;
                    } else {
                        valorTotalElemento.textContent = 'R$ 0.00';
                    }
                });
                const InfoElements = document.querySelectorAll('.row_resumo ');
                InfoElements.forEach((element) => {
                    const categoriaElemento = element.querySelector('.mt-1 .lines_custom');
                    const precoElemento = element.querySelector('.mt-1 .preco_resumo');
                    const categoriaTexto = categoriaElemento.textContent.trim();
                    var categoria = '> '+ categoriaTexto;
                    if (data.precosArray.hasOwnProperty(categoria)) {
                        precoElemento.textContent = `R$ ${data.precosArray[categoria]},00`;
                    }
                });
                
                const soma = Object.values(data.precosArray).reduce((acc, valor) => acc + valor, 0);
                const precoTotal = document.querySelector('.preco_total');
                precoTotal.textContent = `R$ ${soma},00`;
            }
            if (code == 400) {
                swal(
                    "Atenção!",
                    "" + array['mensagem'] + "",
                    "warning"
                )
            }
        }
    })
})

$(".btn-close-modal").on("click", function() {
    $('#edit').modal('hide');
});

$(".btn-orcamento").on("click",function (){
    Swal.fire({
        title: 'Sucesso!',
        text: "O orçamento foi enviado em PDF para o seu email",
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
            confirmButton: 'btn btn-success btn-lg' 
        }
    }).then((result) => {
        if (result.isConfirmed) {
        }
    });
});

$("#btnAdicionarItem").on("click",function (){
    var categoria = $('#modalCategoria').val();
    var produto = $('#modalProduto').val();
    var descricao = $('#modalDescricao').val();
    var valor = $('#modalValor').val();
    if (produto != ''&& descricao != '' && valor != '' && categoria != "ESCOLHA A CATEGORIA") {
        $.ajax({
            type: "POST",
            url: '../requisicoes/cadastraItem.php',
            data: {
                'categoria': categoria,
                'produto': produto,
                'descricao': descricao,
                'valor': valor
            },
            success: function (response) {
                var code = response['code'];
                var data = response['data'];
                if (code == 200) {
                    Swal.fire({
                        title: 'Sucesso!',
                        text: response['message'],
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            var elementosExemplo = [
                                { text: data.nome },
                                { id: 'subValor', text: data.valor },
                                { text: data.detalhes},
                                { text: '4AB7YT' },
                                { id: `valorTotalSub_${n}`, text: data.valor , class: "subValorTotal"}
                            ];
                            n++;
                            const categorias = document.querySelectorAll('.categoria-info');
                            categorias.forEach((categoria, index) => {
                                const nomeCategoria = categoria.querySelector('#categoria').textContent.trim();
                                const cardCategoria = categoria.closest('.card.linhas.mt-2');
                                if (cardCategoria && nomeCategoria == ("> "+ data.categoria)) {
                                    const divPai = cardCategoria.querySelector(".tabela-oculta");
                                    criarEstruturaCard(divPai, elementosExemplo);
                                    const botoesIncrementoDecremento = cardCategoria.querySelectorAll('.btn-incremento, .btn-decremento');
                                    botoesIncrementoDecremento.forEach((botao) => {
                                        botao.addEventListener('click', function(event) {
                                            event.stopPropagation();
                                        });
                                    });
                                }
                            });
                            $('#edit').modal('hide');
                        }
                    });
                }
                if (code == 500) {
                    Swal.fire({
                        title: 'Atenção!',
                        text: "Erro!",
                        icon: 'warning',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                        }
                    });
                }
            },
            beforeSend: function (dados, status, jqXHR) {
                $(".overlay").css("display", "block");
            },
            complete: function () {
                $(".overlay").css("display", "none");
            }
        });
    } else {
        Swal.fire({
            title: 'Atenção!',
            text: "Preencha todos os campos!",
            icon: 'warning',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
            }
        });
    }
})

function incrementarQuantidade(button) {
    var quantidadeElement = button.parentNode.querySelector('#quantidade');
    var quantidade = parseInt(quantidadeElement.textContent);
    quantidade++;
    quantidadeElement.textContent = quantidade;

    
    var index = button.closest('.card1').querySelector('.subValorTotal').id.split('_')[1];
    var valorTotalElement = button.closest('.card1').querySelector('#valorTotalSub_' + index);
    var subValorElement = button.closest('.card1').querySelector('#subValor');
    var valor = parseFloat(subValorElement.textContent.replace('R$', '').replace('.', '').replace(',00', '').replace(/,/g, ''));
    var valorTotal = valor * quantidade;
    valorTotalElement.textContent = `R$ ${valorTotal},00`;
}

function decrementarQuantidade(button) {
    var quantidadeElement = button.parentNode.querySelector('#quantidade');
    var quantidade = parseInt(quantidadeElement.textContent);
    if (quantidade > 0) {
        quantidade--;
        quantidadeElement.textContent = quantidade;

        var index = button.closest('.card1').querySelector('.subValorTotal').id.split('_')[1];
        var valorTotalElement = button.closest('.card1').querySelector('#valorTotalSub_' + index);
        var subValorElement = button.closest('.card1').querySelector('#subValor');
        var valor = parseFloat(subValorElement.textContent.replace('R$', '').replace('.', '').replace(',00', '').replace(/,/g, ''));
        var valorTotal = valor * quantidade;
        valorTotalElement.textContent = `R$ ${valorTotal},00`;
    }
}

function geraValoresCategoria() {
    const dados = {};
    const dados_quantidades = {};
    const categorias = document.querySelectorAll('.categoria-info');

    categorias.forEach((categoria, index) => {
        const nomeCategoria = categoria.querySelector('#categoria').textContent.trim();
        const cardCategoria = categoria.closest('.card.linhas.mt-2');
        
        if (cardCategoria) {
            const quantidades = cardCategoria.querySelectorAll("#quantidade");
            const valorTotalSubElements = cardCategoria.querySelectorAll('[id^="valorTotalSub_"]');
            
            const valores = [];
            let quantidade = 0;
            
            quantidades.forEach((element) => {
                quantidade += parseInt(element.textContent.trim());
            });

            valorTotalSubElements.forEach((element) => {
                valores.push(element.textContent.trim());
            });
            
            dados[nomeCategoria] = valores;
            dados_quantidades[nomeCategoria] = quantidade;
        }
    });
    return { dados, dados_quantidades };
}

function criarEstruturaCard(pai, elementos) {

    var cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'linhas','card1');

    var rowDiv = document.createElement('div');
    rowDiv.classList.add('row');
    cardDiv.appendChild(rowDiv);

    elementos.forEach(function (elemento) {
        var colDiv = document.createElement('div');
        colDiv.classList.add('col');

        var cardBodyDiv = document.createElement('div');
        cardBodyDiv.classList.add('card-body');

        var pElement = document.createElement('p');
        pElement.classList.add('card-text');
        pElement.textContent = elemento.text;

        if (elemento.class) {
            pElement.classList.add(elemento.class);
        }

        if (elemento.id) {
            pElement.id = elemento.id;
        }

        cardBodyDiv.appendChild(pElement);
        colDiv.appendChild(cardBodyDiv);
        rowDiv.appendChild(colDiv);
    });

    var divBtn = criaDivBtn();
    rowDiv.appendChild(divBtn);
    pai.appendChild(cardDiv);
}

function criaDivBtn() {

    var colDiv = document.createElement('div');
    colDiv.classList.add('col');

    var cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body');
    cardBodyDiv.style.marginLeft = '12px';

    var btnDecremento = document.createElement('button');
    btnDecremento.classList.add('btn', 'btn-sm', 'btn-danger', 'btn-decremento');
    btnDecremento.id = "decrementoBTN";
    btnDecremento.textContent = '-';
    btnDecremento.onclick = function() {
        decrementarQuantidade(this);
    };

    var spanQuantidade = document.createElement('span');
    spanQuantidade.classList.add('card-text');
    spanQuantidade.id = 'quantidade';
    spanQuantidade.textContent = ' 1 ';

    var btnIncremento = document.createElement('button');
    btnIncremento.classList.add('btn', 'btn-sm', 'btn-success', 'btn-incremento');
    btnIncremento.textContent = '+';
    btnIncremento.onclick = function() {
        incrementarQuantidade(this);
    };

    cardBodyDiv.appendChild(btnDecremento);
    cardBodyDiv.appendChild(spanQuantidade);
    cardBodyDiv.appendChild(btnIncremento);
    colDiv.appendChild(cardBodyDiv);

    return colDiv;

}

function mascaraPersonalizada() {
    var value = this.value.replace(/\D/g, ""); 
    var formattedValue = "";

    if (value.length > 0) {
        value = value.replace(/^0+/, "");

        var integerPart = value;
        var decimalPart = "";

        if (value.length > 2) {
            integerPart = value.slice(0, -2);
            decimalPart = "," + value.slice(-2);
        }
        var parts = [];
        while (integerPart.length > 3) {
            parts.unshift(integerPart.slice(-3));
            integerPart = integerPart.slice(0, -3);
        }
        parts.unshift(integerPart);

        formattedValue = parts.join(".") + decimalPart;
    }

    this.value = "R$ " + formattedValue;
}

var inputElement = document.getElementById("modalValor");
inputElement.addEventListener("input", mascaraPersonalizada );


