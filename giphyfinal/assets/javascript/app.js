// Variables

var queryURL = "https://api.giphy.com/v1/gifs/search?" + "api_key=U2oNXWwYpi90Jby05sZe7m7U2KNeBB97"
var giphys = ['yoga', 'love', 'sunset'];
var buttons = ['wine', 'seafood', 'island'];
var favorites = [];
var currentSearch = [];

// localStorage
function loadButtons() {
    const listButtons = JSON.parse(localStorage.getItem('buttons'));

    if (listButtons && listButtons.length > 0) {
        buttons = listButtons;
    }
}

// Save to localStorage
function saveButtonsToLocalStorage(buttons) {
    localStorage.setItem('buttons', JSON.stringify(buttons));
}

//buttons
function renderButtons() {
    $('.recent-search').empty();

    for (let i = 0; i < buttons.length; i++) {
        const buttonName = buttons[i];

        const button = `<div class="buttons">
                <button
                    data-name="${buttonName}"
                    class="btn btn-search"
                >
                ${buttonName}
                </button>
                <button
                    data-name="${buttonName}"
                    class="btn btn-close fas fa-times">
                </button>
        </div>`;

        $('.recent-search').append(button);
    }

    saveButtonsToLocalStorage(buttons);
}

// Create giphy section mock up
    function createGiphyTemplate(giphy) {
    var images = giphy.images;
    var starredIndex = favorites.indexOf(giphy.id);
    var isStar = starredIndex === -1;

    return `<div class="giphy">
            <i class="${!isStar ? 'fas' : 'far'} fa-star favorite"
                data-id="${giphy.id}" data-star="${isStar ? 'false' : 'true'}">
            </i>
            <div class="giphy-image">
                <img
                    src="${images.original_still.url}"
                    data-still="${images.original_still.url}"
                    data-animate="${images.original.url}"
                    data-state="still"
                />
                <i class="fa fa-play img-play"></i>
            </div>
            <div class="giphy-info">
                <p>Rating: ${giphy.rating}</p>
               
            </div>
            <div class="giphy-footer" data-link="${giphy.embed_url}"> 
              
            </div>
    </div>`;
}

// use Giph
function renderGiphy(giphys) {
    $('.giphy-content').empty();

    for (let i = 0; i < giphys.length; i++) {
        var giphy = giphys[i];
        var giphyTemplate = createGiphyTemplate(giphy);

        $('.giphy-content').append(giphyTemplate);
    }
}

// ajax 
function fetchGiphy(value) {
    var url = queryURL + '&q=' + value;

    $.ajax({ url })
        .then((response) => {
            renderGiphy(response.data);
            currentSearch = response.data;
        })
        
}

function randomValue(values) {
    var index = Math.floor(Math.random() * values.length);
    var value = values[index];
    return value;
}

// clicked
function imgCardClick() {
    var giphyCard = $(this);

    var image = giphyCard.find('img');
    var iconPlay = giphyCard.find('i');
    
    var still = image.attr('data-still');
    var animate = image.attr('data-animate');
    var state = image.attr('data-state');

    if (state === 'still') {
        image.attr({
            'src': animate,
            'data-state': 'animate'
        });

        iconPlay.removeClass('img-play');
    } else {
        iconPlay.addClass('img-play');
        image.attr({
            'src': still,
            'data-state': 'still'
        });
    }
}




function removeButton() {
    var text = $(this).attr('data-name');

    var newButtons = filterByValue(buttons, text);
    buttons = newButtons;
    renderButtons();
}

function searchGiphyByButton() {
    var value = $(this).attr('data-name');
    $('.btn').parent().removeClass('active');
    $(this).parent().addClass('active');

    
    fetchGiphy(value);
}

function clearResult(event) {
    event.preventDefault();


    $('.giphy-content').empty();
    $('.giphy-content').append();
}

function searchGiphy(event) {
    event.preventDefault();
    var value = $('#search').val();


    fetchGiphy(value);
    buttons.push(value);
    renderButtons(value);

    $('#search').val('');
}

function disableSearchButton() {
    var value = $(this).val();

    if (value) {
        $('#submit-button').prop('disabled', false);
    } else {
        $('#submit-button').prop('disabled', true);
    }
}





function filterByValue(list, value) {
    var arr = list.filter((el) => el !== value);
    return arr;
}




$(document).on('click', '.giphy-image', imgCardClick);
$(document).on('click', '.btn-close', removeButton);
$(document).on('click', '.btn-search', searchGiphyByButton);



$('#clear-results').on('click', clearResult);
$('#submit-button').on('click', searchGiphy);
$('#search').on('keyup', disableSearchButton);



function initApp() {
    var value = randomValue(giphys);


    loadButtons();
    renderButtons();
    fetchGiphy(value);
}

// Initialize 
initApp();