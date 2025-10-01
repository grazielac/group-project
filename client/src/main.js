// DOM references
const listSection = document.querySelector(".list");
const addItemForm = document.getElementById("addItemForm");
const addItemFormSection = document.querySelector(".add-item-form");

// Fetch and render items
async function fetchAndRenderItems() {
  try {
    const res = await fetch("http://localhost:3000/items");
    if (!res.ok) throw new Error("Failed to fetch items");
    const items = await res.json();

    // Clear current list
    listSection.innerHTML = "";

    if (items.length === 0) {
      listSection.innerHTML = "<p>No items found.</p>";
      return;
    }

    // TO DO REWORK ON DONE BTN// AZIIII /// TO DO// MUSAI // DE REPARART //

    // Create and append item elements
    items.forEach(({ id, title, category, link, status }) => {
      const itemEl = document.createElement("div");
      itemEl.classList.add("bucket-item");
      if (status === "done") itemEl.classList.add("done"); // if is marked as done

      // CHANGED TODAY 01.10.25 //
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
      <button class="mark-done-btn" data-id="${id}">✅ Done</button>
      <button class="delete-btn" data-id="${id}">🗑️ Delete</button>
    </div>
  `;

      listSection.appendChild(itemEl);
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    listSection.innerHTML = "<p>Error loading items. Try again later.</p>";
  }
}

// Handle form submission
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
    const res = await fetch("http://localhost:3000/items", {
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
    await fetchAndRenderItems();
  } catch (error) {
    console.error("Error adding item:", error);
    alert("Failed to add item. Please try again.");
  }
});

// Initial load
fetchAndRenderItems();

//CHANGED TODAY 01.10.25 //
// Event delegation for clicks on btns from items list
listSection.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (!id) return; // if doesn't exist data-id, ignore the click
  // 🗑️ DELETE
  if (e.target.classList.contains("delete-btn")) {
    const confirmDelete = confirm("Ești sigur că vrei să ștergi acest item?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3000/items/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");
      await fetchAndRenderItems(); // update list after delete
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Nu s-a putut șterge. Încearcă din nou.");
    }
  }

  // ✅ MARK AS DONE
  if (e.target.classList.contains("mark-done-btn")) {
    try {
      const res = await fetch(`http://localhost:3000/items/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "done" }),
      });

      if (!res.ok) throw new Error("Update failed");
      await fetchAndRenderItems(); // update list
    } catch (error) {
      console.error("Error marking as done:", error);
      alert("Cooldn't load as 'done'.");
    }
  }
});

// Toggle 'Add Item' form visibility
document
  .querySelector(".menu-bar button:nth-child(2)")
  .addEventListener("click", () => {
    addItemFormSection.classList.toggle("active");
  });

// Optional: Test backend connection
async function fetchBackendMessage() {
  try {
    const res = await fetch("http://localhost:3000");
    const data = await res.json();
    console.log(data.message);
  } catch (error) {
    console.error("Error fetching from backend:", error);
  }
}

fetchBackendMessage();
