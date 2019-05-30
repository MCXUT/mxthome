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

document.getElementById("signup_email").addEventListener("click", () => {
    document.querySelector("#registerModal").style.display = "none";
    document.querySelector("#emailModal").style.display = "block";
});

document.querySelector(".close").addEventListener("click", (e) => {
    document.querySelector("#cocoaModal").style.display = "none";
});

// document.querySelector(".modal").addEventListener("click", (e) => {
//   console.log(e);
//     document.querySelector("#cocoaModal").style.display = "none";
// });

document.querySelector("#close1").addEventListener("click", (e) => {
    console.log(e);
    document.querySelector("#registerModal").style.display = "none";
});

document.querySelector("#close2").addEventListener("click", (e) => {
    console.log(e);
    document.querySelector("#emailModal").style.display = "none";
});




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
