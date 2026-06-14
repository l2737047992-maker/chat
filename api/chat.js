export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只支持 POST' });
    }

    try {
        const { messages } = req.body;

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: messages,
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            return res.status(200).json({ reply: data.choices[0].message.content });
        } else {
            return res.status(500).json({ error: 'API 返回异常', detail: data });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}