// UI INTERACTION - ADDING NEW BUCKET ITEM

// Select the "Add Item" button from the nav bar
const addItemBtn = document.querySelector(".menu-bar button:nth-child(2)");

// Select the Add Item form section (initially hidden)
const addItemFormSection = document.querySelector(".add-item-form");

// Toggle form visibility when "Add Item" button is clicked
addItemBtn.addEventListener("click", () => {
  // Toggle 'active' class to show/hide the form
  addItemFormSection.classList.toggle("active");

  // Scroll into view when form becomes visible
  if (addItemFormSection.classList.contains("active")) {
    addItemFormSection.scrollIntoView({ behavior: "smooth" });
  }
});

// Select the <form> element itself
const addItemForm = document.getElementById("addItemForm");

// Handle form submission
addItemForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent page reload

  // Get input values
  const title = addItemForm.querySelector('input[name="title"]').value.trim();
  const category = addItemForm.querySelector('select[name="category"]').value;
  const link = addItemForm.querySelector('input[name="link"]').value.trim();

  // Log values (you can later replace this with a function that saves data)
  console.log({ title, category, link });

  // Clear form fields
  addItemForm.reset();

  // Hide the form again
  addItemFormSection.classList.remove("active");
});

// BACKEND FETCH EXAMPLE
async function fetchBackendMessage() {
  try {
    const res = await fetch("http://localhost:3000");
    const data = await res.json();
    console.log(data.message); // should log: Hello from Express backend!
  } catch (error) {
    console.error("Error fetching from backend:", error);
  }
}

// Call the function to fetch backend message
fetchBackendMessage();
