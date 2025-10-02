// DOM references
const listSection = document.querySelector(".list");
const addItemForm = document.getElementById("addItemForm");
const addItemFormSection = document.querySelector(".add-item-form");

// fct to update progress
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

//  Fetch and render items
async function fetchAndRenderItems() {
  try {
    const res = await fetch("http://localhost:8080/items");
    if (!res.ok) throw new Error("Failed to fetch items");
    const items = await res.json();

    // Clear current list
    listSection.innerHTML = "";

    if (items.length === 0) {
      listSection.innerHTML = "<p>No items found.</p>";
      updateProgressBar(); // even when is no item
      return;
    }

    // Create and append item elements
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
          <button class="done-icon data-id="${id}">✅ Done</button>
          <button class="delete-btn" data-id="${id}">🗑️ Delete</button>
        </div>
      `;

      listSection.appendChild(itemEl);
    });

    // update the progress after render
    updateProgressBar();
  } catch (error) {
    console.error("Error fetching items:", error);
    listSection.innerHTML = "<p>Error loading items. Try again later.</p>";
  }
}

//  Handle form submission
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
    const res = await fetch("http://localhost:8080/items", {
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
    await fetchAndRenderItems(); // progress updates auto
  } catch (error) {
    console.error("Error adding item:", error);
    alert("Failed to add item. Please try again.");
  }
});

fetchAndRenderItems();

// Events on list (mark as done, delete)
listSection.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  // 🗑️ DELETE
  if (e.target.classList.contains("delete-btn")) {
    const confirmDelete = confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/items/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");
      await fetchAndRenderItems(); // progress
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Could not be deleted. Please try again.");
    }
  }

  // ✅ MARK AS DONE
  if (e.target.classList.contains("done-icon")) {
    try {
      // 1. Preluăm obiectul complet
      const getRes = await fetch(`http://localhost:8080/items/${id}`);
      if (!getRes.ok) throw new Error("Failed to fetch item");
      const item = await getRes.json();

      // 2. Modificăm statusul
      const updatedItem = { ...item, status: "done" };

      // 3. Trimitem update complet cu PUT
      const putRes = await fetch(`http://localhost:8080/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });

      if (!putRes.ok) throw new Error("Update failed");
      await fetchAndRenderItems(); // progress
    } catch (error) {
      console.error("Error marking as done:", error);
      alert("Couldn't update status to 'done'.");
    }
  }
});

//DONE BTN
//document.querySelector(".list").addEventListener("click", (e) => {
//if (e.target.classList.contains("done-icon")) {
// const article = e.target.closest(".bucket-item");
// const statusEl = article.querySelector(".status");

///  if (statusEl && !statusEl.textContent.includes("done")) {
//  statusEl.textContent = "Status: done";
// }
// }
//});

// Toggle 'Add Item' form visibility
document
  .querySelector(".menu-bar button:nth-child(2)")
  .addEventListener("click", () => {
    addItemFormSection.classList.toggle("active");
  });

// Test backend connection
async function fetchBackendMessage() {
  try {
    const res = await fetch("http://localhost:8080");
    const data = await res.json();
    console.log(data.message);
  } catch (error) {
    console.error("Error fetching from backend:", error);
  }
}

fetchBackendMessage();
