async function loadMessage() {
  const res = await fetch("http://localhost:3000/api/hello");
  const data = await res.json();
  console.log(data.message); // should log: Hello from Express backend!
}

loadMessage();
