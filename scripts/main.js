var pins = [
    { 
      title: "Stone Mountain",
      position: {lat: 33.8082, lng: -84.1702}, 
      description: "Gummies fruitcake marshmallow chocolate oat cake tootsie roll marshmallow cookie pie. Oat cake bonbon biscuit lemon drops. Bonbon bear claw bonbon cotton candy sweet pie jelly beans.", 
      image: "images/image01.jpg" 
    },
    { 
      title: "Arabia Mountain",
      position: {lat: 33.6651, lng: -84.11182}, 
      description: "Pastry cookie caramels pudding. Fruitcake sweet roll jelly-o cookie gummi bears liquorice. Bonbon jelly-o jujubes powder marzipan biscuit topping marshmallow marshmallow.", 
      image: "images/image02.jpg"
    },
    { 
      title: "Glenn Hotel Rooftop Bar",
      position: {lat: 33.759126, lng: -84.394726}, 
      description: "Dragée muffin jujubes. Donut chocolate cake tootsie roll cake danish macaroon sweet. Sweet cake cake chocolate bar danish icing ice cream jelly beans. Marshmallow bear claw jelly.", 
      image: "images/image03.jpg"
    },
    { 
      title: "Lullwater Park",
      position: {lat: 33.802188, lng: -84.314281}, 
      description: "Jujubes bonbon toffee brownie jelly-o bonbon jelly-o chocolate bar. Jelly-o caramels tiramisu sweet chocolate bar. Cake jelly-o sweet apple pie.", 
      image: "images/image04.jpg"
    },
    { 
      title: "Morningside Nature Preserve Trail",
      position: {lat: 33.806707, lng: -84.356759}, 
      description: "Sugar plum pie chocolate cake cake ice cream gummies marshmallow. Donut liquorice bonbon jelly topping bear claw bear claw icing sweet. Ice cream macaroon halvah dessert pie gummi bears.", 
      image: "images/image05.jpg"
    },
];

var map;
var mapContainer = document.querySelector(".map");
var modalScreen = document.querySelector(".modal-screen");
var modalImage = document.querySelector(".modal-image");
var modalTitle = document.querySelector(".modal-title");
var modalDescription = document.querySelector(".modal-description");
var modalCloseButton = document.querySelector(".close-modal");

var initMap = function () {
    map = new google.maps.Map(mapContainer, {
        center: {lat: 33.7490, lng: -84.3880},
        zoom: 10
    });
    var infoWindow = new google.maps.InfoWindow();
    loadSearchBox();
    addMarkersToMap(infoWindow);
    showVisibleMarkers();
};

var showVisibleMarkers = function () {
    // Fired when the map becomes idle after panning or zooming.
    google.maps.event.addListener(map, 'idle', function() {
        // get bounds of current map viewport
        var mapBounds = map.getBounds();
        var searchListings = document.querySelector(".search-listings");
        clearListingDisplay();
        // loop through pins objects
        pins.forEach(function (pin) {
            // if mapBounds contains the pin position
            if (mapBounds.contains(pin.position)) {
                // display on screen
                searchListings.appendChild(displayListing(pin));
            }
        })
    });
};

var clearListingDisplay = function () {
    var listings = document.querySelectorAll(".listing");
    listings.forEach(function (listing) {
        listing.remove();
    })
};

var displayListing = function (pin) {
    var listing = document.createElement("div");
    listing.classList.add("listing");
    listing.appendChild(listingImageDisplay(pin));
    listing.appendChild(listingInfoDisplay(pin));
    listing.appendChild(listingArrowDisplay());
    listing.addEventListener("click", function () {
        openModalScreen(pin);
    });
    return listing;
};

var listingArrowDisplay = function () {
    var listingArrow = document.createElement("div");
    listingArrow.classList.add("listing-arrow");
    listingArrow.textContent = ">";
    return listingArrow;
}

var listingInfoDisplay = function (pin) {
    var listingInfoContainer = document.createElement("div");
    listingInfoContainer.classList.add("listing-info");
    listingInfoContainer.appendChild(listingInfoTitle(pin));
    listingInfoContainer.appendChild(listingInfoDescription(pin));
    return listingInfoContainer;
};

var listingInfoTitle = function (pin) {
    var listingTitle = document.createElement("h3");
    listingTitle.classList.add("listing-title");
    listingTitle.textContent = pin.title;
    return listingTitle;
};

var listingInfoDescription = function (pin) {
    var listingDescription = document.createElement("p");
    listingDescription.classList.add("listing-description");
    listingDescription.classList.add("description-visibility");
    listingDescription.textContent = pin.description;
    return listingDescription;
};

var listingImageDisplay = function(pin) {
    var listingImage = document.createElement("img");
    listingImage.classList.add("listing-image");
    listingImage.setAttribute("src", pin.image);
    return listingImage;
};

var addMarkersToMap = function (infoWindow) {
    pins.forEach( function (pin) {
        var markerIcon = {
            url: 'https://maps.google.com/mapfiles/kml/shapes/sunny.png',
            size: new google.maps.Size(30, 30),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0),
            scaledSize: new google.maps.Size(30, 30),
        };
        var marker = new google.maps.Marker( {
            position: pin.position,
            map: map,
            icon: markerIcon,
            title: pin.title
        });
        google.maps.event.addListener(marker, 'click', function() {
            infoWindow.setContent(addInfoWindowContent(pin));
            infoWindow.open(map, marker);
        });
    })
};

var addInfoWindowContent = function (pin) {
    var infoWindowContent = document.createElement("div");
    infoWindowContent.classList.add("info-window");
    infoWindowContent.appendChild(infoWindowTitle(pin));
    infoWindowContent.appendChild(infoWindowImage(pin));
    return infoWindowContent;
};

var infoWindowTitle = function (pin) {
    var infoWindowTitle = document.createElement("p");
    infoWindowTitle.classList.add("info-window-title");
    infoWindowTitle.textContent = pin.title;
    return infoWindowTitle;
};

var infoWindowImage = function (pin) {
    var infoWindowImage = document.createElement("img");
    infoWindowImage.classList.add("info-window-image");
    infoWindowImage.setAttribute("src", pin.image);
    return infoWindowImage;
};

var openModalScreen = function (pin) {
    modalScreen.classList.remove("hidden");
    modalImage.setAttribute("src", pin.image);
    modalTitle.textContent = pin.title;
    modalDescription.textContent = pin.description;
};

var windowOnClick = function (event) {
    if (event.target === modalScreen) {
        hideModalScreen();
    }
};

var hideModalScreen = function () {
    modalScreen.classList.add("hidden");
};

var loadSearchBox = function () {
    var searchInput = document.querySelector(".search-input");
    var searchBox = new google.maps.places.SearchBox(searchInput);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });
    searchBox.addListener("places_changed", function () {
        searchBoxListener(searchBox);
    });
};

var searchBoxListener = function (searchBox) {
    var places = searchBox.getPlaces();
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
        if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
        });
        map.fitBounds(bounds);
};

modalCloseButton.addEventListener("click", hideModalScreen);
window.addEventListener("click", windowOnClick);