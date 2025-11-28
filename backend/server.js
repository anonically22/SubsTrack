const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Routes

// 1. Get all subscriptions for a user
app.get('/api/subscriptions', async (req, res) => {
    const { userId } = req.query; // In a real app, get this from auth token

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('renewal_date', { ascending: true });

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});

// 2. Add a new subscription
app.post('/api/subscriptions', async (req, res) => {
    const { user_id, name, monthly_cost, billing_cycle, start_date, category, color } = req.body;

    // Calculate renewal date (simple logic for MVP)
    const start = new Date(start_date);
    let renewal = new Date(start);
    if (billing_cycle === 'monthly') {
        renewal.setMonth(renewal.getMonth() + 1);
    } else {
        renewal.setFullYear(renewal.getFullYear() + 1);
    }

    const { data, error } = await supabase
        .from('subscriptions')
        .insert([
            {
                user_id,
                name,
                monthly_cost,
                billing_cycle,
                start_date,
                renewal_date: renewal,
                category,
                color
            }
        ])
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data[0]);
});

// 3. Update a subscription
app.put('/api/subscriptions/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data[0]);
});

// 4. Delete a subscription
app.delete('/api/subscriptions/:id', async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Subscription deleted successfully' });
});

// Health Check
app.get('/', (req, res) => {
    res.send('SubsTrack Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
