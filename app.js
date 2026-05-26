// AppServiceDesk — view router

const CATEGORIES = [
  {
    id: 'learner-status',
    icon: '📋',
    title: 'Changes in Learner Status',
    desc: 'Request a change to a learner\'s current programme status, including withdrawals, breaks in learning, and transfers.',
  },
  {
    id: 'suitability-concern',
    icon: '⚠️',
    title: 'New Learner Suitability Concern',
    desc: 'Flag a concern about a learner\'s suitability within the first 30 days of their programme.',
  },
  {
    id: 'curriculum',
    icon: '📚',
    title: 'Curriculum Requests',
    desc: 'Submit requests relating to learning content, delivery adjustments, or off-the-job training queries.',
  },
  {
    id: 'other',
    icon: '💬',
    title: 'Other',
    desc: 'Anything that doesn\'t fit the categories above. Provide as much detail as possible so we can route your request.',
  },
];

const SUITABILITY_TYPES = [
  {
    id: 'role-suitability',
    icon: '🔍',
    title: 'New Learner Suitability Concern: Role Suitability',
    desc: 'Raise a concern that the learner may not be suited to the role or apprenticeship standard they are enrolled on.',
  },
  {
    id: 'commitment-concern',
    icon: '📉',
    title: 'New Learner Suitability Concern: Commitment Concern',
    desc: 'Raise a concern about a learner\'s level of commitment or engagement with their programme.',
  },
];

const CURRICULUM_TYPES = [
  {
    id: 'technical-mentor',
    icon: '🧑‍🏫',
    title: 'Curriculum Requests: Technical Mentor Request',
    desc: 'Enlist support from a subject matter expert to assist a learner with technical aspects of their programme.',
  },
  {
    id: 'curriculum-feedback',
    icon: '💡',
    title: 'Curriculum Requests: Curriculum Feedback',
    desc: 'Submit feedback or suggestions to the curriculum and product team to help improve learning content and delivery.',
  },
  {
    id: 'platform-request',
    icon: '🖥️',
    title: 'Curriculum Requests: Platform Request',
    desc: 'Log a request relating to our bespoke LMS, including access, content, or feature requests.',
  },
  {
    id: 'system-support',
    icon: '🔧',
    title: 'Curriculum Requests: System Support',
    desc: 'Report a technical issue with the VLE or LMS so it can be investigated and resolved.',
  },
];

const LEARNER_STATUS_TYPES = [
  {
    id: 'achievement',
    icon: '🏆',
    title: 'Changes in Learner Status: Achievement',
    desc: 'Learner has successfully completed and achieved their qualification.',
  },
  {
    id: 'refer',
    icon: '❌',
    title: 'Changes in Learner Status: Refer (Fail)',
    desc: 'Learner has not met the required standard and needs to be referred.',
  },
  {
    id: 'gateway',
    icon: '🎯',
    title: 'Changes in Learner Status: Gateway to End Point Assessment',
    desc: 'Learner is ready to progress to their End Point Assessment.',
  },
  {
    id: 'bil',
    icon: '⏸️',
    title: 'Changes in Learner Status: Agreed Break in Learning (BIL)',
    desc: 'Request a temporary pause in a learner\'s programme.',
  },
  {
    id: 'rtl',
    icon: '▶️',
    title: 'Changes in Learner Status: Return to Learning (RTL)',
    desc: 'Learner is ready to return following an agreed Break in Learning.',
  },
  {
    id: 'withdrawal',
    icon: '🚪',
    title: 'Changes in Learner Status: Withdrawal',
    desc: 'Learner is to be withdrawn from their apprenticeship programme.',
  },
];

function cardHTML(item) {
  return `
    <button class="request-card" data-id="${item.id}">
      <div class="card-icon">${item.icon}</div>
      <h2 class="card-title">${item.title}</h2>
      <p class="card-desc">${item.desc}</p>
      <span class="card-cta">Raise a request &rarr;</span>
    </button>`;
}

function renderHome() {
  document.getElementById('view').innerHTML = `
    <section class="hero">
      <h1 class="hero-title">How can we help?</h1>
      <p class="hero-subtitle">Select a category below to raise a new request.</p>
    </section>
    <section class="card-grid">
      ${CATEGORIES.map(cardHTML).join('')}
    </section>`;

  document.querySelector('.card-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.request-card');
    if (!card) return;
    if (card.dataset.id === 'learner-status') renderLearnerStatus();
    if (card.dataset.id === 'suitability-concern') renderSuitabilityConcern();
    if (card.dataset.id === 'curriculum') renderCurriculum();
  });
}

function renderLearnerStatus() {
  document.getElementById('view').innerHTML = `
    <div class="back-bar">
      <button class="back-btn" id="backBtn">&larr; Back to main menu</button>
    </div>
    <section class="hero">
      <h1 class="hero-title">Changes in Learner Status</h1>
      <p class="hero-subtitle">Select the type of status change you need to request.</p>
    </section>
    <section class="card-grid">
      ${LEARNER_STATUS_TYPES.map(cardHTML).join('')}
    </section>`;

  document.getElementById('backBtn').addEventListener('click', renderHome);
}

function renderSuitabilityConcern() {
  document.getElementById('view').innerHTML = `
    <div class="back-bar">
      <button class="back-btn" id="backBtn">&larr; Back to main menu</button>
    </div>
    <section class="hero">
      <h1 class="hero-title">New Learner Suitability Concern</h1>
      <p class="hero-subtitle">Select the type of concern you need to raise.</p>
    </section>
    <section class="card-grid">
      ${SUITABILITY_TYPES.map(cardHTML).join('')}
    </section>`;

  document.getElementById('backBtn').addEventListener('click', renderHome);
}

function renderCurriculum() {
  document.getElementById('view').innerHTML = `
    <div class="back-bar">
      <button class="back-btn" id="backBtn">&larr; Back to main menu</button>
    </div>
    <section class="hero">
      <h1 class="hero-title">Curriculum Requests</h1>
      <p class="hero-subtitle">Select the type of curriculum request you need to raise.</p>
    </section>
    <section class="card-grid">
      ${CURRICULUM_TYPES.map(cardHTML).join('')}
    </section>`;

  document.getElementById('backBtn').addEventListener('click', renderHome);
}

document.addEventListener('DOMContentLoaded', renderHome);
