async function getAccessToken() {
    const res = await fetch("https://api.petfinder.com/v2/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: "OWPI4yEvZeapm2mTgKGsuNxzkd0tobY1kRck67I798MEPRXUTW",
        client_secret: "K2bqN09pDEya1QSQ2Ll1bCH1scdx5U7LKub4XCRbT",
      }),
    });
    const data = await res.json();
    return data.access_token;
  }
  
  async function loadPets() {
    const token = await getAccessToken();
    const res = await fetch("https://api.petfinder.com/v2/animals?type=dog&limit=5", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
  
    const petsContainer = document.getElementById("pets");
    if (!petsContainer) return;
  
    data.animals.forEach((pet) => {
      const div = document.createElement("div");
      div.className = "pet-card";
      div.innerHTML = `
        <h3>${pet.name}</h3>
        <p>Age: ${pet.age}</p>
        <img src="${pet.photos[0]?.small || ''}" alt="${pet.name}" width="100%">
        <button onclick="addToFavorites('${pet.name}', '${pet.age}', '${pet.photos[0]?.small || ''}')">Add to Favorites</button>
      `;
      petsContainer.appendChild(div);
    });
  }
  
  async function addToFavorites(name, age, photo) {
    await fetch('/api/addFavorite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, age, photo })
    });
    alert(`${name} added to favorites!`);
  }
  
  document.addEventListener("DOMContentLoaded", loadPets);
  
