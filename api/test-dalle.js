export default async function handler(req, res) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    // 最もシンプルなテスト
    const response = await fetch(
      'https://api.openai.com/v1/images/generations',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: 'A simple red circle on white background',
          n: 1,
          size: '1024x1024'
        })
      }
    );
    
    const responseText = await response.text();
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'DALL-E API error',
        status: response.status,
        details: responseText
      });
    }
    
    const data = JSON.parse(responseText);
    res.status(200).json({
      success: true,
      imageUrl: data.data?.[0]?.url,
      fullResponse: data
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Test failed',
      message: error.message,
      stack: error.stack
    });
  }
}