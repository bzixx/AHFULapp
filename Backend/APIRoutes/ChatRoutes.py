from flask import Flask, Blueprint, render_template, request, jsonify
from google.adk.runners import InMemoryRunner
from google.genai import types
import character
import asyncio
import os

chatRouteBlueprint = Blueprint("chat", __name__,  url_prefix="/AHFULChat")

adk_session = None
session_lock = asyncio.Lock()

runner = InMemoryRunner(
    agent=character.root_agent,
    app_name="Demo App",
)

@chatRouteBlueprint.route("/", methods=["POST"])
async def chat():
    user_message = request.json.get("message")

    global adk_session
    if adk_session is None:
        async with session_lock:
            if adk_session is None:
                adk_session = await runner.session_service.create_session(
                    app_name=runner.app_name, user_id="inapp_user"
                )

    content = types.Content(parts=[types.Part(text=user_message)])
    response_text = ""
    async for event in runner.run_async(
        user_id=adk_session.user_id,
        session_id=adk_session.id,
        new_message=content,
    ):
        if event.content and event.content.parts and event.content.parts[0].text:
            response_text += event.content.parts[0].text

    return jsonify({'response': response_text})