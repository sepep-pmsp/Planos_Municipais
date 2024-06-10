document.addEventListener("DOMContentLoaded", function () {
  const filterSelect = document.getElementById('filter');
  const sortSelect = document.getElementById('sort');
  const accordion = document.getElementById('accordion');
  let plans = [];

  function renderPlans(plans) {
    accordion.innerHTML = '';
    plans.forEach(plan => {
      const accordionItem = document.createElement('div');
      accordionItem.classList.add('accordion-item');

      const accordionHeader = document.createElement('div');
      accordionHeader.classList.add('accordion-header');
      accordionHeader.textContent = plan.Título;

      const accordionContent = document.createElement('div');
      accordionContent.classList.add('accordion-content');

      const resumo = plan.Resumo || '';
      const vigencia = plan.Início && plan.Fim ? `<p>Vigência: ${plan.Início} - ${plan.Fim}</p>` : '';
      const orgaoCoordenador = plan["Órgão Coordenador"] ? `<p>Órgão Responsável: ${plan["Órgão Coordenador"]}</p>` : '';
      const linkAcesso = plan["Link para Acesso"] ? `<p>Mais informações em: <a href="${plan["Link para Acesso"]}">${plan["Link para Acesso"]}</a></p>` : '';

      let imgSrc = '';
      if (plan.Sigla) {
        imgSrc = `/assets/images/img-plans/${plan.Sigla}.png`;
      } else if (plan.Título) {
        imgSrc = `/assets/images/img-plans/${plan.Título}.png`;
      }
      if (!imgSrc) {
        imgSrc = '/assets/images/img-plans/generic.png';
      }

      accordionContent.innerHTML = `
        <div class="text-content">
          <p>${resumo}</p>
          ${vigencia}
          ${orgaoCoordenador}
          ${linkAcesso}
        </div>
        <div class="image-content">
          <img src="${imgSrc}" alt="${plan.Título}">
        </div>
      `;

      accordionHeader.addEventListener('click', () => {
        const currentlyOpenContent = document.querySelector('.accordion-content.open');
        if (currentlyOpenContent && currentlyOpenContent !== accordionContent) {
          currentlyOpenContent.classList.remove('open');
        }
        accordionContent.classList.toggle('open');
        accordionHeader.classList.toggle('open'); // Toggle 'open' class on header
      });

      accordionItem.appendChild(accordionHeader);
      accordionItem.appendChild(accordionContent);
      accordion.appendChild(accordionItem);
    });
  }

  function filterPlans(plans, filter) {
    if (filter === 'vigente') {
      return plans.filter(plan => plan.Status === 'Vigente');
    } else if (filter === 'encerrado') {
      return plans.filter(plan => plan.Status === 'Encerrado');
    } else {
      return plans;
    }
  }

  function sortPlans(plans, sort) {
    return plans.sort((a, b) => {
      if (sort === 'recent') {
        return new Date(b.Início) - new Date(a.Início);
      } else if (sort === 'oldest') {
        return new Date(a.Início) - new Date(b.Início);
      } else if (sort === 'az') {
        return a.Título.localeCompare(b.Título);
      } else if (sort === 'za') {
        return b.Título.localeCompare(a.Título);
      }
    });
  }

  filterSelect.addEventListener('click', function (e) {
    const options = filterSelect.querySelector('.options');
    options.style.display = options.style.display === 'block' ? 'none' : 'block';
  });

  filterSelect.addEventListener('click', function (e) {
    const option = e.target.closest('li');
    if (option) {
      const filterValue = option.getAttribute('data-value');
      const filteredPlans = filterPlans(plans, filterValue);
      renderPlans(filteredPlans);
      filterSelect.querySelector('.selected-option').textContent = option.textContent;
      filterSelect.querySelector('.options').style.display = 'none';
    }
  });

  sortSelect.addEventListener('click', function (e) {
    const options = sortSelect.querySelector('.options');
    options.style.display = options.style.display === 'block' ? 'none' : 'block';
  });

  sortSelect.addEventListener('click', function (e) {
    const option = e.target.closest('li');
    if (option) {
      const sortValue = option.getAttribute('data-value');
      const sortedPlans = sortPlans(plans, sortValue);
      renderPlans(sortedPlans);
      sortSelect.querySelector('.selected-option').textContent = option.textContent;
      sortSelect.querySelector('.options').style.display = 'none';
    }
  });

  fetch('/assets/Json/excel_to_.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      plans = data;
      renderPlans(plans);
    })
    .catch(error => {
      console.error('Erro ao carregar o JSON:', error);
    });
});
