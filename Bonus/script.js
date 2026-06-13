const size = 9;
const minesCount = 10;

let board = [];
let gameOver = false;
let pivot;

function startGame() {
  board = [];
  gameOver = false;

  document.getElementById("status").textContent = "Гра почалась!";

  createBoard();
  placeMines();
  countNumbers();
  renderBoard();
  updateWebDataRocks();
}

function createBoard() {
  for (let row = 0; row < size; row++) {
    board[row] = [];

    for (let col = 0; col < size; col++) {
      board[row][col] = {
        row: row,
        col: col,
        mine: false,
        open: false,
        count: 0
      };
    }
  }
}

function placeMines() {
  let placed = 0;

  while (placed < minesCount) {
    let row = Math.floor(Math.random() * size);
    let col = Math.floor(Math.random() * size);

    if (!board[row][col].mine) {
      board[row][col].mine = true;
      placed++;
    }
  }
}

function countNumbers() {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!board[row][col].mine) {
        board[row][col].count = countNeighborMines(row, col);
      }
    }
  }
}

function countNeighborMines(row, col) {
  let count = 0;

  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < size && c >= 0 && c < size) {
        if (board[r][c].mine) {
          count++;
        }
      }
    }
  }

  return count;
}

function renderBoard() {
  const boardElement = document.getElementById("board");
  boardElement.innerHTML = "";

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = document.createElement("button");
      cell.className = "cell";

      cell.onclick = function () {
        openCell(row, col);
      };

      if (board[row][col].open) {
        cell.classList.add("open");

        if (board[row][col].mine) {
          cell.textContent = "💣";
          cell.classList.add("mine");
        } else if (board[row][col].count > 0) {
          cell.textContent = board[row][col].count;
        }
      }

      boardElement.appendChild(cell);
    }
  }
}

function openCell(row, col) {
  if (gameOver || board[row][col].open) {
    return;
  }

  board[row][col].open = true;

  if (board[row][col].mine) {
    gameOver = true;
    document.getElementById("status").textContent = "Ти програла!";
    openAllMines();
  } else {
    document.getElementById("status").textContent = "Продовжуй гру!";
    checkWin();
  }

  renderBoard();
  updateWebDataRocks();
}

function openAllMines() {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col].mine) {
        board[row][col].open = true;
      }
    }
  }
}

function checkWin() {
  let opened = 0;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col].open) {
        opened++;
      }
    }
  }

  if (opened === size * size - minesCount) {
    gameOver = true;
    document.getElementById("status").textContent = "Ти виграла!";
  }
}

function getTableData() {
  let data = [];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      data.push({
        Рядок: row + 1,
        Стовпець: col + 1,
        Є_міна: board[row][col].mine ? "Так" : "Ні",
        Відкрита: board[row][col].open ? "Так" : "Ні",
        Кількість_мін_поруч: board[row][col].count,
        Значення: board[row][col].mine ? "Міна" : board[row][col].count
      });
    }
  }

  return data;
}

function updateWebDataRocks() {
  const data = getTableData();

   if (!pivot) {
    pivot = new WebDataRocks({
      container: "#wdr-component",
      toolbar: true,
      report: {
        dataSource: {
          data: data
        },
        options: {
          grid: {
            type: "flat"
          }
        }
      }
    });
  } else {
    pivot.updateData({
      data: data
    });
  }
} 

startGame();