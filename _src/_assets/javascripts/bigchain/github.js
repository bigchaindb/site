(function() {

    var s = document.createElement('script'),
        githubApiUrl = 'https://api.github.com/repos/',
        owner = 'bigchaindb',
        repo = 'bigchaindb';

    s.type = 'text/javascript';
    s.async = true;
    s.src = githubApiUrl + owner + '/' + repo + '?callback=' + owner + '.getGitHubRepoInfo';

    window[owner] = window[owner] || {};
    window[owner].getGitHubRepoInfo = function(response) {

        var stargazers = response.data.stargazers_count;

        document.getElementById('stargazers').innerText = stargazers;
    };

    document.getElementsByTagName('HEAD')[0].appendChild(s);
}());
