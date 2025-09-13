import google.generativeai as genai
from app.core.config import settings

class GeminiService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')
    
    async def generate_response(self, message: str) -> str:
        try:
            response = self.model.generate_content(message)
            return response.text
        except Exception as e:
            raise Exception(f"Failed to generate response: {str(e)}")
    
    async def generate_chat_response(self, messages: list) -> str:
        try:
            chat = self.model.start_chat(history=[])
            
            for msg in messages:
                chat.send_message(msg['content'])
            
            response = chat.send_message(messages[-1]['content'])
            return response.text
        except Exception as e:
            raise Exception(f"Failed to generate chat response: {str(e)}")