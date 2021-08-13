const dateText = document.getElementById('footer-date')

function updateDate() {
  const currentYear = new Date().getFullYear()
  dateText.textContent = currentYear
}

updateDate()