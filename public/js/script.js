const list = document.querySelector(".list-group");

list.addEventListener("click", async (event) => {
  const target = event.target;
  const id = parseInt(target.parentElement.dataset.id);

  if (target.classList.contains("toggle-btn")) {
    const completedSpan = target.parentElement.querySelector("span.user-select-none");
    try {
      const response = await axios.post("/toggle-task", { id });
      if (response.data !== true) {
        alert(response.data.error);
        return;
      }
      if (target.classList.contains("btn-success")) {
        target.classList.replace("btn-success", "btn-secondary");
        completedSpan.classList.replace("bg-secondary", "bg-success");
        completedSpan.textContent = "Completed";
        return;
      }

      target.classList.replace("btn-secondary", "btn-success");
      completedSpan.classList.replace("bg-success", "bg-secondary");
      completedSpan.textContent = "In progress";
    } catch (err) {
      alert(err.response.data.error);
    }
  }

  if (target.classList.contains("edit-btn")) {
    const title = target.parentElement.querySelector("label").textContent;
    const answer = prompt("Please enter new title", title);

    if (!answer || answer.length < 3) {
      alert("Please enter title with at least 3 characters");
      return;
    }

    try {
      const response = await axios.post("/edit-task", { id, title: answer });
      if (response.data !== true) {
        alert(err.response.data.error);
      }
      if (response.data === true) {
        target.parentElement.querySelector("label").textContent = answer;
      }
    } catch (err) {
      alert(err.response.data.error);
    }
  }

  if (target.classList.contains("delete-btn")) {
    const answer = confirm("Are You Sure?");
    if (!answer) {
      return;
    }
    try {
      const response = await axios.post("/delete-task", { id });
      if (response.data === true) {
        target.parentElement.remove();
        if(!document.querySelectorAll("li").length){
          const ul  = document.querySelector('ul');
          ul.outerHTML = `<h2 class="text-center">There is not any task</h2>`
        }
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      alert(err.response.data.error);
    }
  }
});
