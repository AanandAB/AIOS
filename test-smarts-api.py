#!/usr/bin/env python3
"""
Test script to verify SMARTS API endpoints are working
"""

import requests
import json
import time

def test_smarts_api():
    """Test SMARTS API endpoints"""
    
    base_url = "http://localhost:9991"
    
    print("Testing SMARTS API endpoints...")
    
    # Test 1: Get current configuration
    try:
        response = requests.get(f"{base_url}/smarts/configuration")
        if response.status_code == 200:
            print("✅ GET /smarts/configuration - Success")
            config = response.json()
            print(f"   Current configuration: {config.get('configuration', 'N/A')}")
        else:
            print(f"❌ GET /smarts/configuration - Failed with status {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("⚠️  GET /smarts/configuration - Could not connect (API might not be running)")
    except Exception as e:
        print(f"❌ GET /smarts/configuration - Error: {e}")
    
    # Test 2: Process a simple task
    task_data = {
        "description": "What is the capital of France?",
        "taskId": f"test-task-{int(time.time())}"
    }
    
    try:
        response = requests.post(f"{base_url}/smarts/process-task", json=task_data)
        if response.status_code == 200:
            print("✅ POST /smarts/process-task - Success")
            result = response.json()
            print(f"   Task result: {result.get('success', 'N/A')}")
        elif response.status_code == 404:
            print("⚠️  POST /smarts/process-task - Endpoint not found (API might not be running)")
        else:
            print(f"❌ POST /smarts/process-task - Failed with status {response.status_code}")
            print(f"   Response: {response.text}")
    except requests.exceptions.ConnectionError:
        print("⚠️  POST /smarts/process-task - Could not connect (API might not be running)")
    except Exception as e:
        print(f"❌ POST /smarts/process-task - Error: {e}")
    
    # Test 3: Trigger evolution
    try:
        response = requests.post(f"{base_url}/smarts/evolve")
        if response.status_code == 200:
            print("✅ POST /smarts/evolve - Success")
            result = response.json()
            print(f"   Evolution result: {result.get('success', 'N/A')}")
        elif response.status_code == 404:
            print("⚠️  POST /smarts/evolve - Endpoint not found (API might not be running)")
        else:
            print(f"❌ POST /smarts/evolve - Failed with status {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("⚠️  POST /smarts/evolve - Could not connect (API might not be running)")
    except Exception as e:
        print(f"❌ POST /smarts/evolve - Error: {e}")

if __name__ == "__main__":
    print("SMARTS API Test Script")
    print("=" * 30)
    test_smarts_api()
    print("\nTo run these tests:")
    print("1. Start Bytebot: docker-compose -f docker/docker-compose.yml up -d")
    print("2. Wait for services to start (check http://localhost:9992)")
    print("3. Run this script again")