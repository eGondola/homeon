if(window.location.pathname.substring(1)[0] === "r") {
    fetch("/confirm", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({confirmEmailToken: window.location.pathname.substring(1)})
    })
        .then( odp => odp.text() )
        .then( v => {
            if(v == "true") {
                window.history.replaceState({}, document.title, "/");
                window.location.reload()
            }
        });
}