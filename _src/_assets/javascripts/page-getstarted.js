//=require gumshoe/dist/js/gumshoe.js

//=include bigchain/tab.js
//=include bigchain/newsletter.js

const bigchaindbUrl = 'https://test.bigchaindb.com'
const proxyUrl = 'https://getstarted.bigchaindb.com'
const apiPath = '/api/v1/'

jQuery(function($) {

    //
    // init modules
    //
    Newsletter.init()

})


//
// Scrollspy
//
gumshoe.init()


//
// Sticky nav
//
function stickyNav() {
    const menu = document.getElementsByClassName('menu--sub')[0]

    if ( window.innerWidth >= 768 ) {
        const offset = menu.offsetTop

        window.addEventListener('scroll', function() {
            if (offset < window.pageYOffset) {
                menu.classList.add('sticky')
            } else {
                menu.classList.remove('sticky')
            }
        }, false)
    }
}

stickyNav()


//
// Test network version
//
function testNetworkVersion() {
    const versionOutput = document.getElementById('network-version')

    fetch(bigchaindbUrl)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            const version = data.version
            const titleOrig = versionOutput.getAttribute('title')

            versionOutput.innerText = version
            versionOutput.setAttribute('title', titleOrig + version)
        })
        .catch(function(error) {
            console.log(error)
        })
}

testNetworkVersion()


//
// BigchainDB transaction tool
//

// makes this file huuuuge, consider loading this as additional request
//=include bigchaindb-driver/dist/browser/bigchaindb-driver.window.min.js

window.addEventListener('DOMContentLoaded', function domload(event) {
    window.removeEventListener('DOMContentLoaded', domload, false)

    const driver = window.BigchainDB
    const API_PATH = proxyUrl + apiPath

    const form = document.getElementById('form-transaction')
    const postButton = document.getElementById('post')
    const messageInput = document.getElementById('message')

    // nasty jquery inside of here, YOLO
    $(".highlight code:contains('Blockchain all the things!')").html(function(_, html) {
        return html.replace(/(Blockchain all the things!)/g, '<strong class="code-example__message">$1</strong>');
    })

    const codeMessages = document.querySelectorAll('.code-example__message')

    function updateMessage(content) {
        const escapedContent = content.replace(/'/g, "\\'")
        for (var codeMessage of codeMessages) {
            codeMessage.textContent = escapedContent
        }
    }
    // empty default message
    updateMessage('')

    // quick form validation, live update code example with user input
    messageInput.addEventListener('input', function() {
        if (messageInput.value === '') {
            postButton.setAttribute('disabled', '')
            // empty message again
            updateMessage('')
        } else {
            postButton.removeAttribute('disabled')

            // update code message
            updateMessage(messageInput.value)
        }
    })

    postButton.addEventListener('click', function(e) {
        e.preventDefault()

        const message = messageInput.value
        postButton.classList.add('disabled')

        const alice = new driver.Ed25519Keypair()
        const tx = driver.Transaction.makeCreateTransaction(
            { message: message },
            null,
            [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(alice.publicKey))],
            alice.publicKey)
        const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey)

        const conn = new driver.Connection(API_PATH)

        const waiting = document.getElementsByClassName('waiting')[0]
        const responseArea = document.getElementsByClassName('response')[0]
        const output = document.getElementsByClassName('output')[0]
        const messageInitial = document.getElementsByClassName('message')[0]
        const messageSuccess = document.getElementsByClassName('message--success')[0]
        const messageFail = document.getElementsByClassName('message--fail')[0]
        const transactionLink = document.getElementsByClassName('transaction-link')[0]

        conn.postTransactionCommit(txSigned).then((response) => {
            waiting.classList.add('hide')
            messageInitial.classList.add('hide')
            responseArea.classList.remove('hide')
            messageSuccess.classList.remove('hide')

            console.log(response)

            const outputContent = JSON.stringify(response, null, 2) // indented with 2 spaces
            output.textContent = outputContent

            transactionLink.href = bigchaindbUrl + apiPath + 'transactions/' + response.id

            postButton.style.opacity = 0

        }, reason => { // Error!
            console.log(reason)

            waiting.classList.add('hide')
            responseArea.classList.remove('hide')
            messageFail.classList.remove('hide')

            const outputContent = reason.status + ' ' + reason.statusText
            output.textContent = outputContent
        }).then((res) => console.log('Transaction status:', res.status))

    }, false)
}, false)
