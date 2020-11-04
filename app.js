const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

const apiURL = "https://api.lyrics.ovh";

//Show song and artist
function showData(data) {
  result.innerHTML = `
    <ul class="songs">
     ${data.data
       .map(
         (song) => `<li>
     <span><strong>${song.artist.name}</strong> - ${song.title}</span>
     <button class="btn btn-outline-info" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
     </li>`
       )
       .join("")}
    </ul>
    `;

  if (data.prev || data.next) {
    more.innerHTML = `
        ${
          data.prev
            ? `<button class="btn btn-outline-success"
            onclick="getMoreSongs('${data.prev}')">Prev</button>`
            : ""
        }
    ${
      data.next
        ? `<button class="btn btn-outline-success"
            onclick="getMoreSongs('${data.next}')
            ">Next</button>`
        : ""
    }
        `;
  } else {
    more.innerHTML = "";
  }
}

//get prev and Next Songs
async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
}

// Search by song or artist
async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();
  //   console.log(data);
  showData(data);
}

//get lyrics for song
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  const lyrics = await data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
  console.log(lyrics);
  if (lyrics !== "") {
    result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
  <span>${lyrics}</span>`;
  } else {
    result.innerHTML = `<h4>Please refresh page and try again</h4>
        <h6>Or lyrics not available</h6>`;
  }
  more.innerHTML = "";
}

//Event Listner
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert("Please Type Something in input button...");
  } else {
    searchSongs(searchTerm);
  }
});

//get lyrics by button click

result.addEventListener("click", (e) => {
  const clickedEl = e.target;
  //   console.log("Abs");
  if (clickedEl.tagName === "BUTTON") {
    const artist = clickedEl.getAttribute("data-artist");
    const songTitle = clickedEl.getAttribute("data-songtitle");
    // console.log("abs");
    getLyrics(artist, songTitle);
  }
});
