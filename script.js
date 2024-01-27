const searchInput = document.getElementById('search-input');
const resultArtist = document.getElementById("result-artist");
const resultPlaylist = document.getElementById('result-playlists');

async function requestApi(searchTerm) {
    const url = `http://localhost:3000/artists`
    let resultados = []
    let artistasEncontrados = []
    
    let listaDeNomes = await fetch(url)
        .then((response) => response.json())
        .then((result) => result.map((item) => item.name))

    listaDeNomes = listaDeNomes.filter((nome) => {
        if (nome.toLowerCase().includes(searchTerm)) {
            return nome;
        }
    })

    for (let i = 0; i < listaDeNomes.length; i++) {
        resultados.push(
            await fetch(`${url}?name=${listaDeNomes[i]}`)
                .then((response) => response.json())
                .then((result) => result)
        )
    }

    resultados.forEach(element => {
        artistasEncontrados.push(Object.assign({}, element))
    })

    displayResults(artistasEncontrados)
}

function displayResults(result) {
    resultArtist.classList.remove('hidden');
    let containerDeCards = document.querySelector('.grid-container')

    const card = result.map(element => `
            <div class="artist-card" id="">
                <div class="card-img">
                    <img src="${element[0].urlImg}" id="artist-img" class="artist-img" />
                    <div class="play">
                        <span class="fa fa-solid fa-play"></span>
                    </div>
                </div>
                <div class="card-text">
                    <a title="Foo Fighters" class="vst" href="">
                        <span class="artist-name" id="artist-name">${element[0].name}</span>
                        <span class="artist-categorie">Artista</span>
                    </a>
                </div>
            </div>
        `
    )

    containerDeCards.innerHTML = card.join('')

    resultPlaylist.classList.add("hidden")
}

document.addEventListener('input', function () {
    const searchTerm = searchInput.value.toLowerCase();

    if (searchTerm != '') {
        resultPlaylist.classList.add('hidden');
        resultArtist.classList.remove('hidden');

        requestApi(searchTerm);
    } else {
        resultPlaylist.classList.remove('hidden');
        resultArtist.classList.add('hidden');
    }
    
})