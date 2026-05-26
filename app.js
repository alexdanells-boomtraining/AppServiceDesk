// AppServiceDesk — view router

const STANDARDS = [
  'Data Analyst',
  'Data Technician',
  'Applied AI & Automation',
  'Multi-Channel Marketer',
  'Assistant Accountant',
  'Professional Accounting Technician',
  'Digital Support Technician',
  'Business Administrator',
  'Operations/Departmental Manager',
];

const CATEGORIES = [
  {
    id: 'learner-status',
    icon: '📋',
    title: 'Changes in Learner Status',
    desc: 'Request a change to a learner\'s current programme status, including withdrawals, breaks in learning, and transfers.',
  },
  {
    id: 'new-learner',
    icon: '🎓',
    title: 'New Learner Requests',
    desc: 'Submit a new learner enrolment request or raise a suitability concern within the first 30 days of a learner\'s programme.',
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

const NEW_LEARNER_TYPES = [
  {
    id: 'new-enrolment',
    icon: '📝',
    title: 'New Learner Enrolment',
    desc: 'Raise an enrolment request for a learner who is ready to begin their apprenticeship programme.',
  },
  {
    id: 'suitability-concern',
    icon: '⚠️',
    title: 'New Learner Suitability Concern',
    desc: 'Flag a concern about a learner\'s suitability within the first 30 days of their programme.',
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

// ── Validation utilities ───────────────────────

function getFieldError(el) {
  if (el.type === 'checkbox') return 'This confirmation is required before submitting.';
  if (el.tagName === 'SELECT') return 'Please select an option.';
  if (el.type === 'date') return 'Please enter a date.';
  if (el.tagName === 'TEXTAREA') return 'Please provide details.';
  return 'This field is required.';
}

function validateField(el) {
  const isEmpty = el.type === 'checkbox' ? !el.checked : !el.value.trim();
  const errorEl = document.getElementById(el.id + 'Error');
  el.classList.toggle('is-error', isEmpty);
  if (errorEl) {
    errorEl.textContent = isEmpty ? getFieldError(el) : '';
    errorEl.hidden = !isEmpty;
  }
  return !isEmpty;
}

function validateForm() {
  const fields = document.querySelectorAll('#requestForm [required]');
  let valid = true;
  fields.forEach(el => { if (!validateField(el)) valid = false; });
  if (!valid) {
    const first = document.querySelector('#requestForm .is-error');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return valid;
}

function attachValidation() {
  document.querySelectorAll('#requestForm [required]').forEach(el => {
    const err = document.createElement('p');
    err.className = 'form-error';
    err.id = el.id + 'Error';
    err.hidden = true;
    const anchor = el.type === 'checkbox' ? el.closest('.form-group') : el;
    anchor.insertAdjacentElement('afterend', err);
    el.addEventListener('input', () => validateField(el));
    el.addEventListener('change', () => validateField(el));
  });
}

// ── View router ────────────────────────────────

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
    if (card.dataset.id === 'new-learner') renderNewLearner();
    if (card.dataset.id === 'curriculum') renderCurriculum();
    if (card.dataset.id === 'other') renderFormOther();
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

  document.querySelector('.card-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.request-card');
    if (!card) return;
    if (card.dataset.id === 'achievement') renderFormAchievement();
    if (card.dataset.id === 'refer') renderFormRefer();
    if (card.dataset.id === 'gateway') renderFormGateway();
    if (card.dataset.id === 'bil') renderFormBIL();
    if (card.dataset.id === 'rtl') renderFormRTL();
    if (card.dataset.id === 'withdrawal') renderFormWithdrawal();
  });
}

function renderNewLearner() {
  document.getElementById('view').innerHTML = `
    <div class="back-bar">
      <button class="back-btn" id="backBtn">&larr; Back to main menu</button>
    </div>
    <section class="hero">
      <h1 class="hero-title">New Learner Requests</h1>
      <p class="hero-subtitle">Select the type of request you need to raise.</p>
    </section>
    <section class="card-grid">
      ${NEW_LEARNER_TYPES.map(cardHTML).join('')}
    </section>`;

  document.getElementById('backBtn').addEventListener('click', renderHome);

  document.querySelector('.card-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.request-card');
    if (!card) return;
    if (card.dataset.id === 'new-enrolment') renderFormNewEnrolment();
    if (card.dataset.id === 'suitability-concern') renderSuitabilityConcern();
  });
}

function renderSuitabilityConcern() {
  document.getElementById('view').innerHTML = `
    <div class="back-bar">
      <button class="back-btn" id="backBtn">&larr; Back to New Learner Requests</button>
    </div>
    <section class="hero">
      <h1 class="hero-title">New Learner Suitability Concern</h1>
      <p class="hero-subtitle">Select the type of concern you need to raise.</p>
    </section>
    <section class="card-grid">
      ${SUITABILITY_TYPES.map(cardHTML).join('')}
    </section>`;

  document.getElementById('backBtn').addEventListener('click', renderNewLearner);

  document.querySelector('.card-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.request-card');
    if (!card) return;
    if (card.dataset.id === 'role-suitability') renderFormSuitability('role-suitability', 'New Learner Suitability Concern: Role Suitability');
    if (card.dataset.id === 'commitment-concern') renderFormSuitability('commitment-concern', 'New Learner Suitability Concern: Commitment Concern');
  });
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

  document.querySelector('.card-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.request-card');
    if (!card) return;
    if (card.dataset.id === 'technical-mentor')    renderFormTechnicalMentor();
    if (card.dataset.id === 'curriculum-feedback') renderFormCurriculumFeedback();
    if (card.dataset.id === 'platform-request')    renderFormPlatformRequest();
    if (card.dataset.id === 'system-support')      renderFormSystemSupport();
  });
}

function renderFormTechnicalMentor() {
  const standardOptions = STANDARDS.map(s => `<option value="${s}">${s}</option>`).join('');

  document.getElementById('view').innerHTML = `
    <div class="back-bar">
      <button class="back-btn" id="backBtn">&larr; Back to Curriculum Requests</button>
    </div>
    <section class="hero">
      <h1 class="hero-title">Curriculum Requests: Technical Mentor Request</h1>
      <p class="hero-subtitle">Complete the form below to raise this request.</p>
    </section>
    <form class="request-form" id="requestForm" novalidate>
      <div class="form-group">
        <label class="form-label" for="learnerName">Learner Name</label>
        <input class="form-input" type="text" id="learnerName" name="learnerName" placeholder="Full name of the learner" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="employerName">Employer Name</label>
        <input class="form-input" type="text" id="employerName" name="employerName" placeholder="Name of the employer organisation" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="standard">Standard</label>
        <select class="form-select" id="standard" name="standard" required>
          <option value="" disabled selected>Select a standard</option>
          ${standardOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="supportArea">Topic / Area of Support</label>
        <input class="form-input" type="text" id="supportArea" name="supportArea" placeholder="e.g. SQL fundamentals, data visualisation, bookkeeping" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="details">Details</label>
        <p class="form-hint">Please describe the specific gaps or challenges the learner is facing and what you hope the technical mentor will help them achieve.</p>
        <textarea class="form-textarea form-textarea--tall" id="details" name="details" placeholder="Provide as much context as possible..." required></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-submit">Submit Request</button>
      </div>
    </form>`;

  document.getElementById('backBtn').addEventListener('click', renderCurriculum);

  attachValidation();

  document.getElementById('requestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const data = {
      type: 'technical-mentor',
      learnerName: document.getElementById('learnerName').value.trim(),
      employerName: document.getElementById('employerName').value.trim(),
      standard: document.getElementById('standard').value,
      supportArea: document.getElementById('supportArea').value.trim(),
      details: document.getElementById('details').value.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const tickets = JSON.parse(localStorage.getItem('asd_tickets') || '[]');
    tickets.push(data);
    localStorage.setItem('asd_tickets', JSON.stringify(tickets));
    renderConfirmation();
  });
}

function renderFormCurriculumFeedback() {
  const standardOptions = STANDARDS.map(s => `<option value="${s}">${s}</option>`).join('');

  document.getElementById('view').innerHTML = `
    <div class="back-bar">
      <button class="back-btn" id="backBtn">&larr; Back to Curriculum Requests</button>
    </div>
    <section class="hero">
      <h1 class="hero-title">Curriculum Requests: Curriculum Feedback</h1>
      <p class="hero-subtitle">Complete the form below to raise this request.</p>
    </section>
    <form class="request-form" id="requestForm" novalidate>
      <div class="form-group">
        <label class="form-label" for="standard">Standard</label>
        <select class="form-select" id="standard" name="standard" required>
          <option value="" disabled selected>Select a standard</option>
          ${standardOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="feedbackType">Feedback Type</label>
        <select class="form-select" id="feedbackType" name="feedbackType" required>
          <option value="" disabled selected>Select a type</option>
          <option value="Content Issue">Content Issue</option>
          <option value="Delivery Suggestion">Delivery Suggestion</option>
          <option value="Resource Request">Resource Request</option>
          <option value="Assessment Query">Assessment Query</option>
          <option value="General Feedback">General Feedback</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="details">Details</label>
        <p class="form-hint">Please be as specific as possible — include module names, session references, or examples where relevant so the curriculum team can act on your feedback effectively.</p>
        <textarea class="form-textarea form-textarea--tall" id="details" name="details" placeholder="Describe your feedback in detail..." required></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-submit">Submit Request</button>
      </div>
    </form>`;

  document.getElementById('backBtn').addEventListener('click', renderCurriculum);

  attachValidation();

  document.getElementById('requestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const data = {
      type: 'curriculum-feedback',
      standard: document.getElementById('standard').value,
      feedbackType: document.getElementById('feedbackType').value,
      details: document.getElementById('details').value.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const tickets = JSON.parse(localStorage.getItem('asd_tickets') || '[]');
    tickets.push(data);
    localStorage.setItem('asd_tickets', JSON.stringify(tickets));
    renderConfirmation();
  });
}

function renderFormPlatformRequest() {
  const standardOptions = STANDARDS.map(s => `<option value="${s}">${s}</option>`).join('');

  document.getElementById('view').innerHTML = `
    <div class="back-bar">
      <button class="back-btn" id="backBtn">&larr; Back to Curriculum Requests</button>
    </div>
    <section class="hero">
      <h1 class="hero-title">Curriculum Requests: Platform Request</h1>
      <p class="hero-subtitle">Complete the form below to raise this request.</p>
    </section>
    <form class="request-form" id="requestForm" novalidate>
      <div class="form-group">
        <label class="form-label" for="learnerName">Learner Name</label>
        <input class="form-input" type="text" id="learnerName" name="learnerName" placeholder="Full name of the learner" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="employerName">Employer Name</label>
        <input class="form-input" type="text" id="employerName" name="employerName" placeholder="Name of the employer organisation" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="standard">Standard</label>
        <select class="form-select" id="standard" name="standard" required>
          <option value="" disabled selected>Select a standard</option>
          ${standardOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="requestType">Request Type</label>
        <select class="form-select" id="requestType" name="requestType" required>
          <option value="" disabled selected>Select a type</option>
          <option value="Access Issue">Access Issue</option>
          <option value="Content Upload">Content Upload</option>
          <option value="Feature Request">Feature Request</option>
          <option value="User Account">User Account</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="details">Details</label>
        <p class="form-hint">Please provide sufficient detail so the team can understand and action your request, including any relevant learner or course information.</p>
        <textarea class="form-textarea form-textarea--tall" id="details" name="details" placeholder="Describe your request in detail..." required></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-submit">Submit Request</button>
      </div>
    </form>`;

  document.getElementById('backBtn').addEventListener('click', renderCurriculum);

  attachValidation();

  document.getElementById('requestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const data = {
      type: 'platform-request',
      learnerName: document.getElementById('learnerName').value.trim(),
      employerName: document.getElementById('employerName').value.trim(),
      standard: document.getElementById('standard').value,
      requestType: document.getElementById('requestType').value,
      details: document.getElementById('details').value.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const tickets = JSON.parse(localStorage.getItem('asd_tickets') || '[]');
    tickets.push(data);
    localStorage.setItem('asd_tickets', JSON.stringify(tickets));
    renderConfirmation();
  });
}

function renderFormSystemSupport() {
  document.getElementById('view').innerHTML = `
    <div class="back-bar">
      <button class="back-btn" id="backBtn">&larr; Back to Curriculum Requests</button>
    </div>
    <section class="hero">
      <h1 class="hero-title">Curriculum Requests: System Support</h1>
      <p class="hero-subtitle">Complete the form below to raise this request.</p>
    </section>
    <form class="request-form" id="requestForm" novalidate>
      <div class="form-group">
        <label class="form-label" for="systemAffected">System Affected</label>
        <select class="form-select" id="systemAffected" name="systemAffected" required>
          <option value="" disabled selected>Select a system</option>
          <option value="VLE">VLE</option>
          <option value="LMS">LMS</option>
          <option value="Both">Both</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="issueType">Issue Type</label>
        <select class="form-select" id="issueType" name="issueType" required>
          <option value="" disabled selected>Select an issue type</option>
          <option value="Login Problem">Login Problem</option>
          <option value="Content Not Loading">Content Not Loading</option>
          <option value="Feature Not Working">Feature Not Working</option>
          <option value="Performance Issue">Performance Issue</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="details">Details</label>
        <p class="form-hint">Please include a description of the issue, any error messages displayed, the browser you are using, and the steps taken before the problem occurred.</p>
        <textarea class="form-textarea form-textarea--tall" id="details" name="details" placeholder="Describe the issue in as much detail as possible..." required></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-submit">Submit Request</button>
      </div>
    </form>`;

  document.getElementById('backBtn').addEventListener('click', renderCurriculum);

  attachValidation();

  document.getElementById('requestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const data = {
      type: 'system-support',
      systemAffected: document.getElementById('systemAffected').value,
      issueType: document.getElementById('issueType').value,
      details: document.getElementById('details').value.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const tickets = JSON.parse(localStorage.getItem('asd_tickets') || '[]');
    tickets.push(data);
    localStorage.setItem('asd_tickets', JSON.stringify(tickets));
    renderConfirmation();
  });
}

function renderFormRefer() {
  const standardOptions = STANDARDS.map(s => `<option value="${s}">${s}</option>`).join('');

  document.getElementById('view').innerHTML = `
    <div class="back-bar">
      <button class="back-btn" id="backBtn">&larr; Back to Learner Status</button>
    </div>
    <section class="hero">
      <h1 class="hero-title">Changes in Learner Status: Refer (Fail)</h1>
      <p class="hero-subtitle">Complete the form below to raise this request.</p>
    </section>
    <form class="request-form" id="requestForm" novalidate>
      <div class="form-group">
        <label class="form-label" for="learnerName">Learner Name</label>
        <input class="form-input" type="text" id="learnerName" name="learnerName" placeholder="Full name of the learner" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="employerName">Employer Name</label>
        <input class="form-input" type="text" id="employerName" name="employerName" placeholder="Name of the employer organisation" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="standard">Standard</label>
        <select class="form-select" id="standard" name="standard" required>
          <option value="" disabled selected>Select a standard</option>
          ${standardOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="notes">Additional Notes</label>
        <textarea class="form-textarea" id="notes" name="notes" placeholder="Add any additional context or information here..."></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-submit">Submit Request</button>
      </div>
    </form>`;

  document.getElementById('backBtn').addEventListener('click', renderLearnerStatus);

  attachValidation();

  document.getElementById('requestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const data = {
      type: 'refer',
      learnerName: document.getElementById('learnerName').value.trim(),
      employerName: document.getElementById('employerName').value.trim(),
      standard: document.getElementById('standard').value,
      notes: document.getElementById('notes').value.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const tickets = JSON.parse(localStorage.getItem('asd_tickets') || '[]');
    tickets.push(data);
    localStorage.setItem('asd_tickets', JSON.stringify(tickets));
    renderConfirmation();
  });
}

function renderFormWithdrawal() {
  const standardOptions = STANDARDS.map(s => `<option value="${s}">${s}</option>`).join('');

  document.getElementById('view').innerHTML = `
    <div class="back-bar">
      <button class="back-btn" id="backBtn">&larr; Back to Learner Status</button>
    </div>
    <section class="hero">
      <h1 class="hero-title">Changes in Learner Status: Withdrawal</h1>
      <p class="hero-subtitle">Complete the form below to raise this request.</p>
    </section>
    <form class="request-form" id="requestForm" novalidate>
      <div class="form-group">
        <label class="form-label" for="learnerName">Learner Name</label>
        <input class="form-input" type="text" id="learnerName" name="learnerName" placeholder="Full name of the learner" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="employerName">Employer Name</label>
        <input class="form-input" type="text" id="employerName" name="employerName" placeholder="Name of the employer organisation" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="standard">Standard</label>
        <select class="form-select" id="standard" name="standard" required>
          <option value="" disabled selected>Select a standard</option>
          ${standardOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="ldol">Last Day of Learning (LDOL)</label>
        <input class="form-input" type="date" id="ldol" name="ldol" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="withdrawalReason">Withdrawal Reason</label>
        <select class="form-select" id="withdrawalReason" name="withdrawalReason" required>
          <option value="" disabled selected>Select a reason</option>
          <option value="Employment ended / redundancy">Employment ended / redundancy</option>
          <option value="Change of employer">Change of employer</option>
          <option value="Personal circumstances">Personal circumstances</option>
          <option value="Health reasons">Health reasons</option>
          <option value="Learner chose to leave">Learner chose to leave</option>
          <option value="Lack of employer support">Lack of employer support</option>
          <option value="Programme not meeting learner needs">Programme not meeting learner needs</option>
          <option value="Financial reasons">Financial reasons</option>
          <option value="Relocation">Relocation</option>
          <option value="Transfer to another provider">Transfer to another provider</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="notes">Additional Notes</label>
        <textarea class="form-textarea" id="notes" name="notes" placeholder="Add any additional context or information here..."></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-submit">Submit Request</button>
      </div>
    </form>`;

  document.getElementById('backBtn').addEventListener('click', renderLearnerStatus);

  attachValidation();

  document.getElementById('requestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const data = {
      type: 'withdrawal',
      learnerName: document.getElementById('learnerName').value.trim(),
      employerName: document.getElementById('employerName').value.trim(),
      standard: document.getElementById('standard').value,
      ldol: document.getElementById('ldol').value,
      withdrawalReason: document.getElementById('withdrawalReason').value,
      notes: document.getElementById('notes').value.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const tickets = JSON.parse(localStorage.getItem('asd_tickets') || '[]');
    tickets.push(data);
    localStorage.setItem('asd_tickets', JSON.stringify(tickets));
    renderConfirmation();
  });
}

function renderFormRTL() {
  const standardOptions = STANDARDS.map(s => `<option value="${s}">${s}</option>`).join('');

  document.getElementById('view').innerHTML = `
    <div class="back-bar">
      <button class="back-btn" id="backBtn">&larr; Back to Learner Status</button>
    </div>
    <section class="hero">
      <h1 class="hero-title">Changes in Learner Status: Return to Learning (RTL)</h1>
      <p class="hero-subtitle">Complete the form below to raise this request.</p>
    </section>
    <form class="request-form" id="requestForm" novalidate>
      <div class="form-group">
        <label class="form-label" for="learnerName">Learner Name</label>
        <input class="form-input" type="text" id="learnerName" name="learnerName" placeholder="Full name of the learner" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="employerName">Employer Name</label>
        <input class="form-input" type="text" id="employerName" name="employerName" placeholder="Name of the employer organisation" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="standard">Standard</label>
        <select class="form-select" id="standard" name="standard" required>
          <option value="" disabled selected>Select a standard</option>
          ${standardOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="actualRtl">Actual Return to Learning</label>
        <input class="form-input" type="date" id="actualRtl" name="actualRtl" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="notes">Additional Notes</label>
        <textarea class="form-textarea" id="notes" name="notes" placeholder="Add any additional context or information here..."></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-submit">Submit Request</button>
      </div>
    </form>`;

  document.getElementById('backBtn').addEventListener('click', renderLearnerStatus);

  attachValidation();

  document.getElementById('requestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const data = {
      type: 'rtl',
      learnerName: document.getElementById('learnerName').value.trim(),
      employerName: document.getElementById('employerName').value.trim(),
      standard: document.getElementById('standard').value,
      actualRtl: document.getElementById('actualRtl').value,
      notes: document.getElementById('notes').value.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const tickets = JSON.parse(localStorage.getItem('asd_tickets') || '[]');
    tickets.push(data);
    localStorage.setItem('asd_tickets', JSON.stringify(tickets));
    renderConfirmation();
  });
}

function renderFormBIL() {
  const standardOptions = STANDARDS.map(s => `<option value="${s}">${s}</option>`).join('');

  document.getElementById('view').innerHTML = `
    <div class="back-bar">
      <button class="back-btn" id="backBtn">&larr; Back to Learner Status</button>
    </div>
    <section class="hero">
      <h1 class="hero-title">Changes in Learner Status: Agreed Break in Learning (BIL)</h1>
      <p class="hero-subtitle">Complete the form below to raise this request.</p>
    </section>
    <form class="request-form" id="requestForm" novalidate>
      <div class="form-group">
        <label class="form-label" for="learnerName">Learner Name</label>
        <input class="form-input" type="text" id="learnerName" name="learnerName" placeholder="Full name of the learner" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="employerName">Employer Name</label>
        <input class="form-input" type="text" id="employerName" name="employerName" placeholder="Name of the employer organisation" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="standard">Standard</label>
        <select class="form-select" id="standard" name="standard" required>
          <option value="" disabled selected>Select a standard</option>
          ${standardOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="ldol">Last Day of Learning (LDOL)</label>
        <input class="form-input" type="date" id="ldol" name="ldol" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="expectedRtl">Expected Return to Learning</label>
        <input class="form-input" type="date" id="expectedRtl" name="expectedRtl" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="notes">Additional Notes</label>
        <textarea class="form-textarea" id="notes" name="notes" placeholder="Add any additional context or information here..."></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-submit">Submit Request</button>
      </div>
    </form>`;

  document.getElementById('backBtn').addEventListener('click', renderLearnerStatus);

  attachValidation();

  document.getElementById('requestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const data = {
      type: 'bil',
      learnerName: document.getElementById('learnerName').value.trim(),
      employerName: document.getElementById('employerName').value.trim(),
      standard: document.getElementById('standard').value,
      ldol: document.getElementById('ldol').value,
      expectedRtl: document.getElementById('expectedRtl').value,
      notes: document.getElementById('notes').value.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const tickets = JSON.parse(localStorage.getItem('asd_tickets') || '[]');
    tickets.push(data);
    localStorage.setItem('asd_tickets', JSON.stringify(tickets));
    renderConfirmation();
  });
}

function renderFormGateway() {
  const standardOptions = STANDARDS.map(s => `<option value="${s}">${s}</option>`).join('');

  document.getElementById('view').innerHTML = `
    <div class="back-bar">
      <button class="back-btn" id="backBtn">&larr; Back to Learner Status</button>
    </div>
    <section class="hero">
      <h1 class="hero-title">Changes in Learner Status: Gateway to End Point Assessment</h1>
      <p class="hero-subtitle">Complete the form below to raise this request.</p>
    </section>
    <form class="request-form" id="requestForm" novalidate>
      <div class="form-group">
        <label class="form-label" for="learnerName">Learner Name</label>
        <input class="form-input" type="text" id="learnerName" name="learnerName" placeholder="Full name of the learner" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="employerName">Employer Name</label>
        <input class="form-input" type="text" id="employerName" name="employerName" placeholder="Name of the employer organisation" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="standard">Standard</label>
        <select class="form-select" id="standard" name="standard" required>
          <option value="" disabled selected>Select a standard</option>
          ${standardOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="notes">Additional Notes</label>
        <textarea class="form-textarea" id="notes" name="notes" placeholder="Add any additional context or information here..."></textarea>
      </div>
      <div class="form-group">
        <label class="form-checkbox">
          <input type="checkbox" id="gatewayConfirm" name="gatewayConfirm" required />
          <span>I confirm the learner has satisfied the OTJ requirement and the gateway form has been completed and uploaded to the relevant section on the platform.</span>
        </label>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-submit">Submit Request</button>
      </div>
    </form>`;

  document.getElementById('backBtn').addEventListener('click', renderLearnerStatus);

  attachValidation();

  document.getElementById('requestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const data = {
      type: 'gateway',
      learnerName: document.getElementById('learnerName').value.trim(),
      employerName: document.getElementById('employerName').value.trim(),
      standard: document.getElementById('standard').value,
      notes: document.getElementById('notes').value.trim(),
      gatewayConfirmed: true,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const tickets = JSON.parse(localStorage.getItem('asd_tickets') || '[]');
    tickets.push(data);
    localStorage.setItem('asd_tickets', JSON.stringify(tickets));
    renderConfirmation();
  });
}

function renderFormAchievement() {
  const standardOptions = STANDARDS.map(s => `<option value="${s}">${s}</option>`).join('');

  document.getElementById('view').innerHTML = `
    <div class="back-bar">
      <button class="back-btn" id="backBtn">&larr; Back to Learner Status</button>
    </div>
    <section class="hero">
      <h1 class="hero-title">Changes in Learner Status: Achievement</h1>
      <p class="hero-subtitle">Complete the form below to raise this request.</p>
    </section>
    <form class="request-form" id="requestForm" novalidate>
      <div class="form-group">
        <label class="form-label" for="learnerName">Learner Name</label>
        <input class="form-input" type="text" id="learnerName" name="learnerName" placeholder="Full name of the learner" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="employerName">Employer Name</label>
        <input class="form-input" type="text" id="employerName" name="employerName" placeholder="Name of the employer organisation" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="standard">Standard</label>
        <select class="form-select" id="standard" name="standard" required>
          <option value="" disabled selected>Select a standard</option>
          ${standardOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="outcome">Outcome</label>
        <select class="form-select" id="outcome" name="outcome" required>
          <option value="" disabled selected>Select an outcome</option>
          <option value="Pass">Pass</option>
          <option value="Merit">Merit</option>
          <option value="Distinction">Distinction</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="notes">Additional Notes</label>
        <textarea class="form-textarea" id="notes" name="notes" placeholder="Add any additional context or information here..."></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-submit">Submit Request</button>
      </div>
    </form>`;

  document.getElementById('backBtn').addEventListener('click', renderLearnerStatus);

  attachValidation();

  document.getElementById('requestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const data = {
      type: 'achievement',
      learnerName: document.getElementById('learnerName').value.trim(),
      employerName: document.getElementById('employerName').value.trim(),
      standard: document.getElementById('standard').value,
      outcome: document.getElementById('outcome').value,
      notes: document.getElementById('notes').value.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const tickets = JSON.parse(localStorage.getItem('asd_tickets') || '[]');
    tickets.push(data);
    localStorage.setItem('asd_tickets', JSON.stringify(tickets));
    renderConfirmation();
  });
}

function renderFormNewEnrolment() {
  const standardOptions = STANDARDS.map(s => `<option value="${s}">${s}</option>`).join('');

  document.getElementById('view').innerHTML = `
    <div class="back-bar">
      <button class="back-btn" id="backBtn">&larr; Back to New Learner Requests</button>
    </div>
    <section class="hero">
      <h1 class="hero-title">New Learner Enrolment</h1>
      <p class="hero-subtitle">Complete the form below to raise this request.</p>
    </section>
    <form class="request-form" id="requestForm" novalidate>
      <div class="form-group">
        <label class="form-label" for="learnerName">Learner Name</label>
        <input class="form-input" type="text" id="learnerName" name="learnerName" placeholder="Full name of the learner" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="employerName">Employer Name</label>
        <input class="form-input" type="text" id="employerName" name="employerName" placeholder="Name of the employer organisation" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="standard">Standard</label>
        <select class="form-select" id="standard" name="standard" required>
          <option value="" disabled selected>Select a standard</option>
          ${standardOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="plannedStartDate">Planned Start Date</label>
        <input class="form-input" type="date" id="plannedStartDate" name="plannedStartDate" required />
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-submit">Submit Request</button>
      </div>
    </form>`;

  document.getElementById('backBtn').addEventListener('click', renderNewLearner);

  attachValidation();

  document.getElementById('requestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const data = {
      type: 'new-enrolment',
      learnerName: document.getElementById('learnerName').value.trim(),
      employerName: document.getElementById('employerName').value.trim(),
      standard: document.getElementById('standard').value,
      plannedStartDate: document.getElementById('plannedStartDate').value,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const tickets = JSON.parse(localStorage.getItem('asd_tickets') || '[]');
    tickets.push(data);
    localStorage.setItem('asd_tickets', JSON.stringify(tickets));
    renderConfirmation();
  });
}

function renderFormOther() {
  document.getElementById('view').innerHTML = `
    <div class="back-bar">
      <button class="back-btn" id="backBtn">&larr; Back to main menu</button>
    </div>
    <section class="hero">
      <h1 class="hero-title">Other</h1>
      <p class="hero-subtitle">Use this form for anything that doesn't fit the other categories.</p>
    </section>
    <form class="request-form" id="requestForm" novalidate>
      <div class="form-group">
        <label class="form-label" for="subject">Subject</label>
        <input class="form-input" type="text" id="subject" name="subject" placeholder="A brief title for your request" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="learnerName">Learner Name <span class="form-optional">(if applicable)</span></label>
        <input class="form-input" type="text" id="learnerName" name="learnerName" placeholder="Full name of the learner" />
      </div>
      <div class="form-group">
        <label class="form-label" for="employerName">Employer Name <span class="form-optional">(if applicable)</span></label>
        <input class="form-input" type="text" id="employerName" name="employerName" placeholder="Name of the employer organisation" />
      </div>
      <div class="form-group">
        <label class="form-label" for="details">Details</label>
        <p class="form-hint">Please provide as much detail as possible. The more context you give, the faster we can route and action your request.</p>
        <textarea class="form-textarea form-textarea--tall" id="details" name="details" placeholder="Describe your request in full..." required></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-submit">Submit Request</button>
      </div>
    </form>`;

  document.getElementById('backBtn').addEventListener('click', renderHome);

  attachValidation();

  document.getElementById('requestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const data = {
      type: 'other',
      subject: document.getElementById('subject').value.trim(),
      learnerName: document.getElementById('learnerName').value.trim(),
      employerName: document.getElementById('employerName').value.trim(),
      details: document.getElementById('details').value.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const tickets = JSON.parse(localStorage.getItem('asd_tickets') || '[]');
    tickets.push(data);
    localStorage.setItem('asd_tickets', JSON.stringify(tickets));
    renderConfirmation();
  });
}

function renderFormSuitability(type, title) {
  const standardOptions = STANDARDS.map(s => `<option value="${s}">${s}</option>`).join('');

  document.getElementById('view').innerHTML = `
    <div class="back-bar">
      <button class="back-btn" id="backBtn">&larr; Back to Suitability Concerns</button>
    </div>
    <section class="hero">
      <h1 class="hero-title">${title}</h1>
      <p class="hero-subtitle">Complete the form below to raise this request.</p>
    </section>
    <form class="request-form" id="requestForm" novalidate>
      <div class="form-group">
        <label class="form-label" for="learnerName">Learner Name</label>
        <input class="form-input" type="text" id="learnerName" name="learnerName" placeholder="Full name of the learner" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="employerName">Employer Name</label>
        <input class="form-input" type="text" id="employerName" name="employerName" placeholder="Name of the employer organisation" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="standard">Standard</label>
        <select class="form-select" id="standard" name="standard" required>
          <option value="" disabled selected>Select a standard</option>
          ${standardOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="details">Details</label>
        <p class="form-hint">Please provide sufficient detail to clearly describe the concern, including specific incidents, dates, and any steps already taken.</p>
        <textarea class="form-textarea form-textarea--tall" id="details" name="details" placeholder="Describe the concern in as much detail as possible..." required></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-submit">Submit Request</button>
      </div>
    </form>`;

  document.getElementById('backBtn').addEventListener('click', renderSuitabilityConcern);

  attachValidation();

  document.getElementById('requestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const data = {
      type,
      learnerName: document.getElementById('learnerName').value.trim(),
      employerName: document.getElementById('employerName').value.trim(),
      standard: document.getElementById('standard').value,
      details: document.getElementById('details').value.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const tickets = JSON.parse(localStorage.getItem('asd_tickets') || '[]');
    tickets.push(data);
    localStorage.setItem('asd_tickets', JSON.stringify(tickets));
    renderConfirmation();
  });
}

function renderConfirmation() {
  document.getElementById('view').innerHTML = `
    <section class="hero confirmation">
      <div class="confirmation-icon">✅</div>
      <h1 class="hero-title">Request Submitted</h1>
      <p class="hero-subtitle">Your request has been logged and will be picked up by the team shortly.</p>
      <button class="btn-submit" id="homeBtn">Back to main menu</button>
    </section>`;

  document.getElementById('homeBtn').addEventListener('click', renderHome);
}

document.addEventListener('DOMContentLoaded', renderHome);
