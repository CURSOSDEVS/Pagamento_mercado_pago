const express = require('express');
const mercadoPago = require('mercadopago');

//instancia do express
const app = express();

//setar a configuração do mercado pago
mercadoPago.configure({
    sandBox: true,
    access_token: "TEST-3968865630091953-021112-55b106e9d39971879c1930b459f86c35-82586186"
});

//criando as rotas da aplicação
//rota principal da aplicação
app.get('/',(req, res)=>{
    res.send("Olá mundo"+Date.now());
})

//rota para pagamentos
app.get('/pagar', async (req, res)=>{

    //variavel id do produto
    var id = "" + Date.now();
    
    //email do pagador
    var emailPagador = "c_b_alves@hotmail.com";
    
    //dados do pagamento
    var dados = {
        items: [
            item = {
                //pode ser uuid , pode ser a data que a venda foi gerada com dia,mes,ano,hora,minuto,milisegunod
                //aqui vamos utilizar a data
                id: id,
                title: "2x video games; 3 camisas",
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat(150)
            }
        ],
        payer:{
            email: emailPagador
        },
        external_reference: id
    }

    try {
        //criando a variável de pagamentos
    var pagamento = await mercadoPago.preferences.create(dados);
   // console.log(pagamento);

    //Quando realizamos um pagamento, temos que ir no banco de dados e
    //salvar o pagamento , neste caso é ficticio
    // ex: Banco.SalvarPagamento({id: id, pagador: emailPagador})

    //url de pagamentos
    return res.redirect(pagamento.body.init_point);
        
    } catch (err) {
        return res.send(err.message);
    }
    
});


//rota para receber a notificação do mercado pago da finalização do pagamento
app.post('/not', (req, res)=>{

    //mostrando os parâmetros dinâmicos recebidos pela url
    console.log(req.query);

    //enviando uma resposta que a notificação foi recebido
    res.send("Ok");
});


app.listen(80, (req, res)=>{
    console.log("Servidor rodando");
})