const toggle = document.getElementById('dark-mode-toggle');

function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  toggle.checked = theme === 'dark';
}

function toggleTheme(e) {
  const newTheme = e.target.checked ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
  applyTheme(newTheme);
}

toggle.addEventListener('change', toggleTheme);

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);