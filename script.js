// --- Get Petfinder Access Token ---
async function getAccessToken() {
    const res = await fetch("https://api.petfinder.com/v2/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: "OWPI4yEvZeapm2mTgKGsuNxzkd0tobY1kRck67I798MEPRXUTW",         // Replace with real Petfinder ID
        client_secret: "K2bqN09pDEya1QSQ2Ll1bCH1scdx5U7LKub4XCRb"  // Replace with real Petfinder Secret
      }),
    });
    const data = await res.json();
    return data.access_token;
  }
  
  // --- Load Adoptable Pets on Browse Page ---
  async function loadPets() {
    const token = await getAccessToken();
    const res = await fetch("https://api.petfinder.com/v2/animals?type=dog&limit=6", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
  
    const petsContainer = document.getElementById("pets");
    if (!petsContainer) return;
  
    petsContainer.innerHTML = "";
  
    data.animals.forEach((pet) => {
      const div = document.createElement("div");
      div.className = "pet-card";
      div.innerHTML = `
        <h3>${pet.name}</h3>
        <p>Age: ${pet.age}</p>
        <img src="${pet.photos[0]?.small || 'https://placekitten.com/200/200'}" alt="${pet.name}" width="100%">
        <button onclick="addToFavorites('${pet.name}', '${pet.age}', '${pet.photos[0]?.small || ''}')">Add to Favorites</button>
      `;
      petsContainer.appendChild(div);
    });
  }
  
  // --- Save Pet to Supabase via API ---
  async function addToFavorites(name, age, photo) {
    try {
      const res = await fetch('/api/addFavorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'Unknown',
          age: age || 'Unknown',
          photo: photo || ''
        })
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Unknown error saving favorite');
      }
  
      alert(`${name} has been added to your favorites!`);
    } catch (error) {
      console.error('Error adding to favorites:', error.message);
      alert('Failed to save favorite. Please try again.');
    }
  }
  
  
  // --- Load Saved Favorites on favorites.html ---
  async function loadFavorites() {
    const container = document.getElementById("favorites");
    if (!container) return;
  
    try {
      const res = await fetch('/api/favorites');
      const pets = await res.json();
  
      if (pets.length === 0) {
        container.innerHTML = "<p>No favorites yet. Go to Browse and add some!</p>";
        return;
      }
  
      pets.forEach((pet) => {
        const div = document.createElement("div");
        div.className = "pet-card";
        div.innerHTML = `
          <h3>${pet.name}</h3>
          <p>Age: ${pet.age}</p>
          <img src="${pet.photo || 'https://placekitten.com/200/200'}" alt="${pet.name}" width="100%">
        `;
        container.appendChild(div);
      });
    } catch (err) {
      container.innerHTML = "<p>Error loading favorites.</p>";
    }
  }
  
  // --- Page Detection ---
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("pets")) loadPets();
    if (document.getElementById("favorites")) loadFavorites();
  });
  
