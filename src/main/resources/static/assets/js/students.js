document.addEventListener("DOMContentLoaded", () => {
    // Tải danh sách sinh viên ban đầu
    loadStudents();

    // Bắt sự kiện khi người dùng gõ tìm kiếm và nhấn Enter
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                searchStudents();
            }
        });
    }

    // Bắt sự kiện click nút tìm kiếm nếu có
    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            searchStudents();
        });
    }
});

// 1. Tải danh sách sinh viên từ Backend (có hỗ trợ tìm kiếm theo từ khóa)
async function loadStudents(keyword = "") {
    const tbody = document.getElementById("studentTableBody");
    try {
        let url = "/api/students";
        if (keyword && keyword.trim() !== "") {
            url += `?keyword=${encodeURIComponent(keyword.trim())}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Lỗi máy chủ (${response.status})`);
        }

        const students = await response.json();
        renderStudents(students);
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger py-3">
                        Không thể tải dữ liệu từ server! Vui lòng thử lại sau.
                    </td>
                </tr>
            `;
        }
    }
}

// 2. Tìm kiếm sinh viên
function searchStudents() {
    const searchInput = document.getElementById("searchInput");
    const keyword = searchInput ? searchInput.value : "";
    loadStudents(keyword);
}

// 3. Đổ dữ liệu ra bảng HTML
function renderStudents(students) {
    const tbody = document.getElementById("studentTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (!students || students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-3">Không tìm thấy sinh viên nào.</td></tr>`;
        return;
    }

    students.forEach((student, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td class="fw-bold">${student.studentCode || ''}</td>
                <td>${student.fullName || ''}</td>
                <td>${student.email || ''}</td>
                <td>${student.phone || ''}</td>
                <td>${student.className || ''}</td>
                <td class="text-end">
                    <div class="table-actions d-flex justify-content-end gap-1">
                        <!-- Xem -->
                        <a
                            class="btn btn-info btn-sm text-white"
                            href="index.html?page=form&id=${encodeURIComponent(student.id)}&mode=view"
                            title="Xem"
                        >
                            <i class="bi bi-eye"></i>
                        </a>
                        
                        <!-- Sửa -->
                        <a
                            class="btn btn-warning btn-sm text-white"
                            href="index.html?page=form&id=${encodeURIComponent(student.id)}&mode=edit"
                            title="Sửa"
                        >
                            <i class="bi bi-pencil-square"></i>
                        </a>

                        <!-- Xóa -->
                        <button
                            class="btn btn-danger btn-sm"
                            onclick="deleteStudent('${student.id}')"
                            title="Xóa"
                        >
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// 4. Lưu Sinh Viên (Dành cho Trang Form khi Thêm mới hoặc Cập nhật)
async function saveStudent(studentData, id = null) {
    try {
        const isEdit = id && id.trim() !== "";
        const url = isEdit ? `/api/students/${id}` : "/api/students";
        const method = isEdit ? "PUT" : "POST";

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });

        if (response.ok) {
            alert(isEdit ? "Cập nhật sinh viên thành công!" : "Thêm mới sinh viên thành công!");
            window.location.href = "student.html"; // Quay về trang danh sách
        } else {
            alert("Lưu dữ liệu không thành công!");
        }
    } catch (error) {
        console.error("Lỗi khi lưu dữ liệu:", error);
        alert("Có lỗi kết nối tới máy chủ!");
    }
}

// 5. Hàm Xóa sinh viên
async function deleteStudent(id) {
    if (confirm("Bạn có chắc chắn muốn xóa sinh viên này không?")) {
        try {
            const response = await fetch(`/api/students/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                loadStudents(); // Tải lại bảng sau khi xóa thành công
            } else {
                alert("Xóa không thành công!");
            }
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            alert("Lỗi kết nối tới máy chủ!");
        }
    }
}