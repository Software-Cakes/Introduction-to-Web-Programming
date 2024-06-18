document.addEventListener("DOMContentLoaded", function() {
    startCode();
})

function startCode() {
    const printButton = document.getElementById("my-button");
    printButton.addEventListener("click", function() {
        console.log("hello world");
        const changeHeading = document.getElementById("h1")[0];
        changeHeading.textContent = "Moi maailma";
    })

    const addButton = document.getElementById("add-data");
    addButton.addEventListener("click", function() {
        const list = document.getElementById("my-list");
        const newItem = document.getElementById("list-item-text").newItem;
        const listItems = document.createElement("li");
        listItems.textContent = newItem;
        list.appendChild(listItems);
      })
}