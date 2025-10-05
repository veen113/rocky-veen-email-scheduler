// Global variables
let currentAccounts = [];

// DOM elements
const searchForm = document.getElementById('searchForm');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultsSection = document.getElementById('resultsSection');
const accountsList = document.getElementById('accountsList');
const exportResultsBtn = document.getElementById('exportResults');
const accountModal = document.getElementById('accountModal');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    searchForm.addEventListener('submit', handleSearch);
    exportResultsBtn.addEventListener('click', handleExportResults);
    
    // Modal close functionality
    const closeModal = document.querySelector('.close');
    closeModal.addEventListener('click', () => {
        accountModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === accountModal) {
            accountModal.style.display = 'none';
        }
    });
});

// Handle search form submission
async function handleSearch(e) {
    e.preventDefault();
    
    const formData = new FormData(searchForm);
    const searchParams = {
        niche: formData.get('niche'),
        location: formData.get('location'),
        limit: parseInt(formData.get('limit'))
    };
    
    if (!searchParams.niche.trim()) {
        alert('Please enter a business niche');
        return;
    }
    
    showLoading(true);
    hideResults();
    
    try {
        const response = await fetch('/api/instagram/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchParams)
        });
        
        const result = await response.json();
        
        if (result.success) {
            currentAccounts = result.data;
            displayAccounts(currentAccounts);
            showResults();
        } else {
            throw new Error(result.error || 'Search failed');
        }
        
    } catch (error) {
        console.error('Search error:', error);
        alert(`Search failed: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

// Display accounts in the UI
function displayAccounts(accounts) {
    accountsList.innerHTML = '';
    
    if (accounts.length === 0) {
        accountsList.innerHTML = `
            <div class="text-center">
                <p>No business accounts found for this search. Try different keywords or location.</p>
            </div>
        `;
        return;
    }
    
    accounts.forEach((account, index) => {
        const accountCard = createAccountCard(account, index);
        accountsList.appendChild(accountCard);
    });
}

// Create account card element
function createAccountCard(account, index) {
    const card = document.createElement('div');
    card.className = 'account-card fade-in';
    
    const initials = account.username ? account.username.substring(0, 2).toUpperCase() : 'IG';
    const companyName = account.companyName || extractCompanyFromDescription(account.description) || 'Unknown Company';
    
    card.innerHTML = `
        <div class="account-header">
            <div class="account-avatar">${initials}</div>
            <div class="account-info">
                <h3>@${account.username || 'unknown'}</h3>
                <p>${companyName}</p>
            </div>
        </div>
        
        <div class="account-details">
            <p><strong>Description:</strong> ${account.description || 'No description available'}</p>
            <p><strong>Discovered:</strong> ${formatDate(account.discoveredAt)}</p>
            ${account.businessCategory ? `<p><strong>Category:</strong> ${account.businessCategory}</p>` : ''}
        </div>
        
        <div class="account-actions">
            <button class="btn btn-primary btn-small" onclick="viewAccountDetails('${account.username}')">
                <i class="fas fa-eye"></i> View Details
            </button>
            <a href="https://instagram.com/${account.username}" target="_blank" class="btn btn-outline btn-small">
                <i class="fab fa-instagram"></i> Visit Profile
            </a>
        </div>
    `;
    
    return card;
}

// Extract company name from description
function extractCompanyFromDescription(description) {
    if (!description) return null;
    
    const lines = description.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.length > 3 && trimmed.length < 50 && 
            !trimmed.includes('http') && !trimmed.includes('@') && !trimmed.startsWith('#')) {
            return trimmed;
        }
    }
    return null;
}

// View account details in modal
async function viewAccountDetails(username) {
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = '<div class="text-center"><div class="spinner"></div><p>Loading account details...</p></div>';
    accountModal.style.display = 'flex';
    
    try {
        const response = await fetch(`/api/instagram/account/${username}`);
        const result = await response.json();
        
        if (result.success) {
            displayAccountDetailsModal(result.data, username);
        } else {
            throw new Error(result.error || 'Failed to load account details');
        }
    } catch (error) {
        modalBody.innerHTML = `<div class="text-center"><p>Error loading account details: ${error.message}</p></div>`;
    }
}

// Display account details in modal
function displayAccountDetailsModal(details, username) {
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2><i class="fab fa-instagram"></i> @${username}</h2>
        
        <div class="account-details">
            <p><strong>Bio:</strong> ${details.bio || 'No bio available'}</p>
            <p><strong>Followers:</strong> ${details.followers}</p>
            <p><strong>Following:</strong> ${details.following}</p>
            <p><strong>Posts:</strong> ${details.posts}</p>
            
            ${details.isBusinessAccount ? 
                `<p><strong>Account Type:</strong> <span class="status-badge status-business">Business Account</span></p>` :
                `<p><strong>Account Type:</strong> <span class="status-badge status-personal">Personal Account</span></p>`
            }
            
            ${details.businessCategory ? `<p><strong>Business Category:</strong> ${details.businessCategory}</p>` : ''}
            ${details.companyName ? `<p><strong>Company Name:</strong> ${details.companyName}</p>` : ''}
        </div>
        
        <div class="mt-20">
            <a href="https://instagram.com/${username}" target="_blank" class="btn btn-primary">
                <i class="fab fa-instagram"></i> Visit Instagram Profile
            </a>
        </div>
    `;
}

// Handle export results
function handleExportResults() {
    if (currentAccounts.length === 0) {
        alert('No data to export');
        return;
    }
    
    const csvData = generateCSV();
    downloadCSV(csvData, 'instagram-business-accounts.csv');
}

// Generate CSV data
function generateCSV() {
    const headers = ['Username', 'Company Name', 'Description', 'Discovered At', 'Instagram URL'];
    
    const rows = currentAccounts.map(account => {
        const companyName = account.companyName || extractCompanyFromDescription(account.description) || 'Unknown';
        
        return [
            account.username || '',
            companyName,
            (account.description || '').replace(/"/g, '""'),
            account.discoveredAt || '',
            `https://instagram.com/${account.username}`
        ];
    });
    
    const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
    
    return csvContent;
}

// Download CSV file
function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Utility functions
function showLoading(show) {
    loadingIndicator.style.display = show ? 'block' : 'none';
}

function showResults() {
    resultsSection.style.display = 'block';
}

function hideResults() {
    resultsSection.style.display = 'none';
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
}

// Make functions globally available
window.viewAccountDetails = viewAccountDetails;
