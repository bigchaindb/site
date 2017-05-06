(function() {

    var s = document.createElement('script'),
        t = document.createElement('script'),
        githubApiUrl = 'https://api.github.com/repos/',
        owner = 'bigchaindb',
        repo = 'bigchaindb';

    s.async = true;
    s.src = githubApiUrl + owner + '/' + repo + '?callback=' + owner + '.getGitHubRepoInfo';

    t.async = true;
    t.src = githubApiUrl + owner + '/' + repo + '/releases/latest?callback=' + owner + '.getGitHubReleaseInfo';

    window[owner] = window[owner] || {};
    window[owner].getGitHubRepoInfo = function(response) {

        var stargazers = response.data.stargazers_count;

        document.getElementById('stargazers').innerText = stargazers;
    };

    window[owner].getGitHubReleaseInfo = function(response) {

        var version = response.data.tag_name;

        document.getElementById('version').innerText = version;
    };

    document.getElementsByTagName('HEAD')[0].appendChild(s);
    document.getElementsByTagName('HEAD')[0].appendChild(t);
}());
