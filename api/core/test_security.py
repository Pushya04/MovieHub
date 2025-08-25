import pytest
from datetime import timedelta
from .security import (  # ✅ Use absolute imports
    get_password_hash,
    verify_password,
    create_access_token,
    decode_access_token
)

SECRET_KEY = "Nhreddy@7995881607"  
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# ✅ Test Password Hashing
def test_password_hashing():
    password = "mysecurepassword"
    hashed_password = get_password_hash(password)
    
    assert hashed_password != password  # Hash should be different
    assert verify_password(password, hashed_password)  # Should return True

    wrong_password = "wrongpassword"
    assert not verify_password(wrong_password, hashed_password)  # Should return False

# ✅ Test JWT Token Creation & Decoding
def test_jwt_token():
    data = {"sub": "testuser@example.com"}
    
    # Generate token
    token = create_access_token(data, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    assert isinstance(token, str)  # Token should be a string

    # Decode token
    decoded_data = decode_access_token(token)
    assert decoded_data.username == "testuser@example.com"  # Should match the original username

# ✅ Test Expired Token (should raise an exception)
def test_expired_token():
    expired_data = {"sub": "testuser@example.com"}
    expired_token = create_access_token(expired_data, expires_delta=timedelta(seconds=-1))  # Already expired

    with pytest.raises(Exception):  # Expect an exception when decoding an expired token
        decode_access_token(expired_token)
