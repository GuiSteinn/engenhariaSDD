const KEY = 'tarefas-sdd-v1';
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const counter = document.querySelector('#counter');
const empty = document.querySelector('#empty');
let tasks;
try {
  const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
  tasks = Array.isArray(saved) ? saved.filter(t => t && typeof t.id === 'string' && typeof t.text === 'string' && typeof t.done === 'boolean') : [];
} catch { tasks = []; }
function save() { localStorage.setItem(KEY, JSON.stringify(tasks)); }
function render() {
  list.replaceChildren();
  for (const task of tasks) {
    const li = document.createElement('li');
    if (task.done) li.classList.add('done');
    const check = document.createElement('input');
    check.type = 'checkbox'; check.checked = task.done;
    check.setAttribute('aria-label', `Concluir ${task.text}`);
    check.addEventListener('change', () => { task.done = check.checked; save(); render(); });
    const label = document.createElement('span'); label.textContent = task.text;
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Excluir';
    remove.setAttribute('aria-label', `Excluir ${task.text}`);
    remove.addEventListener('click', () => { tasks = tasks.filter(t => t.id !== task.id); save(); render(); });
    li.append(check, label, remove); list.append(li);
  }
  empty.hidden = tasks.length > 0;
  counter.textContent = `${tasks.filter(t => t.done).length} de ${tasks.length} concluídas`;
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text || text.length > 120) return;
  tasks.push({ id: Array.from(crypto.getRandomValues(new Uint32Array(2))).join('-'), text, done: false });
  save(); render(); form.reset(); input.focus();
});
render();
