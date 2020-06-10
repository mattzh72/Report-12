function cycleBackground(num = 5) {
    let count = 0;
    setInterval(() => {
        count = (count + 1) % 5;
        $("#header-container").css("background-image", `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('./resources/images/bg-${(count + 1)}.png')`);
    }, 10000);
}
