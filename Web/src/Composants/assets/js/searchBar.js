window.addEventListener(
    "DOMContentLoaded",
    () => main()
)


function main() {

    document.querySelectorAll(".aSearchBar").forEach(
        element => {
            element.addEventListener(
                "click",
                () => console.log("cliqué", element.classList)
            )
        }
    )
}