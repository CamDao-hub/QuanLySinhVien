document.addEventListener("DOMContentLoaded", () => {
    loadStudents();

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("keyup", function (event) {
            if (event.key === "Enter") {
                searchStudents();
            }
        });
    }
});


// ======================================================
// BIẾN LƯU DANH SÁCH SINH VIÊN
// ======================================================

let allStudents = [];


// ======================================================
// LOAD DANH SÁCH SINH VIÊN
// ======================================================

async function loadStudents() {

    const tbody = document.getElementById("studentTableBody");

    try {

        const response = await fetch(
            "http://localhost:8081/api/students"
        );

        if (!response.ok) {
            throw new Error("Không thể tải danh sách sinh viên");
        }

        const students = await response.json();

        allStudents = students;

        renderStudents(students);

    } catch (error) {

        console.error("Lỗi:", error);

        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger py-4">
                    Không thể kết nối đến máy chủ!
                </td>
            </tr>
        `;
    }
}


// ======================================================
// HIỂN THỊ DANH SÁCH SINH VIÊN
// ======================================================

function renderStudents(students) {

    const tbody = document.getElementById("studentTableBody");

    tbody.innerHTML = "";


    if (!students || students.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="text-center text-muted py-4"
                >
                    Chưa có dữ liệu sinh viên.
                </td>
            </tr>
        `;

        return;
    }


    students.forEach((student, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>
                ${index + 1}
            </td>

            <td>
                ${student.studentCode || ""}
            </td>

            <td>
                ${student.fullName || ""}
            </td>

            <td>
                ${student.email || ""}
            </td>

            <td>
                ${student.phone || ""}
            </td>

            <td>
                ${student.className || ""}
            </td>

            <td class="text-center">

                <!-- SỬA -->

                <a
                    href="index.html?page=form&id=${encodeURIComponent(student.id)}&mode=edit"
                    class="btn btn-warning btn-sm me-1"
                >
                    <i class="bi bi-pencil"></i>
                    Sửa
                </a>


                <!-- XÓA -->

                <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    onclick="deleteStudent('${student.id}')"
                >
                    <i class="bi bi-trash"></i>
                    Xóa
                </button>

            </td>

        `;

        tbody.appendChild(row);

    });
}


// ======================================================
// TÌM KIẾM SINH VIÊN
// ======================================================

function searchStudents() {

    const input = document.getElementById("searchInput");

    if (!input) {
        return;
    }

    const keyword = input.value
        .trim()
        .toLowerCase();


    if (keyword === "") {

        renderStudents(allStudents);

        return;
    }


    const filteredStudents = allStudents.filter(student => {

        const studentCode =
            (student.studentCode || "").toLowerCase();

        const fullName =
            (student.fullName || "").toLowerCase();

        const email =
            (student.email || "").toLowerCase();

        const phone =
            (student.phone || "").toLowerCase();

        const className =
            (student.className || "").toLowerCase();


        return (
            studentCode.includes(keyword) ||
            fullName.includes(keyword) ||
            email.includes(keyword) ||
            phone.includes(keyword) ||
            className.includes(keyword)
        );

    });


    renderStudents(filteredStudents);
}


// ======================================================
// XÓA SINH VIÊN
// ======================================================

async function deleteStudent(id) {

    if (!confirm("Bạn có chắc chắn muốn xóa sinh viên này không?")) {
        return;
    }


    try {

        const response = await fetch(
            `http://localhost:8081/api/students/${id}`,
            {
                method: "DELETE"
            }
        );


        if (response.ok) {

            alert("Xóa sinh viên thành công!");

            loadStudents();

        } else {

            alert("Xóa thất bại! Vui lòng thử lại.");

        }

    } catch (error) {

        console.error("Lỗi khi xóa:", error);

        alert("Lỗi kết nối máy chủ!");

    }
}