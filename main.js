document.addEventListener("DOMContentLoaded", function () {
  (function () {
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

    function updateBooksDisplay(books) {
      const { incompleteBookshelf, completeBookshelf } = elements;
      incompleteBookshelf.innerHTML = "";
      completeBookshelf.innerHTML = "";

      books.forEach((book) => {
        const bookItem = document.createElement("article");
        bookItem.classList.add("book_item");
        const h3 = document.createElement("h3");
        h3.innerText = book.title;
        const authorP = document.createElement("p");
        authorP.innerText = `Penulis: ${book.author}`;
        const yearP = document.createElement("p");
        yearP.innerText = `Tahun: ${book.year}`;
        const actionDiv = document.createElement("div");
        actionDiv.classList.add("action");

        // Definisikan deleteButton di dalam loop
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Hapus buku";
        deleteButton.classList.add("red");
        deleteButton.setAttribute("data-book-id", book.id);

        deleteButton.addEventListener("click", function () {
          const bookId = this.getAttribute("data-book-id");
          const confirmDelete = confirm(
            "Apakah Anda yakin ingin menghapus buku ini?"
          );
          if (confirmDelete) {
            deleteBook(bookId);
          }
        });

        const unfinishedButton = document.createElement("button");
        unfinishedButton.innerText = "Belum selesai di Baca";
        unfinishedButton.classList.add("green");
        unfinishedButton.setAttribute("data-book-id", book.id);
        unfinishedButton.addEventListener("click", function () {
          toggleCompleteStatus(book.id);
        });
        const finishedButton = document.createElement("button");
        finishedButton.innerText = "Selesai dibaca";
        finishedButton.classList.add("green");
        finishedButton.setAttribute("data-book-id", book.id);
        finishedButton.addEventListener("click", function () {
          toggleCompleteStatus(book.id);
        });

        if (book.isComplete) {
          actionDiv.appendChild(unfinishedButton);
          completeBookshelf.appendChild(bookItem);
        } else {
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

    function searchBooks(query) {
      const books = getAllBooks();
      const matchingBooks = books.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      );
      updateBooksDisplay(matchingBooks);
    }

    function deleteBook(bookId) {
      localStorage.removeItem(bookId);
      updateBooksDisplay(getAllBooks());
    }

    function toggleCompleteStatus(bookId) {
      const bookJSON = localStorage.getItem(bookId);
      const book = JSON.parse(bookJSON);

      book.isComplete = !book.isComplete;

      localStorage.setItem(bookId, JSON.stringify(book));

      updateBooksDisplay(getAllBooks());
    }

    const elements = {
      form: document.getElementById("inputBook"),
      titleInput: document.getElementById("inputBookTitle"),
      authorInput: document.getElementById("inputBookAuthor"),
      yearInput: document.getElementById("inputBookYear"),
      isCompleteInput: document.getElementById("inputBookIsComplete"),
      searchForm: document.getElementById("searchBook"),
      searchInput: document.getElementById("searchBookTitle"),
      incompleteBookshelf: document.getElementById("incompleteBookshelfList"),
      completeBookshelf: document.getElementById("completeBookshelfList"),
    };

    updateBooksDisplay(getAllBooks());

    elements.searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const query = elements.searchInput.value;
      searchBooks(query);
    });

    const form = elements.form;
    const titleInput = elements.titleInput;
    const authorInput = elements.authorInput;
    const yearInput = elements.yearInput;
    const isCompleteInput = elements.isCompleteInput;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const title = titleInput.value;
      const author = authorInput.value;
      const year = yearInput.value;
      const isComplete = isCompleteInput.checked;

      const timestamp = Date.now();

      const book = {
        id: `book-${timestamp}`,
        title: title,
        author: author,
        year: year,
        isComplete: isComplete,
      };

      const bookJSON = JSON.stringify(book);

      localStorage.setItem(`book-${timestamp}`, bookJSON);

      titleInput.value = "";
      authorInput.value = "";
      yearInput.value = "";
      isCompleteInput.checked = false;

      updateBooksDisplay(getAllBooks());
    });
  })();
});
