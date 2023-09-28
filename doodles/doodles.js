const blobs = document.querySelectorAll(".background .blob");

function changeColors() {
  for (const blob of blobs) {
    if (blob.classList.contains("green")) {
      blob.classList.remove("green");
      blob.classList.add("yellow");
    } else if (blob.classList.contains("yellow")) {
      blob.classList.remove("yellow");
      blob.classList.add("pink");
    } else if (blob.classList.contains("pink")) {
      blob.classList.remove("pink");
      blob.classList.add("green");
    }
  }
}
