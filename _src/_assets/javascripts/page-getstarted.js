//=include bigchain/smoothscroll.js
//=include bigchain/newsletter.js

jQuery(function($) {

    //
    // init modules
    //
    Newsletter.init()
})

//=include bigchaindb-driver/dist/browser/bundle.window.min.js

window.addEventListener('DOMContentLoaded', function domload(event){
    window.removeEventListener('DOMContentLoaded', domload, false)

    const driver = window.BigchainDB
    const API_PATH = 'https://test.ipdb.io/api/v1/'
    const APP_ID = 'b563bf22'
    const APP_KEY = 'fd639614dcf8ee90a8c51a013ac11fb0'

    const form = document.getElementById('form-transaction')
    const postButton = document.getElementById('post')

    postButton.addEventListener('click', function(e) {
        e.preventDefault()

        const message = document.getElementById('message').value

        const alice = new driver.Ed25519Keypair()
        const tx = driver.Transaction.makeCreateTransaction(
            { assetMessage: message },
            { metaDataMessage: 'hello' },
            [ driver.Transaction.makeOutput(
                    driver.Transaction.makeEd25519Condition(alice.publicKey))
            ],
            alice.publicKey
        )
        const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey)

        const conn = new driver.Connection(API_PATH, {
            app_id: APP_ID,
            app_key: APP_KEY
        })

        const waiting = document.getElementsByClassName('waiting')[0]
        const response = document.getElementsByClassName('response')[0]
        const output = document.getElementsByClassName('output')[0]

        conn.postTransaction(txSigned)
            .then(() => {
                waiting.classList.add('hide')
                response.classList.remove('hide')

                const outputContent = conn.getStatus(txSigned.id)
                output.textContent = outputContent
            }, reason => { // Error!
                console.log(reason)

                waiting.classList.add('hide')
                response.classList.remove('hide')

                const outputContent = reason.status + ' ' +  reason.statusText
                output.textContent = outputContent
            })
            .then((res) => console.log('Transaction status:', res.status))

    }, false)
}, false)
