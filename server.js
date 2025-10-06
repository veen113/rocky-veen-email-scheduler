const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const emailSchedulerRoutes = require('./routes/email-scheduler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/email', emailSchedulerRoutes);

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the email scheduler page
app.get('/email-scheduler', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'email-scheduler.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Rocky Veen Email Scheduler running on port ${PORT}`);
    console.log(`📧 Email Scheduler available at: http://localhost:${PORT}/email-scheduler`);
    console.log(`✨ Ready to send collaboration emails!`);
});
