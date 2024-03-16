const socket = io();

// Join a document room
socket.emit('join', 'document123'); // Replace 'document123' with the actual document ID

// Listen for updates from the server
socket.on('update', (data) => {
  // Handle document updates
  const documentDiv = document.getElementById('document');
  documentDiv.innerText = data.content; // Update document content
});

// Example: Send an edit to the server
const newData = { documentId: 'document123', content: 'New document content' };
socket.emit('edit', newData);

