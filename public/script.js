const checkboxes = Array.from(document.querySelectorAll('.city-checkbox'));
const cityInput = document.getElementById('cityInput');
const getBtn = document.getElementById('getBtn');
const result = document.getElementById('result');
const errorBox = document.getElementById('error');

function clearSelections(except) {
  checkboxes.forEach(cb => { if (cb !== except) cb.checked = false; });
}

checkboxes.forEach(cb => {
  cb.addEventListener('change', (e) => {
    if (e.target.checked) {
      clearSelections(e.target);
      cityInput.value = e.target.value;
      fetchWeather(e.target.value);
    } else {
      cityInput.value = '';
    }
  });
});

getBtn.addEventListener('click', () => {
  // uncheck all checkboxes when manual entry
  clearSelections();
  const city = cityInput.value.trim();
  if (!city) return showError('Please enter a city name or pick one.');
  fetchWeather(city);
});

async function fetchWeather(city){
  hideError();
  showLoading(true);
  try{
    const resp = await fetch(`/weather?city=${encodeURIComponent(city)}`);
    const data = await resp.json();
    if (!resp.ok) return showError(data.error || 'Failed to fetch weather');
    showResult(data);
  }catch(err){
    showError(err.message || 'Network error');
  }finally{
    showLoading(false);
  }
}

function showResult(data){
  result.classList.remove('hidden');
  document.querySelector('.location').textContent = `${data.location.name}, ${data.location.country}`;
  document.getElementById('icon').src = data.current.condition.icon.startsWith('http') ? data.current.condition.icon : `https:${data.current.condition.icon}`;
  document.querySelector('.temp').textContent = `${data.current.temp_c}°C`;
  document.querySelector('.cond').textContent = data.current.condition.text;
  document.querySelector('.humidity').textContent = `${data.current.humidity}%`;
  document.querySelector('.wind').textContent = `${data.current.wind_kph} kph ${data.current.wind_dir}`;
  document.querySelector('.feelslike').textContent = `${data.current.feelslike_c}°C`;
  document.querySelector('.updated').textContent = data.current.last_updated;
}

function showError(msg){
  errorBox.textContent = msg;
  errorBox.classList.remove('hidden');
}
function hideError(){
  errorBox.classList.add('hidden');
  errorBox.textContent = '';
}

function showLoading(isLoading){
  getBtn.disabled = isLoading;
  getBtn.textContent = isLoading ? 'Loading...' : 'Get Weather';
}
