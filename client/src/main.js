// Fetch message from Express backend to test connection
async function fetchBackendMessage() {
  try {
    const res = await fetch("http://localhost:3000/api/hello"); // Make GET request to backend
    const data = await res.json(); // Parse JSON response
    console.log(data.message); // Log message from backend
  } catch (error) {
    console.error("Error fetching message from backend:", error);
  }
}

// Call the function on page load
fetchBackendMessage();

// UI INTERACTION - ADDING NEW BUCKET ITEM

// Select the "Add Item" button from the nav bar
const addItemBtn = document.querySelector(".menu-bar button:nth-child(2)");

// Select the Add Item form section (initially hidden)
const addItemFormSection = document.querySelector(".add-item-form");

// Toggle form visibility when "Add Item" button is clicked
addItemBtn.addEventListener("click", () => {
  addItemFormSection.classList.toggle("active"); // adds/removes 'active' class for display control
});

// Select the actual <form> element
const addItemForm = document.getElementById("addItemForm");

// Handle form submission
addItemForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent page reload on form submit

  // Safely select and extract input values using querySelector
  const title = addItemForm.querySelector('input[name="title"]').value.trim();
  const category = addItemForm.querySelector('select[name="category"]').value;
  const link = addItemForm.querySelector('input[name="link"]').value.trim();

  // Log the input values (can be replaced  with sending data to the backend later)
  console.log({ title, category, link });

  // Clear the form inputs
  addItemForm.reset();

  // Hide the form again
  addItemFormSection.classList.remove("active");
});
