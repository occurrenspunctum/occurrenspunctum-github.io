function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param)?.toLowerCase() || "";
}

function matchArticle(article, queryWords) {
  const content = (article.title + " " + article.tags.join(" ")).toLowerCase();
  return queryWords.every(word => content.includes(word));
}

async function loadSearchResults() {
  const query = getQueryParam("q");
  const featuredGrid = document.querySelector(".imageless-grid");

  if (!query) {
    featuredGrid.innerHTML = "<p>No search term provided.</p>";
    return;
  }

  try {
    const response = await fetch("article-data.json");
    const articles = await response.json();

    const queryWords = query.split(/\s+/).filter(Boolean);
    const filtered = articles.filter(article => matchArticle(article, queryWords));

    featuredGrid.innerHTML = "";

    if (filtered.length === 0) {
      featuredGrid.innerHTML = `<p>No results found for "<strong>${query}</strong>".</p>`;
      return;
    }

    filtered.forEach(article => {
      const el = document.createElement("article");
      el.innerHTML = `
        <h2><a href="${article.link}">${article.title}</a></h2>
        <h3><span>${article.journalist}</span> &nbsp;|&nbsp; <span>${article.date}</span> &nbsp;|&nbsp; ${article.type}</h3>
        <p maxLength = "100">${article.summary}</p>
        `;
      featuredGrid.appendChild(el);
    });
  } catch (err) {
    featuredGrid.innerHTML = "<p>Error loading results.</p>";
    console.error("Search error:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadSearchResults);
