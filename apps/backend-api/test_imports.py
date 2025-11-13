#!/usr/bin/env python3
"""Test all GraphQL imports"""

import sys
sys.path.insert(0, 'src')

def test_imports():
    """Test all critical imports"""
    errors = []
    
    # Test strawberry
    try:
        import strawberry
        print("✓ strawberry imported")
    except ImportError as e:
        errors.append(f"strawberry: {e}")
        print(f"✗ strawberry import failed: {e}")
    
    # Test GraphQL types
    try:
        from src.graphql.tenants.sys.users.types import TenantUser
        print("✓ TenantUser type imported")
    except ImportError as e:
        errors.append(f"TenantUser: {e}")
        print(f"✗ TenantUser import failed: {e}")
    
    # Test queries
    try:
        from src.graphql.tenants.sys.users.queries import TenantUserQueries
        print("✓ TenantUserQueries imported")
    except ImportError as e:
        errors.append(f"TenantUserQueries: {e}")
        print(f"✗ TenantUserQueries import failed: {e}")
    
    # Test mutations
    try:
        from src.graphql.tenants.sys.users.mutations import TenantUserMutations
        print("✓ TenantUserMutations imported")
    except ImportError as e:
        errors.append(f"TenantUserMutations: {e}")
        print(f"✗ TenantUserMutations import failed: {e}")
    
    # Test loaders
    try:
        from src.graphql.tenants.sys.users.loaders import TenantUserLoader
        print("✓ TenantUserLoader imported")
    except ImportError as e:
        errors.append(f"TenantUserLoader: {e}")
        print(f"✗ TenantUserLoader import failed: {e}")
    
    # Test permissions
    try:
        from src.graphql.tenants.sys.users.permissions import CanViewUsers
        print("✓ Permissions imported")
    except ImportError as e:
        errors.append(f"Permissions: {e}")
        print(f"✗ Permissions import failed: {e}")
    
    print("\n" + "="*50)
    if errors:
        print(f"❌ {len(errors)} import errors found")
        for err in errors:
            print(f"  - {err}")
        return False
    else:
        print("✅ All imports successful!")
        return True

if __name__ == "__main__":
    success = test_imports()
    sys.exit(0 if success else 1)
