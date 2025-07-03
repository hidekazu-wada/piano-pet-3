export default function handler(req, res) {
  const envStatus = {
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    ELEVENLABS_API_KEY: !!process.env.ELEVENLABS_API_KEY
  };
  
  res.status(200).json({ 
    status: 'ok', 
    message: 'API is working',
    environment: envStatus,
    timestamp: new Date().toISOString()
  });
}