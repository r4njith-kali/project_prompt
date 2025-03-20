from typing import Dict, Optional
import openai
from app.models.models import FAQ
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

class ChatHandler:
    def __init__(self, api_key: Optional[str] = None):
        if api_key:
            openai.api_key = api_key
        self.context = []
        self.max_context_length = 5

    async def get_faq_response(self, db: AsyncSession, query: str) -> Optional[str]:
        # Search for matching FAQ
        async with db as session:
            result = await session.execute(
                select(FAQ).where(FAQ.question.ilike(f"%{query}%"))
            )
            faq = result.scalar_one_or_none()
            
            if faq:
                return faq.answer
        return None

    async def generate_response(self, query: str, db: AsyncSession) -> Dict:
        # First check FAQ database
        faq_response = await self.get_faq_response(db, query)
        if faq_response:
            return {
                "message": faq_response,
                "type": "faq",
                "data": {"source": "FAQ Database"}
            }

        # If no FAQ match, use OpenAI API
        try:
            # Add the new query to context
            self.context.append({"role": "user", "content": query})
            
            # Maintain context window
            if len(self.context) > self.max_context_length:
                self.context = self.context[-self.max_context_length:]

            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful technical support assistant."},
                    *self.context
                ]
            )

            ai_response = response.choices[0].message.content
            self.context.append({"role": "assistant", "content": ai_response})

            return {
                "message": ai_response,
                "type": "ai",
                "data": {"model": "gpt-4"}
            }

        except Exception as e:
            # Fallback to a default response if AI fails
            return {
                "message": "I apologize, but I'm having trouble processing your request. Please try again later or contact human support.",
                "type": "error",
                "data": {"error": str(e)}
            }

    def reset_context(self):
        """Reset the conversation context"""
        self.context = [] 