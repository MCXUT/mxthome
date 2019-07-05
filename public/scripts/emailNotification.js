document.getElementById("close4").addEventListener("click", (e) => {
    document.querySelector("#validateEmailModal").style.display = "none";
});

document.getElementById("exit").addEventListener("click", (e) => {
    document.getElementById('validateEmailModal').style.display = "none";
})

document.getElementById("validateEmailModal").addEventListener("click", (e) => {
    if(e.target.className == "modal in modal_site_login ui-draggable sticky-top") {
        document.getElementById("validateEmailModal").style.display = "none";
    }
});
