function changeMahri(id) {
    const tabs = document.querySelectorAll('.content');
    const next = document.getElementById(id);
    if (!next) return;
    const current = document.querySelector('.tabContent.isActive');
    if (current === next) return;
    next.style.display = 'block';
    if (current) {
      current.classList.add('isFadingOut');
      setTimeout(() => {
        current.classList.remove('isActive', 'isFadingOut');
        current.style.display = 'none';
        requestAnimationFrame(() => next.classList.add('isActive'));
      }, 220);
    } else {
      requestAnimationFrame(() => next.classList.add('isActive'));
    }
  }
