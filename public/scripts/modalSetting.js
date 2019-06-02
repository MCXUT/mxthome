document.getElementById("auth").addEventListener("click", (e) => {
    document.querySelector("#cocoaModal").style.display = "block";
});

document.getElementById("login1").addEventListener("click", (e) => {
    document.querySelector("#cocoaModal").style.display = "block";
    document.querySelector("#registerModal").style.display = "none";
});

document.getElementById("login2").addEventListener("click", (e) => {
    document.querySelector("#cocoaModal").style.display = "block";
    document.querySelector("#emailModal").style.display = "none";
});

document.getElementById("findpassword").addEventListener("click", (e) => {
    document.querySelector("#cocoaModal").style.display = "none";
    document.querySelector("#findpasswordModal").style.display = "block";
});

document.getElementById("signup_email").addEventListener("click", () => {
    document.querySelector("#registerModal").style.display = "none";
    document.querySelector("#emailModal").style.display = "block";
});

document.getElementById("signup_email2").addEventListener("click", () => {
    document.querySelector("#findpasswordModal").style.display = "none";
    document.querySelector("#cocoaModal").style.display = "block";
});

document.getElementById("fold").addEventListener("click", () => {
    document.querySelector("#registerModal").style.display = "block";
    document.querySelector("#emailModal").style.display = "none";
})

document.querySelector(".close").addEventListener("click", (e) => {
    document.querySelector("#cocoaModal").style.display = "none";
});

document.querySelector("#close1").addEventListener("click", (e) => {
    //console.log(e);
    document.querySelector("#registerModal").style.display = "none";
});

document.querySelector("#close2").addEventListener("click", (e) => {
    //console.log(e);
    document.querySelector("#emailModal").style.display = "none";
});

document.querySelector("#close3").addEventListener("click", (e) => {
    //console.log(e);
    document.querySelector("#findpasswordModal").style.display = "none";
});


//=======EVENT LISTENERS FOR CLOSING THE FORM WHEN CLICKING OUTSIDE THE BOX====//
document.getElementById("cocoaModal").addEventListener("click", (e) => {
    if(e.target.className == "modal in modal_site_login ui-draggable sticky-top") {
        document.getElementById("cocoaModal").style.display = "none";
    }
});

document.getElementById("registerModal").addEventListener("click", (e) => {
    if(e.target.className == "modal in modal_site_login ui-draggable sticky-top") {
        document.getElementById("registerModal").style.display = "none";
    }
});

document.getElementById("emailModal").addEventListener("click", (e) => {
    if(e.target.className == "modal in modal_site_login ui-draggable sticky-top") {
        document.getElementById("emailModal").style.display = "none";
    }
});

document.getElementById("findpasswordModal").addEventListener("click", (e) => {
    if(e.target.className == "modal in modal_site_login ui-draggable sticky-top") {
        document.getElementById("findpasswordModal").style.display = "none";
    }
});
//====================================================================//



// document.getElementById("outside").addEventListener("click", (e) => {
//   console.log(e);
//   if(e.target.idName == "modal.in.modal_site_login.ui-draggable") {
//     // e.preventDefault();
//      document.querySelector("#cocoaModal").style.display = "none";
//   }
//
document.getElementById("signup").addEventListener("click", () => {
    document.querySelector("#cocoaModal").style.display = "none";
    document.querySelector("#registerModal").style.display = "block";
});

document.getElementById("close4").addEventListener("click", (e) => {
    document.querySelector("#validateEmailModal").style.display = "none";
});

document.getElementById("validateEmailModal").addEventListener("click", (e) => {
    if(e.target.className == "modal in modal_site_login ui-draggable sticky-top") {
        document.getElementById("validateEmailModal").style.display = "none";
    }
});

// document.getElementById("signup1").addEventListener("click", () => {
//     document.querySelector("#jungohModal").style.display = "block";
// });

  // document.getElementById("signup").addEventListener("click", () => {
  //     document.querySelector("#register").style.display = "flex";
  // });

  // else{
  //
  // }
//
// window.onclick = function (event) {
//   if (document.querySelector(".bg-modal").style.display === "flex") {
//     var modalContent = modal.querySelector(".modal-content");
//     if (!modalContent.contains(event.target)) {
//       document.querySelector(".bg-modal").style.display = "none";
//     }
//   }
// };
