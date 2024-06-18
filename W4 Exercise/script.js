if(document.readyState !== "loading") {
    console.log("Document is ready!");
    initializeCode();
} else {
    document.addEventListener("DOMContentLoaded", function() {
        console.log("Document is currently loading!");
        initializeCode();
    });
}

function initializeCode() {
    const searchTextBox = document.getElementById("input-show");
    const searchButton = document.getElementById("submit-data");
    const showContainer = document.querySelector(".show-container")

    searchButton.addEventListener("click", async function() {
        const query = searchTextBox.value;
        if (query) {
            const url = `https://api.tvmaze.com/search/shows?q=${query}`;
            try {
                const response = await fetch(url);
                const fetched_data = await response.json();
                displayShows(fetched_data);
            } catch (error) {
                console.error("ERROR: ", error)
            }
        }
    });

    function displayShows(shows) {
        showContainer.innerHTML = "";
        shows.forEach(show => {
            const showData = document.createElement("div");
            showData.classList.add("show-data");

            const showImage = show.show.image ? show.show.image.medium : "https://via.placeholder.com/210x295?text=No+Image";
            const showSummary = show.show.summary ? show.show.summary : " No summary available.";

            showData.innerHTML = `
                <img src="${showImage}" alt="${show.show.name}">
                <div class="show-info">
                    <h1>${show.show.name}</h1>
                    ${showSummary}
                </div>`;

                showContainer.appendChild(showData);
        });
    }
}