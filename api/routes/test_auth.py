from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
import jwt
from ..main import app  # Import your FastAPI app
from ..db.session import get_db
from ..db.database_setup import Base, User
from ..core.security import SECRET_KEY, ALGORITHM

# Fixtures for test database and client
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

TEST_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module")
def test_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="module")
def client(test_db):
    def override_get_db():
        try:
            yield test_db
        finally:
            test_db.close()
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

# Tests
def test_register_user_success(client):
    response = client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "securepassword"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "hashed_password" not in data

def test_register_duplicate_email(client):
    # Register the same user again
    response = client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "anotherpassword"
    })
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]

def test_login_success(client):
    # Assume test@example.com is already registered from previous test
    response = client.post("/auth/login", data={
        "username": "test@example.com",
        "password": "securepassword"
    })
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    # Decode token to verify payload
    token = token_data["access_token"]
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    assert payload["sub"] == "test@example.com"

def test_login_invalid_email(client):
    response = client.post("/auth/login", data={
        "username": "wrong@example.com",
        "password": "securepassword"
    })
    assert response.status_code == 400
    assert "Invalid credentials" in response.json()["detail"]

def test_login_invalid_password(client):
    response = client.post("/auth/login", data={
        "username": "test@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 400
    assert "Invalid credentials" in response.json()["detail"]