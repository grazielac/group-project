async function fetchBackendMessag() {
  const res = await fetch("http://localhost:3000");
  const data = await res.json();
  console.log(data.message); // should log: Hello from Express backend!
}

loadMessage();
