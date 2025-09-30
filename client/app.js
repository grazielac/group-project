// Select DOM elements
const addItemBtn = document.querySelector(".menu-bar button:nth-child(2)"); // "Add Item" button
const addItemFormSection = document.querySelector(".add-item-form");

// Listen for clicks on "Add Item" button to toggle form visibility
addItemBtn.addEventListener("click", () => {
  // Toggle 'active' class which controls display: none/block in CSS
  addItemFormSection.classList.toggle("active");
});

// Optional: you can add form submit handler here to process adding new items
const addItemForm = document.getElementById("addItemForm");
addItemForm.addEventListener("submit", (event) => {
  event.preventDefault(); // prevent default page reload on form submit

  // Grab input values
  const title = addItemForm.title.value.trim();
  const category = addItemForm.category.value;
  const link = addItemForm.link.value.trim();

  // TODO: Add code to send this data to backend or add to the list dynamically

  // For now, just log to console
  console.log({ title, category, link });

  // Reset form and hide it again
  addItemForm.reset();
  addItemFormSection.classList.remove("active");
});
