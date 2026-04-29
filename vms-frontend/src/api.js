const BASE = 'http://localhost:8081/api';

// ── Visitors ──────────────────────────────────────────────

export async function getAllVisitors(status) {
    const url = status ? `${BASE}/visitors?status=${status}` : `${BASE}/visitors`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch visitors');
    return res.json();
}

export async function checkInVisitor(visitorData, photoFile) {
    const form = new FormData();
    form.append('visitor', new Blob([JSON.stringify(visitorData)], {
        type: 'application/json'
    }));
    if (photoFile) form.append('photo', photoFile);

    const res = await fetch(`${BASE}/visitors/checkin`, {
        method: 'POST',
        body: form
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(JSON.stringify(err));
    }
    return res.json();
}

export async function updateVisitorStatus(id, status) {
    const res = await fetch(`${BASE}/visitors/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status
        }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
}

export async function deleteVisitor(id) {
    const res = await fetch(`${BASE}/visitors/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete visitor');
}

export async function getAnalytics() {
    const res = await fetch(`${BASE}/visitors/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
}

export async function getVisitorsByDate(date) {
    const res = await fetch(`${BASE}/visitors/by-date?date=${date}`);
    if (!res.ok) throw new Error('Failed to fetch visitors by date');
    return res.json();
}

// ── Feedback ──────────────────────────────────────────────

export async function getAllFeedback() {
    const res = await fetch(`${BASE}/feedback`);
    if (!res.ok) throw new Error('Failed to fetch feedback');
    return res.json();
}

export async function submitFeedback(data) {
    const res = await fetch(`${BASE}/feedback`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit feedback');
    return res.json();
}

export async function deleteFeedback(id) {
    const res = await fetch(`${BASE}/feedback/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete feedback');
}

export async function getFeedbackStats() {
    const res = await fetch(`${BASE}/feedback/stats`);
    if (!res.ok) throw new Error('Failed to fetch feedback stats');
    return res.json();
}