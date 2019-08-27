const htmlTemplate = content => `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <title>CaseFu FSD</title>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
          integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">

    <style>
        main > section {
            display: none;
            margin-top: 20px;
        }

        main > section:target {
            display: block;
        }

        .card {
            margin-bottom: .75rem;
        }

        h5.card-title p {
            margin-bottom: 0;
        }

        .form-group.row p {
            margin-bottom: 0;
            margin-top: 7px;
        }

        table th p, table td p {
            margin-bottom: 0;
        }

        blockquote {
            background-color: rgba(252, 252, 200, 0.5);
            margin: 5px 0 1rem;
            padding: 5px 5px 5px 10px;
            border-left: 5px solid rgba(143, 188, 143, 0.5);
            border-radius: 3px;
        }

        blockquote > *:last-child {
            margin-bottom: 0;
        }

        .cf-required {
            color: red;
            font-weight: bold;
        }
    </style>
</head>
<body>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#__home">
        <i class="fas fa-home text-muted"></i>
    </a>
    <ul class="navbar-nav mr-auto">
        <li class="nav-item">
            <a class="nav-link" href="#__search">
                <i class="fas fa-search text-muted"></i>
            </a>
        </li>
    </ul>
</nav>

<div class="container-fluid">
    <main role="main">

        ${content}

    </main>
</div>

<script>
  window.addEventListener("load", function () {
    var searchText = document.getElementById('searchText')
    if (searchText) {
      searchText.oninput = function (event) {
        var query = event.target.value
        var items = document.getElementsByClassName('__search-item')
        for (var i = 0; i < items.length; i++) {
          var item = items[i]
          var itemId = item.id
          var code = itemId.substr('__search-item-'.length)
          var section = document.getElementById(code)
          var matches = !query.trim() || section.innerHTML.toLowerCase().includes(query.toLowerCase())
          item.style.display = matches ? 'list-item' : 'none'
        }
      }
      searchText.focus()
    }

    window.onhashchange = function () {
      if (location.hash === '#__search') {
        searchText.focus()
      }
    }

    if (!window.location.hash) {
      window.location.hash = '__home'
    }
  })
</script>

</body>
</html>
`

module.exports = {
  htmlTemplate
}
