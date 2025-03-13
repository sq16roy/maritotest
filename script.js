const sheetURL =
	"https://docs.google.com/spreadsheets/d/1u4vghBAiKFnic3CkMJQvmyxuOb-6-P4GuyVfiqnaaiE/gviz/tq?tqx=out:csv";
let data = [];

// Cargar datos de Google Sheets
async function fetchData() {
	try {
		const response = await fetch(sheetURL);
		const text = await response.text();

		// Convertir CSV en array
		const rows = text.split("\n").map((row) => row.split(","));
		const headers = rows[0].map((h) => h.trim());

		// Asignar los datos en formato JSON
		data = rows.slice(1).map((row) => {
			let obj = {};
			row.forEach((col, i) => (obj[headers[i]] = col.trim()));
			return obj;
		});
		
		// Limpiar las comillas adicionales en los datos
		data = data.map(item => {
			const cleanItem = {};
			for (const key in item) {
				// Eliminar comillas de las claves
				const cleanKey = key.replace(/"/g, '');
				// Eliminar comillas de los valores
				const cleanValue = item[key].replace(/"/g, '');
				cleanItem[cleanKey] = cleanValue;
			}
			return cleanItem;
		});
		
		console.log("Datos cargados (limpios):", data);
	} catch (error) {
		console.error("Error al cargar los datos:", error);
	}
}

// Mostrar modal
function showModal(title, body) {
	document.getElementById("modalTitle").textContent = title;
	document.getElementById("modalBody").textContent = body;
	document.getElementById("resultModal").style.display = "flex";
}

// Cerrar modal al hacer clic en la "X"
document.querySelector(".close").addEventListener("click", function () {
	document.getElementById("resultModal").style.display = "none";
});

// Cerrar modal al hacer clic fuera del contenido
window.onclick = function (event) {
	let modal = document.getElementById("resultModal");
	if (event.target === modal) {
		modal.style.display = "none";
	}
};

// Función de búsqueda
function searchPoints() {
	const searchText = document
		.getElementById("searchInput")
		.value.toLowerCase();
	if (searchText === "") return;

	// Verificar si los datos están cargados
	if (!data || data.length === 0) {
		showModal("Error", "Los datos aún no se han cargado. Por favor, intenta de nuevo en unos segundos.");
		return;
	}

	const result = data.find((item) => {
		// Verificar que item.Nombre existe antes de usar toLowerCase
		return item && item.Nombre && item.Nombre.toLowerCase().includes(searchText);
	});

	if (result) {
		showModal(
			"Resultados Encontrados",
			`📛 Nombre: ${result.Nombre}\n📱 Teléfono: ${result.Telefono}\n📧 Correo: ${result.Correo}\n🏆 Puntos: ${result.Puntos}`
		);
	} else {
		showModal("Sin Resultados", "No existen resultados para esa búsqueda.");
	}
}

// Asociar la búsqueda al botón
document.getElementById("searchButton").addEventListener("click", searchPoints);

// También permitir búsqueda al presionar Enter en el campo de búsqueda
document.getElementById("searchInput").addEventListener("keypress", function(event) {
	if (event.key === "Enter") {
		searchPoints();
	}
});

// Cargar datos al iniciar
fetchData();
