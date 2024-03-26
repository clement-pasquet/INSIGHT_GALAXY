window.addEventListener(
    "DOMContentLoaded",
    () => main()
)

function main() {
    document.querySelectorAll(".object a").forEach(
        e => e.addEventListener(
            "click",
            () => console.log("cliqué")
        )
    )
}