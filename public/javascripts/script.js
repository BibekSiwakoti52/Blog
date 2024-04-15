// Function to delete a post record
function deleteRecord(postId) {

  // Sending a DELETE request to the server to delete the post
fetch(`/post/${postId}`, {
    method: "DELETE", // HTTP method = DELETE
    headers: {
      "Content-Type": "application/json", // Specifying JSON content type
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Reloading the page after successful deletion
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error deleting record:", error);
    });
}

//function to delete user
function deleteUser(userId) {
  fetch(`/user/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
    });
}

//function to delete comment

function deleteComment(commentId) {
  fetch(`/post/comment/${commentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error deleting comment:", error);
    });
}
