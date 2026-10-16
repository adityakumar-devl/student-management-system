
let editId = null;

document.getElementById("studentForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const student = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        course: document.getElementById("course").value,
        age: document.getElementById("age").value
    };

    let url = "/students";
    let method = "POST";

    if (editId !== null) {
        url = `/students/${editId}`;
        method = "PUT";
    }

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Operation failed");
        }
        return response.json();
    })
    .then(data => {

        if (editId !== null) {
            alert("Student updated successfully!");
            editId = null;
        } else {
            alert("Student added successfully!");
        }

        document.getElementById("studentForm").reset();

        loadStudents();
    })
    .catch(error => {
        console.error(error);
        alert("Something went wrong!");
    });

});

function loadStudents() {

    fetch("/students")
        .then(response => response.json())
        .then(students => {

            const table = document.getElementById("studentTable");

            table.innerHTML = "";

            students.forEach(student => {

                const row = `
                    <tr>
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                        <td>${student.course}</td>
                        <td>${student.age}</td>
						
						<td>
						    <button onclick="editStudent(${student.id})">Edit</button>
						    <button onclick="deleteStudent(${student.id})">Delete</button>
						</td>
                    </tr>
                `;

                table.innerHTML += row;
            });
        })
        .catch(error => {
            console.error(error);
        });
}

loadStudents();

function editStudent(id) {

    editId = id;

    fetch(`/students`)
        .then(response => response.json())
        .then(students => {

            const student = students.find(s => s.id === id);

            document.getElementById("name").value = student.name;
            document.getElementById("email").value = student.email;
            document.getElementById("course").value = student.course;
            document.getElementById("age").value = student.age;
        });
}

function deleteStudent(id) {

    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    fetch(`/students/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Delete failed");
        }

        alert("Student deleted successfully!");
        loadStudents();
    })
    .catch(error => {
        console.error(error);
        alert("Something went wrong!");
    });
}