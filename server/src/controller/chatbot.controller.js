const express = require('express');
const router = express.Router();
const axios = require('axios');
const OpenAI = require('openai');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// Example FAQs and mock data
const faqs = [
  { q: /score|last result|my score/i, a: "Your last quiz score was 8 out of 10." },
  { q: /leaderboard|top/i, a: "The top scorer is Alice with 95 points." },
  { q: /badge|badges/i, a: "You have earned 3 badges: HTML, CSS, and JavaScript." },
  { q: /certificate/i, a: "You can download your certificate from your profile after passing a quiz." },
  { q: /how.*quiz|rules/i, a: "Each quiz consists of 10 questions. You need at least 60% to pass." },
  { q: /contact|support/i, a: "You can contact support via the Contact page." },
  { q: /feedback/i, a: "We value your feedback! Use the Feedback page to share your thoughts." },
  { q: /hi|hello|hey/i, a: "Hello! How can I help you with your quizzes today?" },
];

// Function to search Google Custom Search API
async function googleSearch(query) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CSE_ID;
  if (!apiKey || !cx) return null;
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`;
  try {
    const response = await axios.get(url);
    const items = response.data.items;
    if (items && items.length > 0) {
      // Return the first result's snippet and link
      return `${items[0].title}: ${items[0].snippet} (${items[0].link})`;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Function to get answer from OpenAI
async function openaiChat(question) {
  if (!process.env.OPENAI_API_KEY) return null;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful quiz assistant.' },
        { role: 'user', content: question }
      ],
      max_tokens: 100
    });
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API error:', error);
    if (error.response) {
      console.error('OpenAI API error response data:', error.response.data);
    }
    return null;
  }
}

// Function to get answer from Gemini API
async function geminiChat(question) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  try {
    const response = await axios.post(url, {
      contents: [
        {
          parts: [
            { text: question }
          ]
        }
      ]
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    // Extract the response text
    const candidates = response.data.candidates;
    if (candidates && candidates.length > 0) {
      return candidates[0].content.parts[0].text;
    }
    return null;
  } catch (error) {
    console.error('Gemini API error:', error);
    if (error.response) {
      console.error('Gemini API error response data:', error.response.data);
    }
    return null;
  }
}

router.post('/', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.json({ answer: "Please ask a question." });
  for (const faq of faqs) {
    if (faq.q.test(question)) {
      return res.json({ answer: faq.a });
    }
  }
  // Gemini fallback
  console.log('Gemini fallback triggered for question:', question);
  const geminiAnswer = await geminiChat(question);
  console.log('Gemini response:', geminiAnswer);
  if (geminiAnswer) {
    return res.json({ answer: geminiAnswer });
  }
  // Default fallback
  res.json({ answer: "Sorry, I don't know the answer to that yet. Try asking about your score, badges, or the leaderboard!" });
});

module.exports = router; 