function getUsers() {
    fetch('/api/users')
        .then(response => response.json())
        .then(data => {
            // Handle data
            console.log(data);

            // Get table body
            var userListBody = document.querySelector('#user-list tbody');
            userListBody.innerHTML = ''; // Clear previous data

            // Loop through users and populate table rows
            data.forEach(user => {
                var row = document.createElement('tr');

                // Name
                var nameCell = document.createElement('td');
                nameCell.textContent = user.name;
                row.appendChild(nameCell);

                // Email
                var emailCell = document.createElement('td');
                emailCell.textContent = user.email;
                row.appendChild(emailCell);

                // Username
                var usernameCell = document.createElement('td');
                usernameCell.textContent = user.username;
                row.appendChild(usernameCell);

                // Actions
                var actionsCell = document.createElement('td');

                // Edit link
                var editLink = document.createElement('a');
                editLink.href = `/edit/${user.id}`;
	        //editLink.href = `edit.html?id=${user.id}`;
                editLink.textContent = 'Edit';
                editLink.className = 'btn btn-primary mr-2';
                actionsCell.appendChild(editLink);

                // Delete link
                var deleteLink = document.createElement('a');
                deleteLink.href = '#';
                deleteLink.textContent = 'Delete';
                deleteLink.className = 'btn btn-danger';
                deleteLink.addEventListener('click', function() {
                    deleteUser(user.id);
                });
                actionsCell.appendChild(deleteLink);

                row.appendChild(actionsCell);

                userListBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

function createUser() {
    var data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle success
        console.log(data);
    })
    .catch(error => {
        // Handle error
        console.error('Error:', error);
    });
}

function updateUser() {
    var userId = document.getElementById('user-id').value;
    var data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle success
        console.log(data);
        // Optionally, redirect to another page or show a success message
    })
    .catch(error => {
        // Handle error
        console.error('Error:', error);
    });
}



function deleteUser(userId) {
    console.log('Deleting user with ID:', userId);
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`/api/users/${userId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle success
            console.log('User deleted successfully:', data);
            // Reload the user list
            getUsers();
        })
        .catch(error => {
            // Handle error
            console.error('Error:', error);
        });
    }
}


function getItems() {
	    fetch('/api/items')
	        .then(response => response.json())
	        .then(data => {
			            console.log(data);

			            var itemListBody = document.querySelector('#item-list tbody');
			            itemListBody.innerHTML = '';

			            data.forEach(item => {
					                    var row = document.createElement('tr');

					                    var nameCell = document.createElement('td');
					                    nameCell.textContent = item.name;
					                    row.appendChild(nameCell);

					                    var priceCell = document.createElement('td');
					                    priceCell.textContent = item.price;
					                    row.appendChild(priceCell);

					                    var actionsCell = document.createElement('td');
					                    var editLink = document.createElement('a');
					                    editLink.href = `/edit-item/${item.id}`;
					                  //editLink.href = `edit-item.html?id=${item.id}`;
					    			editLink.textContent = 'Edit';
					                    editLink.className = 'btn btn-primary mr-2';
					                    actionsCell.appendChild(editLink);

					                    var deleteLink = document.createElement('a');
					                    deleteLink.href = '#';
					                    deleteLink.textContent = 'Delete';
					                    deleteLink.className = 'btn btn-danger';
					                    deleteLink.addEventListener('click', function() {
								                        deleteItem(item.id);
								                    });
					                    actionsCell.appendChild(deleteLink);

					                    row.appendChild(actionsCell);
					                    itemListBody.appendChild(row);
					                });
			        })
	        .catch(error => console.error('Error:', error));
}

function createItem() {
	    var data = {
		            name: document.getElementById('item-name').value,
		            price: document.getElementById('item-price').value
		        };

	    fetch('/api/items', {
		            method: 'POST',
		            headers: {
				                'Content-Type': 'application/json',
				            },
		            body: JSON.stringify(data),
		        })
	    .then(response => {
		            if (!response.ok) {
				                throw new Error('Network response was not ok');
				            }
		            return response.json();
		        })
	    .then(data => {
		            console.log('Item created successfully:', data);
		            getItems();  // Refresh the item list
		       })
		           .catch(error => {
		                   console.error('Error:', error);
		                       });
		                       }
		  
function deleteItem(itemId) {
	    console.log('Deleting item with ID:', itemId);
	    if (confirm('Are you sure you want to delete this item?')) {
		            fetch(`/api/items/${itemId}`, {
				                method: 'DELETE',
				            })
		            .then(response => {
				                if (!response.ok) {
							                throw new Error('Network response was not ok');
							            }
				                return response.json();
				            })
		            .then(data => {
				                console.log('Item deleted successfully:', data);
				                getItems();  // Reload the item list
				             })
				                     .catch(error => {
				                                 console.error('Error:', error);
				                                         });
				                                             }
				                                             }

function updateItem() {
	    var itemId = document.getElementById('item-id').value;
	    var data = {
	            name: document.getElementById('item-name').value,
	            price: parseInt(document.getElementById('item-price').value, 10)  // Convert string to integer
		         };
	    
	             fetch(`/api/items/${itemId}`, {
	                     method: 'PUT',
                             headers: {
                                       'Content-Type': 'application/json',
                                                 },
                                                   body: JSON.stringify(data),
		                                                             })
                        .then(response => {
			        if (!response.ok) {
				            throw new Error('Network response was not ok');
				        }
			        return response.json();
			    })
    			.then(data => {
             			//Handle success
	        	     console.log(data);
	                     // Optionally, redirect to another page or show a success message
	                         })
	                .catch(error => {
                                  // Handle error
                                            console.error('Error:', error);
                                                 });
                                               }
