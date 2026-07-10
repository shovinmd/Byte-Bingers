document.getElementById("bookingForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const guests = document.getElementById("guests").value;
  
    // Log the values to ensure they are correct
    console.log('Booking details:', { name, email, date, time, guests });
  
    // Send the booking data to the backend using fetch
    fetch('https://byte-bingers-k5ns.vercel.app/api/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, date, time, guests }),
    })
    .then(response => response.json())
    .then(data => {
      alert(data.message);  // Show confirmation message
      document.getElementById("bookingForm").reset(); // Reset form fields
    })
    .catch(error => {
      console.error('Error:', error);
      alert('There was an error with your booking.');
    });
  });
  