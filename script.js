/* ============================================================
   OUR STORY — PHOTO ALBUM SCRIPTS (Open Book Edition)
   ============================================================ */

// ---------- Open Book (Spread-based) ----------
var spreads      = [];
var currentSpread = 0;
var totalSpreads  = 0;
var bookLeft, bookRight;

function initBook() {
  bookLeft  = document.getElementById("book-left");
  bookRight = document.getElementById("book-right");
  spreads   = Array.from(document.querySelectorAll("#page-data .spread"));
  totalSpreads = spreads.length;
  showSpread(0);
  updateButtons();
}

function showSpread(index) {
  var spread = spreads[index];
  var left   = spread.querySelector(".left-content");
  var right  = spread.querySelector(".right-content");

  bookLeft.innerHTML  = '<div class="page-content">' + left.innerHTML + '</div>';
  bookRight.innerHTML = '<div class="page-content">' + right.innerHTML + '</div>';

  updatePageNum();
  updateButtons();
  handleMissingImages();
}

function flipNext() {
  if (currentSpread >= totalSpreads - 1) return;
  currentSpread++;
  showSpread(currentSpread);
}

function flipPrev() {
  if (currentSpread <= 0) return;
  currentSpread--;
  showSpread(currentSpread);
}

function updatePageNum() {
  var el = document.getElementById("page-num");
  if (el) {
    if (currentSpread === 0) {
      el.textContent = "Cover";
    } else if (currentSpread >= totalSpreads - 1) {
      el.textContent = "The End";
    } else {
      el.textContent = "Page " + (currentSpread * 2) + " - " + (currentSpread * 2 + 1);
    }
  }
}

function updateButtons() {
  var prevBtn = document.getElementById("prev-btn");
  var nextBtn = document.getElementById("next-btn");
  if (prevBtn) prevBtn.disabled = (currentSpread <= 0);
  if (nextBtn) nextBtn.disabled = (currentSpread >= totalSpreads - 1);
}

// ---------- Lightbox ----------
var lightbox    = document.getElementById("lightbox");
var lightboxImg = document.getElementById("lightbox-img");
var lightboxCap = document.getElementById("lightbox-caption");
var allPhotos   = [];
var currentIndex = 0;

function collectCards() {
  allPhotos = Array.from(document.querySelectorAll("#book .page-photo"));
}

function openLightbox(el) {
  collectCards();
  currentIndex = allPhotos.indexOf(el);
  if (currentIndex === -1) currentIndex = 0;
  showPhoto(currentIndex);
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function showPhoto(index) {
  var photo   = allPhotos[index];
  var img     = photo.querySelector("img");
  var caption = photo.querySelector(".page-caption");
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxImg.classList.toggle("rotate-right-90", img.classList.contains("rotate-right-90"));
  lightboxCap.textContent = caption ? caption.textContent : "";
}

function closeLightbox(e) {
  if (e.target === lightbox || e.target.classList.contains("lightbox-close")) {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function navLightbox(e, direction) {
  e.stopPropagation();
  currentIndex = (currentIndex + direction + allPhotos.length) % allPhotos.length;
  showPhoto(currentIndex);
}

// Keyboard navigation
document.addEventListener("keydown", function (e) {
  // Lightbox keys
  if (lightbox.classList.contains("active")) {
    if (e.key === "Escape") {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    } else if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % allPhotos.length;
      showPhoto(currentIndex);
    } else if (e.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + allPhotos.length) % allPhotos.length;
      showPhoto(currentIndex);
    }
    return;
  }

  // Book page-flip keys
  if (e.key === "ArrowRight") {
    flipNext();
  } else if (e.key === "ArrowLeft") {
    flipPrev();
  }
});

// ---------- Placeholder images ----------
function handleMissingImages() {
  document.querySelectorAll("#book .page-photo img").forEach(function (img) {
    img.addEventListener("error", function () {
      this.alt = "Add your photo here";
      this.src = "data:image/svg+xml," + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">' +
        '<rect width="400" height="300" fill="#2a2030"/>' +
        '<text x="200" y="140" text-anchor="middle" font-family="Georgia,serif" font-size="18" fill="#a89070">Your Photo Here</text>' +
        '<text x="200" y="175" text-anchor="middle" font-family="Georgia,serif" font-size="30" fill="#d4a650">&#128247;</text>' +
        '</svg>'
      );
    });
  });
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", function () {
  initBook();
  handleMissingImages();
});
