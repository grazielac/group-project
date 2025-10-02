// DOM references
const listSection = document.querySelector(".list");
const addItemForm = document.getElementById("addItemForm");
const addItemFormSection = document.querySelector(".add-item-form");

// ✅ Original API endpoint
const API_URL = "https://group-project-g0cg.onrender.com/items";

// Variabilă globală pentru toate itemele preluate de la backend
let allItems = [];

// Funcție pentru actualizarea barei de progres
function updateProgressBar() {
  const items = document.querySelectorAll(".bucket-item");
  const total = items.length;
  if (total === 0) return;

  const done = [...items].filter((item) => {
    const statusText = item.textContent.toLowerCase();
    return statusText.includes("status: done");
  }).length;

  const progressValue = Math.round((done / total) * 100);

  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  if (progressBar && progressText) {
    progressBar.value = progressValue;
    progressText.textContent = `${progressValue}% completed`;
  }
}

// Funcție separată pentru afișarea itemelor în DOM
function renderItems(items) {
  listSection.innerHTML = "";

  if (items.length === 0) {
    listSection.innerHTML = "<p>No items found.</p>";
    updateProgressBar(); // Actualizează progresul chiar dacă nu sunt iteme
    return;
  }

  items.forEach(({ id, title, category, link, status }) => {
    const itemEl = document.createElement("div");
    itemEl.classList.add("bucket-item");
    if (status === "done") itemEl.classList.add("done");

    itemEl.innerHTML = `
      <h3>${title}</h3>
      <p>Category: ${category}</p>
      ${
        link
          ? `<p><a href="${link}" target="_blank" rel="noopener noreferrer">Link</a></p>`
          : ""
      }
      <p>Status: ${status}</p>
      <div class="item-buttons">
        <button class="done-icon" data-id="${id}">✅ Done</button>
        <button class="delete-btn" data-id="${id}">🗑️ Delete</button>
      </div>
    `;

    listSection.appendChild(itemEl);
  });

  updateProgressBar();
}

// Funcție de fetch și salvare a itemelor, apoi apelare render
async function fetchAndRenderItems() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch items");
    const items = await res.json();

    allItems = items; // Salvează toate itemele în variabila globală
    renderItems(items); // Afișează toate itemele
  } catch (error) {
    console.error("Error fetching items:", error);
    listSection.innerHTML = "<p>Error loading items. Try again later.</p>";
  }
}

// Funcție pentru filtrarea itemelor după categorie și reafișarea lor
function filterItemsByCategory(category) {
  if (category === "all") {
    renderItems(allItems); // Afișează toate
  } else {
    const filtered = allItems.filter((item) => item.category === category);
    renderItems(filtered);
  }
}

// Setare event listener pe butoanele de filtrare (filter buttons)
const filterButtons = document.querySelectorAll(".filter-btn");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;

    // Schimbă clasa active pentru butoanele de filtrare
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Apelează filtrarea pe categorie
    filterItemsByCategory(category);
  });
});

// Butonul My List - scroll la lista curentă
const menuButtons = document.querySelectorAll(".menu-bar button");
const myListBtn = menuButtons[2];

myListBtn.addEventListener("click", () => {
  if (listSection) {
    listSection.scrollIntoView({ behavior: "smooth" });
  }
});

// Handle form submission pentru adăugarea unui item nou
addItemForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = addItemForm.querySelector('input[name="title"]').value.trim();
  const category = addItemForm.querySelector('select[name="category"]').value;
  const link = addItemForm.querySelector('input[name="link"]').value.trim();

  if (!title || !category) {
    alert("Please fill in the required fields");
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        category,
        link: link || null,
        status: "pending",
      }),
    });

    if (!res.ok) throw new Error("Failed to add item");

    const data = await res.json();
    console.log(data.message);

    addItemForm.reset();
    addItemFormSection.classList.remove("active");
    await fetchAndRenderItems(); // Actualizează lista și progress bar
  } catch (error) {
    console.error("Error adding item:", error);
    alert("Failed to add item. Please try again.");
  }
});

// Fetch inițial pentru a popula lista
fetchAndRenderItems();

// Event listener pe lista de iteme pentru delete și mark as done
listSection.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  // DELETE item
  if (e.target.classList.contains("delete-btn")) {
    const confirmDelete = confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");
      await fetchAndRenderItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Could not be deleted. Please try again.");
    }
  }

  // MARK AS DONE
  if (e.target.classList.contains("done-icon")) {
    try {
      const getRes = await fetch(`${API_URL}/${id}`);
      if (!getRes.ok) throw new Error("Failed to fetch item");
      const item = await getRes.json();

      const updatedItem = { ...item, status: "done" };

      const putRes = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });

      if (!putRes.ok) throw new Error("Update failed");
      await fetchAndRenderItems();
    } catch (error) {
      console.error("Error marking as done:", error);
      alert("Couldn't update status to 'done'.");
    }
  }
});

// Toggle 'Add Item' form visibility la click pe butonul din menubar
document
  .querySelector(".menu-bar button:nth-child(2)")
  .addEventListener("click", () => {
    addItemFormSection.classList.toggle("active");
  });

// Test backend connection
async function fetchBackendMessage() {
  try {
    const res = await fetch("https://group-project-g0cg.onrender.com");
    const data = await res.json();
    console.log(data.message);
  } catch (error) {
    console.error("Error fetching from backend:", error);
  }
}

fetchBackendMessage();
