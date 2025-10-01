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

    // Create and append item elements
    items.forEach(({ id, title, category, link, status }) => {
      const itemEl = document.createElement("div");
      itemEl.classList.add("bucket-item");
      itemEl.innerHTML = `
        <h3>${title}</h3>
        <p>Category: ${category}</p>
        ${
          link
            ? `<p><a href="${link}" target="_blank" rel="noopener noreferrer">Link</a></p>`
            : ""
        }
        <p>Status: ${status}</p>
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
