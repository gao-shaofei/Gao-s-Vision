"""Greeting helpers for the hello-codex v1 project."""


def build_greeting(name: str) -> str:
    """Return a friendly greeting for the provided name."""
    cleaned = name.strip() or "World"
    return f"Hello, {cleaned}!"
