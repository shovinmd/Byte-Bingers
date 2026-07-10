// Handle Signup form submission
document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('http://localhost:5000/api/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
  
    const result = await response.json();
    alert(result.message);
  });
  
  // Handle Login form submission
  document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
  
    const result = await response.json();
    alert(result.message);
  });
  
  // Fetch restaurants and display on restaurant-list page
  window.onload = async () => {
    if (document.getElementById('restaurant-list')) {
      const response = await fetch('http://localhost:5000/api/restaurants');
      const restaurants = await response.json();
  
      const restaurantListElement = document.getElementById('restaurant-list');
      restaurants.forEach(restaurant => {
        const restaurantItem = document.createElement('div');
        restaurantItem.classList.add('restaurant');
        restaurantItem.innerHTML = `
          <h3>${restaurant.name}</h3>
          <p>${restaurant.location}</p>
          <a href="booking-form.html?restaurant=${restaurant._id}">Book Now</a>
        `;
        restaurantListElement.appendChild(restaurantItem);
      });
    }
  };
  