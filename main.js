// Fungsi untuk mengambil semua data buku dari local storage
function getAllBooks() {
  const books = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("book-")) {
      const bookJSON = localStorage.getItem(key);
      const book = JSON.parse(bookJSON);
      books.push(book);
    }
  }
  return books;
}

// Fungsi untuk menampilkan buku pada elemen HTML yang sesuai
function displayBooks() {
  const incompleteBookshelf = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelf = document.getElementById("completeBookshelfList");

  // Bersihkan daftar buku sebelum menambahkan yang baru
  incompleteBookshelf.innerHTML = "";
  completeBookshelf.innerHTML = "";

  // Ambil semua data buku
  const books = getAllBooks();

  // Loop melalui semua buku dan tambahkan ke daftar yang sesuai
  books.forEach((book) => {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item"); // Tambahkan kelas "book_item" ke elemen <article>
    const h3 = document.createElement("h3");
    h3.innerText = book.title;
    const authorP = document.createElement("p");
    authorP.innerText = `Penulis: ${book.author}`;
    const yearP = document.createElement("p");
    yearP.innerText = `Tahun: ${book.year}`;
    const actionDiv = document.createElement("div");
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Hapus buku";
    deleteButton.classList.add("red");
    deleteButton.addEventListener("click", function () {
      deleteBook(book.id); // Panggil fungsi deleteBook dengan ID buku
    });

    // Cek nilai isComplete untuk menentukan di mana buku harus ditampilkan
    if (book.isComplete) {
      const unfinishedButton = document.createElement("button");
      unfinishedButton.innerText = "Belum selesai di Baca";
      unfinishedButton.classList.add("green");
      unfinishedButton.addEventListener("click", function () {
        toggleCompleteStatus(book.id); // Panggil fungsi toggleCompleteStatus dengan ID buku
      });

      actionDiv.appendChild(unfinishedButton);
      completeBookshelf.appendChild(bookItem);
    } else {
      const finishedButton = document.createElement("button");
      finishedButton.innerText = "Selesai dibaca";
      finishedButton.classList.add("green");
      finishedButton.addEventListener("click", function () {
        toggleCompleteStatus(book.id); // Panggil fungsi toggleCompleteStatus dengan ID buku
      });

      actionDiv.appendChild(finishedButton);
      incompleteBookshelf.appendChild(bookItem);
    }

    actionDiv.appendChild(deleteButton);
    bookItem.appendChild(h3);
    bookItem.appendChild(authorP);
    bookItem.appendChild(yearP);
    bookItem.appendChild(actionDiv);
  });
}

const searchForm = document.getElementById("searchBook");
const searchInput = document.getElementById("searchBookTitle");

searchForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Mencegah pengiriman formulir yang standar
  const query = searchInput.value;
  searchBooks(query); // Panggil fungsi searchBooks dengan query pencarian
});

// Fungsi untuk menghapus buku dari local storage dan daftar tampilan HTML
function deleteBook(bookId) {
  localStorage.removeItem(bookId); // Hapus buku dari local storage
  displayBooks(); // Perbarui daftar tampilan HTML
}

// Fungsi untuk mengubah status buku (isComplete) di local storage dan daftar tampilan HTML
function toggleCompleteStatus(bookId) {
  const bookJSON = localStorage.getItem(bookId); // Ambil data buku dari local storage
  const book = JSON.parse(bookJSON);

  // Ubah status isComplete
  book.isComplete = !book.isComplete;

  // Simpan kembali data buku yang telah diubah
  localStorage.setItem(bookId, JSON.stringify(book));

  displayBooks(); // Perbarui daftar tampilan HTML
}

// Panggil fungsi untuk menampilkan buku saat halaman dimuat
displayBooks();

// Fungsi penanganan acara saat formulir dikirim
const form = document.getElementById("inputBook");
const titleInput = document.getElementById("inputBookTitle");
const authorInput = document.getElementById("inputBookAuthor");
const yearInput = document.getElementById("inputBookYear");
const isCompleteInput = document.getElementById("inputBookIsComplete");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // Mencegah pengiriman formulir yang standar

  // Ambil nilai dari elemen-elemen input
  const title = titleInput.value;
  const author = authorInput.value;
  const year = yearInput.value;
  const isComplete = isCompleteInput.checked;

  // Membuat timestamp unik
  const timestamp = Date.now();

  // Buat objek buku dengan nilai unik
  const book = {
    id: `book-${timestamp}`, // Gunakan timestamp sebagai nilai unik
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  // Konversi objek buku menjadi JSON
  const bookJSON = JSON.stringify(book);

  // Simpan data JSON ke dalam local storage
  localStorage.setItem(`book-${timestamp}`, bookJSON); // Gunakan id sebagai kunci

  // Kosongkan formulir
  titleInput.value = "";
  authorInput.value = "";
  yearInput.value = "";
  isCompleteInput.checked = false;

  // Tampilkan buku yang baru ditambahkan tanpa perlu memuat ulang halaman
  displayBooks();
});
