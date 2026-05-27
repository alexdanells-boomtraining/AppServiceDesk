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

// ── Users & auth ──────────────────────────────

const USERS = [
  { username: 'LSC',     password: 'boom', displayName: 'LSC',     role: 'coach'   },
  { username: 'Manager', password: 'boom', displayName: 'Manager', role: 'manager' },
  { username: 'Admin',   password: 'boom', displayName: 'Admin',   role: 'admin'   },
];

function getCurrentUser() {
  const s = localStorage.getItem('asd_session');
  return s ? JSON.parse(s) : null;
}

function setCurrentUser(user) {
  localStorage.setItem('asd_session', JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem('asd_session');
}

let _loginCallback = null;
let _currentView = 'home';

function openLoginModal(callback) {
  _loginCallback = callback || null;
  const isSwitching = !!getCurrentUser();
  document.getElementById('loginModalTitle').textContent = isSwitching ? 'Switch User' : 'Sign In';
  document.getElementById('loginModalSubtitle').textContent = isSwitching ? 'Select an account to switch to.' : 'Select your account to continue.';
  document.getElementById('loginModal').hidden = false;
}

function closeLoginModal() {
  document.getElementById('loginModal').hidden = true;
  _loginCallback = null;
}

function requireLogin(fn) {
  if (getCurrentUser()) { fn(); }
  else { openLoginModal(fn); }
}

function updateHeader() {
  const user = getCurrentUser();
  const el = document.getElementById('headerActions');
  if (!user) {
    el.innerHTML = `<button class="header-btn" id="loginBtn">Login</button>`;
    document.getElementById('loginBtn').addEventListener('click', () => openLoginModal());
  } else {
    const isOnWorkflow = _currentView === 'workflow';
    const unreadCount = getUnreadQueueCount(user);
    const commentCount = getNewCommentCount(user);
    el.innerHTML = `
      <button class="header-btn header-btn--ghost" id="workflowBtn">${isOnWorkflow ? 'Main Menu' : 'My Workflow'}</button>
      <button class="header-btn header-btn--outline" id="switchUserBtn">Switch User</button>
      <button class="header-btn header-btn--outline" id="logoutBtn">Logout</button>
      <span class="header-user">&#128100; ${user.displayName}</span>
      <span class="header-notif ${unreadCount > 0 ? 'header-notif--active' : ''}" title="${unreadCount} unread ticket${unreadCount !== 1 ? 's' : ''}">
        <span class="header-notif-icon">⚡</span>
        ${unreadCount > 0 ? `<span class="header-notif-count">${unreadCount > 99 ? '99+' : unreadCount}</span>` : ''}
      </span>
      <span class="header-notif ${commentCount > 0 ? 'header-notif--active' : ''}" title="${commentCount} new message${commentCount !== 1 ? 's' : ''}">
        <span class="header-notif-icon">💬</span>
        ${commentCount > 0 ? `<span class="header-notif-count">${commentCount > 99 ? '99+' : commentCount}</span>` : ''}
      </span>`;
    document.getElementById('switchUserBtn').addEventListener('click', () => openLoginModal());
    document.getElementById('workflowBtn').addEventListener('click', isOnWorkflow ? renderHome : renderWorkflow);
    document.getElementById('logoutBtn').addEventListener('click', () => {
      clearCurrentUser();
      updateHeader();
      renderHome();
    });
  }
}

// ── Read / unread tracking ─────────────────────

function getReadMap() {
  return JSON.parse(localStorage.getItem('asd_read') || '{}');
}

function isTicketRead(ticketId, username) {
  return (getReadMap()[username] || []).includes(ticketId);
}

function markTicketRead(ticketId, username) {
  const map = getReadMap();
  if (!map[username]) map[username] = [];
  if (!map[username].includes(ticketId)) map[username].push(ticketId);
  localStorage.setItem('asd_read', JSON.stringify(map));
}

function markTicketUnread(ticketId, username) {
  const map = getReadMap();
  if (!map[username]) return;
  map[username] = map[username].filter(id => id !== ticketId);
  localStorage.setItem('asd_read', JSON.stringify(map));
}

function getUnreadQueueCount(user) {
  const tickets = JSON.parse(localStorage.getItem('asd_tickets') || '[]');
  const queue = user.role === 'admin'
    ? tickets
    : tickets.filter(t => t.assignedTo === user.username || (t.participants || []).includes(user.username));
  return queue.filter(t => !isTicketRead(t.id, user.username)).length;
}

function getCommentReadMap() {
  return JSON.parse(localStorage.getItem('asd_comment_read') || '{}');
}

function getSeenCommentCount(ticketId, username) {
  return ((getCommentReadMap()[username] || {})[ticketId]) ?? -1;
}

function markCommentsRead(ticketId, username, count) {
  const map = getCommentReadMap();
  if (!map[username]) map[username] = {};
  map[username][ticketId] = count;
  localStorage.setItem('asd_comment_read', JSON.stringify(map));
}

function hasNewComments(ticket, username) {
  const seen = getSeenCommentCount(ticket.id, username);
  return (ticket.comments || []).length > seen;
}

function getNewCommentCount(user) {
  const tickets = JSON.parse(localStorage.getItem('asd_tickets') || '[]');
  const visible = user.role === 'admin'
    ? tickets
    : tickets.filter(t =>
        t.assignedTo === user.username ||
        (t.participants || []).includes(user.username) ||
        t.createdBy === user.username);
  return visible.filter(t => hasNewComments(t, user.username)).length;
}

// ── Ticket helpers ─────────────────────────────

const TICKET_TYPE_LABELS = {
  'achievement':         'Achievement',
  'refer':               'Refer (Fail)',
  'gateway':             'Gateway to EPA',
  'bil':                 'Break in Learning',
  'rtl':                 'Return to Learning',
  'withdrawal':          'Withdrawal',
  'new-enrolment':       'New Learner Enrolment',
  'role-suitability':    'Role Suitability Concern',
  'commitment-concern':  'Commitment Concern',
  'technical-mentor':    'Technical Mentor Request',
  'curriculum-feedback': 'Curriculum Feedback',
  'platform-request':    'Platform Request',
  'system-support':      'System Support',
  'other':               'Other',
};

const STATUS_LABELS = {
  'open':            'Open',
  'in-progress':     'In Progress',
  'awaiting-review': 'Awaiting Review',
  'solved':          'Solved',
};

function generateTicketId() {
  const tickets = JSON.parse(localStorage.getItem('asd_tickets') || '[]');
  if (!tickets.length) return 'ASD-001';
  const nums = tickets
    .map(t => parseInt((t.id || '').replace('ASD-', ''), 10))
    .filter(n => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return 'ASD-' + String(max + 1).padStart(3, '0');
}

function saveTicket(data) {
  const user = getCurrentUser();
  const tickets = JSON.parse(localStorage.getItem('asd_tickets') || '[]');
  tickets.push({
    id: generateTicketId(),
    createdBy: user ? user.username : 'unknown',
    assignedTo: 'Manager',
    participants: [],
    comments: [],
    ...data,
    status: 'open',
  });
  localStorage.setItem('asd_tickets', JSON.stringify(tickets));
}

function getTicket(id) {
  return (JSON.parse(localStorage.getItem('asd_tickets') || '[]')).find(t => t.id === id) || null;
}

function updateTicket(id, updates) {
  const tickets = JSON.parse(localStorage.getItem('asd_tickets') || '[]');
  const idx = tickets.findIndex(t => t.id === id);
  if (idx === -1) return null;
  tickets[idx] = { ...tickets[idx], ...updates };
  localStorage.setItem('asd_tickets', JSON.stringify(tickets));
  return tickets[idx];
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return isNaN(d) ? dateStr : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${date} at ${time}`;
}

function renderTicketFields(ticket) {
  const rows = [];
  const add = (label, val) => { if (val) rows.push([label, val]); };

  add('Learner Name',   ticket.learnerName);
  add('Employer Name',  ticket.employerName);
  add('Standard',       ticket.standard);

  switch (ticket.type) {
    case 'achievement':       add('Outcome', ticket.outcome); break;
    case 'bil':               add('Last Day of Learning', formatDate(ticket.ldol));
                              add('Expected Return to Learning', formatDate(ticket.expectedRtl)); break;
    case 'rtl':               add('Actual Return to Learning', formatDate(ticket.actualRtl)); break;
    case 'withdrawal':        add('Last Day of Learning', formatDate(ticket.ldol));
                              add('Withdrawal Reason', ticket.withdrawalReason); break;
    case 'gateway':           add('OTJ Confirmed', 'Yes'); break;
    case 'new-enrolment':     add('Planned Start Date', formatDate(ticket.plannedStartDate)); break;
    case 'technical-mentor':  add('Area of Support', ticket.supportArea); break;
    case 'curriculum-feedback': add('Feedback Type', ticket.feedbackType); break;
    case 'platform-request':  add('Request Type', ticket.requestType); break;
    case 'system-support':    add('System Affected', ticket.systemAffected);
                              add('Issue Type', ticket.issueType); break;
    case 'other':             add('Subject', ticket.subject); break;
  }

  add('Details',          ticket.details);
  add('Additional Notes', ticket.notes);

  return rows.map(([label, val]) => `
    <div class="detail-row">
      <span class="detail-label">${label}</span>
      <span class="detail-value">${val}</span>
    </div>`).join('');
}

// ── Workflow view ──────────────────────────────

function renderWorkflow(tab, statusFilter) {
  tab = tab || 'queue';
  statusFilter = statusFilter || 'all';
  _currentView = 'workflow';
  updateHeader();
  const user = getCurrentUser();
  if (!user) { openLoginModal(() => renderWorkflow(tab, statusFilter)); return; }

  const isAdmin = user.role === 'admin';
  let tickets = JSON.parse(localStorage.getItem('asd_tickets') || '[]');

  const baseTickets = isAdmin
    ? tickets
    : tab === 'queue'
      ? tickets.filter(t => t.assignedTo === user.username || (t.participants || []).includes(user.username))
      : tickets.filter(t => t.createdBy === user.username);

  const statusCounts = {
    all:               baseTickets.length,
    'open':            baseTickets.filter(t => (t.status || 'open') === 'open').length,
    'in-progress':     baseTickets.filter(t => t.status === 'in-progress').length,
    'awaiting-review': baseTickets.filter(t => t.status === 'awaiting-review').length,
    'solved':          baseTickets.filter(t => t.status === 'solved').length,
  };

  const tabTickets = [...(statusFilter !== 'all' ? baseTickets.filter(t => t.status === statusFilter) : baseTickets)]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filterBtns = ['all', 'open', 'in-progress', 'awaiting-review', 'solved'].map(s => `
    <button class="filter-btn ${statusFilter === s ? 'filter-btn--active' : ''}" data-status="${s}">
      ${s === 'all' ? 'All' : STATUS_LABELS[s]}<span class="filter-count">${statusCounts[s]}</span>
    </button>`).join('');

  const colCount = isAdmin ? 7 : 6;
  const isQueueView = isAdmin || tab === 'queue';
  const rows = tabTickets.length ? tabTickets.map(t => {
    const unread = isQueueView && !isTicketRead(t.id, user.username);
    const newComment = hasNewComments(t, user.username);
    const highlight = unread || newComment;
    return `
    <tr class="ticket-row${highlight ? ' ticket-row--unread' : ''}" data-search="${[t.id, t.learnerName, t.employerName, t.createdBy].filter(Boolean).join(' ').toLowerCase()}">
      <td class="ticket-id ticket-id--link" data-id="${t.id}" data-origin="${isAdmin ? 'queue' : tab}">${t.id || '—'}</td>
      <td>${TICKET_TYPE_LABELS[t.type] || t.type || '—'}</td>
      <td>${t.learnerName || '—'}</td>
      ${isAdmin ? `<td>${t.createdBy || '—'}</td>` : ''}
      <td>${formatDateTime(t.createdAt)}</td>
      <td>${t.comments && t.comments.length ? formatDateTime(t.comments[t.comments.length - 1].createdAt) : '—'}</td>
      <td><span class="status-badge status-badge--${t.status || 'open'}">${STATUS_LABELS[t.status] || 'Open'}</span></td>
    </tr>`;
  }).join('') :
    `<tr><td colspan="${colCount}" class="ticket-empty">No tickets found.</td></tr>`;

  const tabsHTML = isAdmin ? '' : `
    <div class="workflow-tabs">
      <button class="tab-btn ${tab === 'queue' ? 'tab-btn--active' : ''}" data-tab="queue">Queue</button>
      <button class="tab-btn ${tab === 'requests' ? 'tab-btn--active' : ''}" data-tab="requests">Requests Made</button>
    </div>`;

  document.getElementById('view').innerHTML = `
    <section class="workflow-header">
      <h1 class="hero-title">My Workflow</h1>
      <p class="hero-subtitle">Welcome back, ${user.displayName}</p>
    </section>
    ${tabsHTML}
    <div class="search-bar">
      <input class="ticket-search" id="ticketSearch" type="search" placeholder="Search by ticket ID, learner name, employer or raised by…" />
    </div>
    <div class="filter-bar">${filterBtns}</div>
    <div class="ticket-table-wrap">
      <table class="ticket-table">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Type</th>
            <th>Learner Name</th>
            ${isAdmin ? '<th>Raised By</th>' : ''}
            <th>Date Raised</th>
            <th>Last Comment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="ticketTbody">${rows}</tbody>
      </table>
    </div>`;

  if (!isAdmin) {
    document.querySelectorAll('.tab-btn').forEach(btn =>
      btn.addEventListener('click', () => renderWorkflow(btn.dataset.tab, statusFilter)));
  }
  document.querySelectorAll('.filter-btn').forEach(btn =>
    btn.addEventListener('click', () => renderWorkflow(tab, btn.dataset.status)));
  document.querySelectorAll('.ticket-id--link').forEach(cell =>
    cell.addEventListener('click', () => renderTicketDetail(cell.dataset.id, cell.dataset.origin)));

  document.getElementById('ticketSearch').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    let anyVisible = false;
    document.querySelectorAll('#ticketTbody .ticket-row').forEach(row => {
      const match = !q || row.dataset.search.includes(q);
      row.style.display = match ? '' : 'none';
      if (match) anyVisible = true;
    });
    let noResults = document.getElementById('noSearchResults');
    if (!anyVisible && q) {
      if (!noResults) {
        const tr = document.createElement('tr');
        tr.id = 'noSearchResults';
        tr.innerHTML = `<td colspan="${colCount}" class="ticket-empty">No tickets match your search.</td>`;
        document.getElementById('ticketTbody').appendChild(tr);
      }
    } else if (noResults) {
      noResults.remove();
    }
  });
}

// ── Ticket detail view ─────────────────────────

function renderTicketDetail(ticketId, origin) {
  const ticket = getTicket(ticketId);
  if (!ticket) { renderWorkflow(origin); return; }
  const user = getCurrentUser();
  if (user) {
    markTicketRead(ticketId, user.username);
    markCommentsRead(ticketId, user.username, (ticket.comments || []).length);
  }
  _currentView = 'workflow';
  updateHeader();

  const canManage = user && (user.role === 'manager' || user.role === 'admin');

  const assigneeHTML = canManage
    ? `<select class="form-select" id="assigneeSelect">
        ${USERS.map(u => `<option value="${u.username}" ${ticket.assignedTo === u.username ? 'selected' : ''}>${u.displayName}</option>`).join('')}
       </select>`
    : `<p class="detail-value">${ticket.assignedTo || '—'}</p>`;

  const existingParticipants = ticket.participants || [];
  const participantChips = existingParticipants.length
    ? existingParticipants.map(p => `
        <span class="participant-chip">${p}
          <button class="participant-remove" data-name="${p}" title="Remove">&times;</button>
        </span>`).join('')
    : `<span class="detail-value-muted">No participants yet.</span>`;

  const availableToAdd = USERS.filter(u => !existingParticipants.includes(u.username));
  const addParticipantHTML = availableToAdd.length ? `
    <div class="participant-add-row">
      <select class="form-select form-select--sm" id="participantSelect">
        <option value="">Add participant…</option>
        ${availableToAdd.map(u => `<option value="${u.username}">${u.displayName}</option>`).join('')}
      </select>
      <button class="btn-sm" id="addParticipantBtn">Add</button>
    </div>` : '';

  const commentsHTML = (ticket.comments || []).length
    ? (ticket.comments || []).map(c => `
        <div class="comment">
          <div class="comment-meta">
            <span class="comment-author">${c.author}</span>
            <span class="comment-time">${formatDateTime(c.createdAt)}</span>
          </div>
          <div class="comment-body">${c.text}</div>
        </div>`).join('')
    : `<p class="no-comments">No comments yet.</p>`;

  const statusPanelHTML = canManage ? `
    <div class="detail-panel">
      <h3 class="detail-panel-title">Status</h3>
      <select class="form-select" id="statusSelect">
        ${Object.entries(STATUS_LABELS).map(([k, v]) => `<option value="${k}" ${ticket.status === k ? 'selected' : ''}>${v}</option>`).join('')}
      </select>
    </div>` : '';

  document.getElementById('view').innerHTML = `
    <div class="back-bar">
      <button class="back-btn" id="backBtn">&larr; Back to ${origin === 'queue' ? 'Queue' : 'Requests Made'}</button>
      ${user ? `<button class="btn-sm btn-sm--ghost" id="markUnreadBtn">Mark as unread</button>` : ''}
    </div>
    <div class="ticket-detail-header">
      <div class="ticket-detail-header-top">
        <span class="ticket-detail-id">${ticket.id}</span>
        <span class="status-badge status-badge--${ticket.status || 'open'}">${STATUS_LABELS[ticket.status] || 'Open'}</span>
      </div>
      <h1 class="ticket-detail-title">${TICKET_TYPE_LABELS[ticket.type] || ticket.type}</h1>
      <p class="ticket-detail-meta">Raised by <strong>${ticket.createdBy}</strong> · ${formatDateTime(ticket.createdAt)}</p>
    </div>
    <div class="ticket-detail-body">
      <div class="ticket-detail-main">
        <div class="detail-panel">
          <h3 class="detail-panel-title">Ticket Details</h3>
          ${renderTicketFields(ticket)}
        </div>
        <div class="detail-panel">
          <h3 class="detail-panel-title">Comments</h3>
          <div class="comments-list" id="commentsList">${commentsHTML}</div>
          ${user ? `
          <div class="comment-form">
            <textarea class="form-textarea" id="commentText" placeholder="Add a comment…"></textarea>
            <div class="form-actions">
              <button class="btn-submit" id="addCommentBtn">Post Comment</button>
            </div>
          </div>` : ''}
        </div>
      </div>
      <div class="ticket-detail-sidebar">
        <div class="detail-panel">
          <h3 class="detail-panel-title">Assignee</h3>
          ${assigneeHTML}
        </div>
        <div class="detail-panel">
          <h3 class="detail-panel-title">Participants</h3>
          <div class="participants-list">${participantChips}</div>
          ${addParticipantHTML}
        </div>
        ${statusPanelHTML}
      </div>
    </div>`;

  document.getElementById('backBtn').addEventListener('click', () => renderWorkflow(origin));

  if (user) {
    document.getElementById('addCommentBtn').addEventListener('click', () => {
      const text = document.getElementById('commentText').value.trim();
      if (!text) return;
      const fresh = getTicket(ticketId);
      const comments = [...(fresh.comments || []), { author: user.displayName, text, createdAt: new Date().toISOString() }];
      updateTicket(ticketId, { comments });
      renderTicketDetail(ticketId, origin);
    });
  }

  if (canManage) {
    document.getElementById('assigneeSelect').addEventListener('change', e =>
      updateTicket(ticketId, { assignedTo: e.target.value }));
    document.getElementById('statusSelect').addEventListener('change', e =>
      updateTicket(ticketId, { status: e.target.value }));
  }

  const addBtn = document.getElementById('addParticipantBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const val = document.getElementById('participantSelect').value;
      if (!val) return;
      const fresh = getTicket(ticketId);
      const participants = [...(fresh.participants || [])];
      if (!participants.includes(val)) participants.push(val);
      updateTicket(ticketId, { participants });
      renderTicketDetail(ticketId, origin);
    });
  }

  document.querySelectorAll('.participant-remove').forEach(btn =>
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const fresh = getTicket(ticketId);
      updateTicket(ticketId, { participants: (fresh.participants || []).filter(p => p !== name) });
      renderTicketDetail(ticketId, origin);
    }));

  const markUnreadBtn = document.getElementById('markUnreadBtn');
  if (markUnreadBtn) {
    markUnreadBtn.addEventListener('click', () => {
      markTicketUnread(ticketId, user.username);
      renderWorkflow(origin);
    });
  }
}

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
  _currentView = 'home';
  updateHeader();
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
    if (card.dataset.id === 'other') requireLogin(renderFormOther);
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
    if (card.dataset.id === 'achievement') requireLogin(renderFormAchievement);
    if (card.dataset.id === 'refer') requireLogin(renderFormRefer);
    if (card.dataset.id === 'gateway') requireLogin(renderFormGateway);
    if (card.dataset.id === 'bil') requireLogin(renderFormBIL);
    if (card.dataset.id === 'rtl') requireLogin(renderFormRTL);
    if (card.dataset.id === 'withdrawal') requireLogin(renderFormWithdrawal);
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
    if (card.dataset.id === 'new-enrolment') requireLogin(renderFormNewEnrolment);
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
    if (card.dataset.id === 'role-suitability') requireLogin(() => renderFormSuitability('role-suitability', 'New Learner Suitability Concern: Role Suitability'));
    if (card.dataset.id === 'commitment-concern') requireLogin(() => renderFormSuitability('commitment-concern', 'New Learner Suitability Concern: Commitment Concern'));
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
    if (card.dataset.id === 'technical-mentor')    requireLogin(renderFormTechnicalMentor);
    if (card.dataset.id === 'curriculum-feedback') requireLogin(renderFormCurriculumFeedback);
    if (card.dataset.id === 'platform-request')    requireLogin(renderFormPlatformRequest);
    if (card.dataset.id === 'system-support')      requireLogin(renderFormSystemSupport);
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
    saveTicket(data);
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
    saveTicket(data);
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
    saveTicket(data);
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
    saveTicket(data);
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
    saveTicket(data);
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
    saveTicket(data);
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
    saveTicket(data);
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
    saveTicket(data);
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
    saveTicket(data);
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
    saveTicket(data);
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
    saveTicket(data);
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
    saveTicket(data);
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
    saveTicket(data);
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

document.addEventListener('DOMContentLoaded', () => {
  updateHeader();
  renderHome();

  document.getElementById('userSelectList').addEventListener('click', (e) => {
    const btn = e.target.closest('.user-select-btn');
    if (!btn) return;
    const user = USERS.find(u => u.username === btn.dataset.username);
    if (!user) return;
    setCurrentUser(user);
    closeLoginModal();
    updateHeader();
    if (_loginCallback) { const cb = _loginCallback; _loginCallback = null; cb(); }
  });

  document.getElementById('homeLink').addEventListener('click', renderHome);
  document.getElementById('loginModalClose').addEventListener('click', closeLoginModal);
  document.getElementById('loginModal').addEventListener('click', (e) => {
    if (e.target.id === 'loginModal') closeLoginModal();
  });
});
