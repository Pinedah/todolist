document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/tasks", { headers: { Authorization: `Bearer ${token}` } });
    const tasks = await res.json();
    
    const table = document.getElementById("taskTable");
    tasks.forEach(task => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${task.description}</td><td>${task.status}</td>`;
        table.appendChild(row);
    });
});
