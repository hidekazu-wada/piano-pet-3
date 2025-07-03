export default async function handler(req, res) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    // APIキーの検証
    const response = await fetch(
      'https://api.openai.com/v1/models',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: 'API key validation failed',
        details: errorData
      });
    }
    
    const data = await response.json();
    res.status(200).json({ 
      status: 'API key is valid',
      models: data.data.map(m => m.id).slice(0, 5) // 最初の5つのモデル
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Test failed',
      message: error.message 
    });
  }
}