document.addEventListener('DOMContentLoaded', function() {

    const url = 'https://bigchaindb-github.now.sh'

    function injectData(data) {
        let repos = data

        // just grab the first item of array
        // should always be bigchaindb/bigchaindb cause of ordering by most stars
        stars = repos[0].stars
        document.getElementById('stargazers').innerText = stars
    }

    if (self.fetch) { // feature detection

        fetch(url)
            .then(function(response) {
                return response.json()
            })
            .then(function(data) {
                injectData(data)
            })
            .catch(function(error) {
                console.log(error)
            })

    } else { // fallback mainly for Safari, Fetch API only works in Safari 10.1+

        // https://mathiasbynens.be/notes/xhr-responsetype-json
        var getJSON = function(url) {
            return new Promise(function(resolve, reject) {
                var xhr = new XMLHttpRequest()
                xhr.open('get', url, true)
                xhr.responseType = 'json'
                xhr.onload = function() {
                    var status = xhr.status
                    if (status == 200) {
                    	resolve(xhr.response)
                    } else {
                    	reject(status)
                    }
                }
                xhr.send()
            })
        }

        getJSON(url)
            .then(function(data) {
                injectData(data)
            }, function(status) {
                console.log(status)
            })

    }

})
