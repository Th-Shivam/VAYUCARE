import logging
import httpx
import jwt
from jwt.algorithms import RSAAlgorithm
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any, Optional
from pydantic import BaseModel

from app.config.settings import settings

logger = logging.getLogger("vayu.auth")

# Security scheme to extract Bearer token from Authorization header
security = HTTPBearer(auto_error=False)

class UserSession(BaseModel):
    userId: str
    email: Optional[str] = None
    claims: Dict[str, Any]

class ClerkJWTValidator:
    def __init__(self, jwks_url: str):
        self.jwks_url = jwks_url
        self.jwks_cache: Dict[str, Any] = {}
        self.client = httpx.AsyncClient()

    async def fetch_jwks(self) -> Dict[str, Any]:
        """Fetch the JSON Web Key Set (JWKS) from Clerk."""
        try:
            response = await self.client.get(self.jwks_url)
            response.raise_for_status()
            jwks = response.json()
            # Cache keys by their key ID (kid)
            self.jwks_cache = {key["kid"]: key for key in jwks.get("keys", [])}
            logger.info("Successfully fetched and cached Clerk JWKS.")
            return self.jwks_cache
        except Exception as e:
            logger.error(f"Failed to fetch Clerk JWKS from {self.jwks_url}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Authentication service unavailable"
            )

    async def get_public_key(self, kid: str) -> Any:
        """Get the public key matching the key ID (kid)."""
        if kid not in self.jwks_cache:
            # Refresh cache if key ID not found
            await self.fetch_jwks()
        
        jwk = self.jwks_cache.get(kid)
        if not jwk:
            logger.error(f"JWK with kid '{kid}' not found in cached JWKS.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token signing key"
            )
        
        return RSAAlgorithm.from_jwk(jwk)

    async def validate_token(self, token: str) -> Dict[str, Any]:
        """Validate the JWT token signature, expiration, and return claims."""
        try:
            # Unverified decode to extract the header and key ID (kid)
            unverified_header = jwt.get_unverified_header(token)
            kid = unverified_header.get("kid")
            if not kid:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token header: missing kid"
                )

            # Get the public key
            public_key = await self.get_public_key(kid)

            # Verify and decode the token
            # Note: Clerk tokens might not have an audience claim by default,
            # so we disable audience verification unless explicitly required.
            payload = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                options={"verify_aud": False}
            )
            return payload

        except jwt.ExpiredSignatureError:
            logger.warning("Token has expired.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid token: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error during token validation: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )

# Instantiate the global validator
clerk_validator = ClerkJWTValidator(settings.CLERK_JWKS_URL)

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> UserSession:
    """
    FastAPI dependency to secure endpoints.
    Verifies the Clerk JWT and returns a UserSession object.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )
    
    if credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication scheme"
        )

    payload = await clerk_validator.validate_token(credentials.credentials)
    
    # Extract Clerk User ID (sub)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload is missing subject (sub) claim"
        )
    
    # Extract email if present in claims
    # Clerk JWT templates can be customized to include email, but by default may not,
    # so we check common claims (email, emails, or email_address)
    email = payload.get("email") or payload.get("email_address")
    
    return UserSession(
        userId=user_id,
        email=email,
        claims=payload
    )
