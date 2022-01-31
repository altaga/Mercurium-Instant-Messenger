[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [<img src="https://img.shields.io/badge/View-Website-blue">](https://main.d3lic6l5z1fp8z.amplifyapp.com) [<img src="https://img.shields.io/badge/View-Video-red">](https://youtu.be/YVnSGGthOVE)


# Mercurium Instant Messenger

<p align="center">
<img src="https://i.ibb.co/S38pNfM/logo512.png" width="300px">
</p>

Welcome to MIM.

###  Mercurium is an instant messenger built on the Solana blockchain and integrated into the Serum UI.

This is our submission for the Convergence Hackathon 2022.

#### Click here to watch our demo video:

[<img src="https://raw.githubusercontent.com/altaga/SCUP-WWAC/master/Images/click-here-button.png" width=200>](https://youtu.be/YVnSGGthOVE)

## To test the product follow this link:
<a href="https://www.nft-arcade.online/" target="_blank" style="font-size:30px;">
https://main.d3lic6l5z1fp8z.amplifyapp.com

### Use Solana devnet on the Phantom wallet!!!!
    
Get it on: https://phantom.app/

follow: https://hello-17.gitbook.io/crema-devnet-test-guide/switch-your-solana-wallet-to-devnet
    
More Help: https://github.com/altaga/Mercurium-Instant-Messenger#our-solution

Needless to say, you need a friend to test it or you could message us via Devpost.    
    
</a>
<hr>

# Introduction and Problem Statement:

When we were researching what to hack we decided to check what kind of projects did the Serum and Solana communities had or what kind of Dapps they wanted the community to develop. 

So, we found this under project Requests and grants:

<img src="https://i.ibb.co/WtSLhwz/serumwish.png">

Quite interesting that there was an important demand for this kind of messaging applications, when they are ubiquitous nowadays.

But we had to evaluate first the market and see if there is really a problem...

Messaging systems and apps such as whatsapp, telegram, wechat, facebook messenger and so many others have become ubiquitous nowadays. And not only that, but businesses and individuals have become partially dependent on these and we trust them because of the number of people that use them. With more than 3.6 billion people worldwide and over 145 billion messages being sent every day. 

<img src="https://assets-global.website-files.com/5e42772e6a8cfd42a9715206/609a4d9ba39eb4aaa1308844_growth-of-messaging-apps-2016.jpeg">

This has brought forth stratospheric market valuations.

WhatsApp was acquired for $19 billion in 2014, Telegram has over 500 million users and rejected an investment offer at $30 billion. Skype was sold to Microsoft for $8.5 billion in 2011. And they will continue growing at a rate of 10% per year by 2030.

But there's a huge privacy problem in regards to siloed enterprises controlling data. These are regarding several right’s violations mainly around privacy such as Data sharing violations like the fine of 266 million euros that Whattsapp received by the EU in September last year, Telegram’s constant issues with cyber theft mainly around bank accounts and quite a large number of cases of Blackmail. And private data leaks such as the one that happened through facebook in April 2021.

Nevertheless, messaging companies are still operating under practices that suggest data governance has not been solved.

We indeed have a problem!

Data is the most valuable resource an individual has and through blockchain technology this privacy issue can be quenched. We think that the way to launch a competitor is through the DeFi ecosystem as it is growing at an incredible rate and Serum is one of the premium platforms for that.


PROBLEMAS MUY PROBLEMATICOS WE

# Our Solution:

Se realizo un chat totalmente on-chain en Solana, realizando interacciones a travez de nuestra [Phantom Wallet](https://phantom.app/) e integrado a Serum DEX.

<img src="https://i.ibb.co/tsv6prR/image.png">

Una vez abierta la barra de direccion, poner la address a la cual le mandaremos mensajes y presionamos StartChat.

<img src="https://i.ibb.co/7zQDBFj/image.png">

Una vez abierta la nueva pestaña podremos empezar a mandar mensajes a la direccion correspondiente. 

<img src="https://i.ibb.co/jfSYMLV/image.png">

Ademas de proveer incluir sobre la misma trasaccion el poder pedir o mandar SOL a la otra address de forma sencilla.

<img src="https://i.ibb.co/ckvQTjB/image.png">

Request:

<img src="./Images/Request.gif" width="100%">

Send:

<img src="./Images/Send.gif" width="100%">

Y como se menciono con anterioridad solo se autorizan las trasacciones que se hayan realizado mediante la firma con nuestra Phantom Wallet.

<img src="https://i.ibb.co/9hRCMd3/image.png">

Todo este demo corre sobre la red devnet, con el fin de poder realizar las pruebas correspondientes, si no tienes SOL para probar nuetsra pataforma, agregamos un boton de Airdrop, para mandarte 1 SOL de prueba, puedes presionarlo las veces que quieras.

<img src="https://i.ibb.co/PgwpP0c/image.png">

# How it's built:

Todo nuestro chat esta basado en el uso de transacciones e interaccion con un programa de memo desplegado en la blockchain de solana (devnet), usando la Solana JS SDK para las interacciones desde el frontend y la Phantom Wallet para firmar las trasacciones, ademas de todo estar realizado mediante el framework de ReactJS.

<img src="https://i.ibb.co/DCbLGwm/image.png">

Primero que nada, desplegamos nuestro propio programa de memo, a travez de Solana CLI.

[Pogram Code](./Program)

Si deseas rebuildear el programa ocuparas las siguientes dependendias en tu computadora.

- [NodeJS.](https://nodejs.org/en/) 
- [Solana CLI.](https://docs.solana.com/cli/install-solana-cli-tools)
- [Rust.](https://www.rust-lang.org/)

Puedes utilizar nuestro programa tambien ya que este desplegando en la blockchain.

[Solana Explorer Program](https://explorer.solana.com/address/DVzMcYDk2Hs2BF5P5iHEDc3ZG7wpLHRG9WaQPCjfayug?cluster=devnet)

Todos el chat esta completamente on-chain, asi que todos los datos obtenidos son atraves del Solana JS SDK, asi que para poder realizar seguimiento de las transacciones y los mensajes, se utilizaron dos intrucciones en cada transaccion.

## Instruction 1: 

Agregar el mensaje a la transaccion y subirlo a la blockchain.

    const instruction = new solanaWeb3.TransactionInstruction({
            keys: [],
            programId: memoPublicKey,
            data: Buffer.from(tempMessage),
    });

## Instruction 2: 

Mandar una trasaccion con 0 o mas Solana en ella, esta instruccion nos ayuda a tener la informacion del from y to, para el chat.

    var transaction = new solanaWeb3.Transaction().add(
    instruction,
    solanaWeb3.SystemProgram.transfer({
        fromPubkey: this.provider.publicKey,
        toPubkey: new solanaWeb3.PublicKey(to),
        lamports: this.state.req ? 0 : Math.round(solanaWeb3.LAMPORTS_PER_SOL * num) //Investing 1 SOL. Remember 1 Lamport = 10^-9 SOL.
    })
    );

## Example:

Aqui el ejemplo de una trasaccion directamente desde la Blockchain.

[Solana Explorer Transaction](https://explorer.solana.com/tx/3S5FGp32xsQDCEc8sXxxxwrwJxnNQBFpfQrqRKZAqAFJc7TawxQn1KRxbTZE8aMzCeJZb9Zmge39ww92hagHT2Kc?cluster=devnet)

<img src="https://i.ibb.co/FxZ4qwt/image.png">

# What's next:

# Team
[<img src="https://img.shields.io/badge/Luis%20Eduardo-Arevalo%20Oliver-blue">](https://www.linkedin.com/in/luis-eduardo-arevalo-oliver-989703122/)

[<img src="https://img.shields.io/badge/Victor%20Alonso-Altamirano%20Izquierdo-lightgrey">](https://www.linkedin.com/in/alejandro-s%C3%A1nchez-guti%C3%A9rrez-11105a157/)

[<img src="https://img.shields.io/badge/Alejandro-Sanchez%20Gutierrez-red">](https://www.linkedin.com/in/victor-alonso-altamirano-izquierdo-311437137/)

# References:
