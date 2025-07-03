// Vercel用APIクライアント - より簡潔で使いやすい
class APIClient {
    constructor() {
        // Vercelでは相対パスでOK（同じドメインなので）
        this.baseURL = '/api';
    }

    async callAPI(endpoint, data) {
        try {
            console.log(`API呼び出し: ${endpoint}`, data);
            
            const response = await fetch(`${this.baseURL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            console.log(`API応答 ${endpoint}: status=${response.status}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`APIエラー詳細 ${endpoint}:`, errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const result = await response.json();
            console.log(`API成功 ${endpoint}:`, result);
            return result;
        } catch (error) {
            console.error(`API call failed for ${endpoint}:`, error);
            throw error;
        }
    }

    // Gemini APIでメッセージ生成
    async generateMessage(prompt) {
        const response = await this.callAPI('gemini', { prompt });
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        return response.candidates[0].content.parts[0].text;
    }

    // 11Labs APIで音声生成
    async generateVoice(text) {
        const response = await this.callAPI('elevenlabs', { text });
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        // Base64エンコードされた音声データをAudio要素で再生可能な形式に変換
        return `data:audio/mpeg;base64,${response.audio}`;
    }

    // OpenAI DALL-E 3でイラスト生成
    async generateImage(prompt) {
        const response = await this.callAPI('openai', { prompt });
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        return response.data[0].url;
    }
}

// グローバルに利用可能にする
window.apiClient = new APIClient();