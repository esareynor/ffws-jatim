"""
WSGI entry point for production deployment
"""
from app import create_app

# Create application instance
gunicorn_app = create_app()

if __name__ == "__main__":
    gunicorn_app.run()

