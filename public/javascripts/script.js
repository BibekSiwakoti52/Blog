function deleteRecord(postId) {
  fetch(`/admin/post/${postId}`, {
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
      console.error("Error deleting record:", error);
    });
}

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
