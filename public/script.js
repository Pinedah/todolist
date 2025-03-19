document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    console.log("Token almacenado:", token); // 🛠 Verifica si el token existe

    if (!token) return;

    try {
        const res = await fetch("/tasks", {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Respuesta del servidor:", res); // 🛠 Verifica si hay errores

        if (!res.ok) {
            console.error("Error al obtener tareas:", await res.text());
            return;
        }

        const tasks = await res.json();
        console.log("Tareas recibidas:", tasks); // 🛠 Verifica si recibe las tareas correctamente

        const table = document.getElementById("taskTable");
        tasks.forEach(task => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${task.description}</td><td>${task.status}</td>`;
            table.appendChild(row);
        });
    } catch (error) {
        console.error("Error en la petición:", error);
    }
});
